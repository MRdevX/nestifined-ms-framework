import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

@InputType()
export class CreateBookInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsUUID()
  authorId: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @Field()
  @IsString()
  isbn: string;

  @Field()
  @IsString()
  summary: string;
}
