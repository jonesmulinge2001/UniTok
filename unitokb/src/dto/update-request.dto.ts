/* eslint-disable prettier/prettier */
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRequestDto {

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  details?: string;

  @IsOptional()
  @IsOptional()
  @IsString()
  targetInstitution?: string;
}