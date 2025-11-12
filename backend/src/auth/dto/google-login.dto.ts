import {
  IsEmail,
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength
} from "class-validator";
import { Transform } from "class-transformer";

export class GoogleLoginDto {
  @IsString({ message: "googleId must be a string" })
  @MinLength(1, { message: "googleId cannot be empty" })
  @MaxLength(255, { message: "googleId must not exceed 255 characters" })
  googleId: string;

  @IsEmail({}, { message: "email must be a valid email address" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @MaxLength(255, { message: "email must not exceed 255 characters" })
  email: string;

  @IsOptional()
  @IsString({ message: "firstName must be a string" })
  @MaxLength(100, { message: "firstName must not exceed 100 characters" })
  @Transform(({ value }) => value?.trim() || null)
  firstName?: string | null;

  @IsOptional()
  @IsString({ message: "lastName must be a string" })
  @MaxLength(100, { message: "lastName must not exceed 100 characters" })
  @Transform(({ value }) => value?.trim() || null)
  lastName?: string | null;

  @IsOptional()
  @IsUrl({}, { message: "picture must be a valid URL" })
  @MaxLength(500, { message: "picture URL must not exceed 500 characters" })
  picture?: string | null;
}

