import { ArrayMinSize, IsArray, IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';
import { PaymentSessionItemDto } from './payment-session-item.dto';
import { Type } from 'class-transformer';

export class CreateSessionDto {

    @IsString()
    orderId: string;

    @IsEnum(['PEN', 'USD'], {
        message: 'Currency must be either PEN or USD'
    })
    currency: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => PaymentSessionItemDto)
    items: PaymentSessionItemDto[]
}