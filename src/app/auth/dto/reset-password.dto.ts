import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // TODO: Add password confirmation field validation
  // TODO: Add password strength validation (uppercase, lowercase, numbers, special chars)
  // TODO: Add token format validation
}
