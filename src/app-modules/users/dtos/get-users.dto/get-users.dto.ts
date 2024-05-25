import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetUsersDTO {
  @IsMongoId()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  userIds: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  profilePicUrl: string;

  //   @IsNumber()
  //   @IsOptional()
  //   @Transform(({ value }) => parseInt(value))
  //   minProfilePicSize: number;

  //   @IsNumber()
  //   @IsOptional()
  //   @Transform(({ value }) => parseInt(value))
  //   maxProfilePicSize: number;

  //   @IsString()
  //   @IsOptional()
  //   profilePicType: string;

  @IsString()
  @IsOptional()
  emailValue: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  emailVerified: boolean;

  //   @IsString()
  //   @IsOptional()
  //   phoneCountryCode: string;

  //   @IsString()
  //   @IsOptional()
  //   phoneNumber: string;

  //   @IsBoolean()
  //   @IsOptional()
  //   @Transform(({ value }) => String(value).toLowerCase() === 'true')
  //   phoneVerified: boolean;

  @IsString()
  @IsOptional()
  role: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  minLastLogin: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxLastLogin: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  disabled: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  minDateOfBirth: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxDateOfBirth: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsOptional()
  @IsString()
  fields: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  populate: string;
}
