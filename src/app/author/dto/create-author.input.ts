import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreateAuthorInput {
  @Field()
  @IsString()
  name: string;
}
