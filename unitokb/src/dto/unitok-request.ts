/* eslint-disable prettier/prettier */
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRequestDto {

  @IsString()
  @MinLength(5)
  @MaxLength(150)
  title: string;

  @IsString()
  @MinLength(10)
  details: string;

  @IsOptional()
  @IsString()
  targetInstitution?: string;
}