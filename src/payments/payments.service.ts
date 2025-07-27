import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {

    private readonly stripe = new Stripe(envs.stripeSecret)

    constructor() { }

    async createPaymentSession(createSessionDto: CreateSessionDto) {
        const { currency, items, orderId } = createSessionDto;

        const lineItems = items.map(item => ({
            price_data: {
                currency,
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

        return session
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
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('✅ PaymentIntent succeeded:', {
                    metadata: paymentIntent.metadata,
                    orderId: paymentIntent.metadata?.orderId
                });
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return response.status(200).json(sig)
    }
}
