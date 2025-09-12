import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  // TODO: Add password confirmation field validation
  // TODO: Add password strength validation (uppercase, lowercase, numbers, special chars)
  // TODO: Add email domain validation if needed
  // TODO: Add terms and conditions acceptance validation
}
