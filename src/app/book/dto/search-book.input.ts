import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsOptional, IsString } from "class-validator";

@InputType()
export class SearchBookInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  author?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  isbn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  publishedDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  summary?: string;
}
