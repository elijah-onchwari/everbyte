import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateCompanyDto {

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly name: string;
}
export interface ICompany {
    id: string;
    name: string;
}