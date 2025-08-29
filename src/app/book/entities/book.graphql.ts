import { Field, ID, ObjectType } from '@nestjs/graphql';

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

  @Field(() => ID, { nullable: true })
  authorId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
