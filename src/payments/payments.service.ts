import { Injectable, Logger, Inject } from '@nestjs/common';
import { envs, SERVICES } from 'src/config';
import Stripe from 'stripe';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
    
    private readonly logger = new Logger(PaymentsService.name);
    private readonly stripe = new Stripe(envs.stripeSecret)

    constructor(
        @Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy
    ) {}

    async createPaymentSession(createSessionDto: CreateSessionDto) {
        const { currency, items, orderId } = createSessionDto;

        const lineItems = items.map(item => ({
            price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }))

        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: { orderId }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: envs.stripeSuccessUrl,
            cancel_url: envs.stripeCancelUrl,
        })

        return {
            url: session.url,
            cancelUrl: session.cancel_url,
            successUrl: session.success_url,
        }
    }


    async stripeWebhook(request: Request, response: Response) {
        const sig = request.headers['stripe-signature'];
        if (!sig) {
            return response.status(400).json({ error: 'No Stripe signature found' });
        }

        let event: Stripe.Event;
        
        const endpointSecret = envs.stripeEndpointSecret;
        
        try {
            event = this.stripe.webhooks.constructEvent(request['rawBody'], sig, endpointSecret);
        } catch (error) {
            response.status(400).json(`Webhook Error: ${error.message}`);
            return;
        }

        switch (event.type) {
            case 'charge.succeeded': {
                const paymentIntent = event.data.object
                const payload = {
                    stripePaymentId: paymentIntent.id,
                    orderId: paymentIntent.metadata.orderId,
                    receiptUrl: paymentIntent.receipt_url,
                }
                this.client.emit('payment.succeeded', payload);
                break;
            }
            default:
                this.logger.warn(`Unhandled event type: ${event.type}`);
        }

        return response.status(200).json(sig)
    }
}
