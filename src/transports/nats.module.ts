import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICES } from 'src/config';
import { envs } from 'src/config/envs';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SERVICES.NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: envs.natsServers
                },
            },
        ]),
    ],
    exports: [
        ClientsModule
    ]
})
export class NatsModule { }
