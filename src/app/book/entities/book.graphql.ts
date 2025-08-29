import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Author } from "../../author/entities/author.graphql";

@ObjectType()
export class Book {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  isbn: string;

  @Field()
  summary: string;

  @Field({ nullable: true })
  publishedDate?: Date;

  @Field(() => Author, { nullable: true })
  author?: Author;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
