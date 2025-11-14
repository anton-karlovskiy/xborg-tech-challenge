import { IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

/**
 *
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: "firstName must be a string" })
  @MaxLength(100, { message: "firstName must not exceed 100 characters" })
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return null;
    }
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : null;
  })
  firstName?: string | null;

  @IsOptional()
  @IsString({ message: "lastName must be a string" })
  @MaxLength(100, { message: "lastName must not exceed 100 characters" })
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return null;
    }
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : null;
  })
  lastName?: string | null;
}
