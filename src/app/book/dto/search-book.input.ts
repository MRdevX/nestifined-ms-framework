import { Field, InputType, Int } from "@nestjs/graphql";
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

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

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
