import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Book } from "../../book/entities/book.graphql";

@ObjectType()
export class Author {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Book], { nullable: true })
  books?: Book[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
