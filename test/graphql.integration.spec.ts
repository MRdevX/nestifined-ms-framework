import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import * as request from "supertest";
import { AppModule } from "../src/app/app.module";

describe("GraphQL Integration Tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          typePaths: [join(process.cwd(), "src/schema.gql")],
          playground: false,
          introspection: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GraphQL Endpoint", () => {
    it("should be accessible", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              __schema {
                types {
                  name
                }
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("__schema");
    });

    it("should return books query", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              books {
                id
                title
                isbn
                summary
                authorId
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("books");
      expect(Array.isArray(response.body.data.books)).toBe(true);
    });

    it("should return authors query", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              authors {
                id
                name
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("authors");
      expect(Array.isArray(response.body.data.authors)).toBe(true);
    });

    it("should return single book query", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              book(id: "test-id") {
                id
                title
                isbn
                summary
                authorId
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("book");
    });

    it("should return single author query", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              author(id: "test-id") {
                id
                name
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("author");
    });

    it("should handle book with author field", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              books {
                id
                title
                author {
                  id
                  name
                }
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("books");
    });

    it("should handle search books query", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              searchBooks(input: { title: "test" }) {
                id
                title
                isbn
                summary
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("searchBooks");
      expect(Array.isArray(response.body.data.searchBooks)).toBe(true);
    });

    it("should handle create author mutation", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            mutation {
              createAuthor(input: { name: "Test Author" }) {
                id
                name
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("createAuthor");
    });

    it("should handle create book mutation", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            mutation {
              createBook(input: {
                title: "Test Book"
                authorId: "test-author-id"
                isbn: "1234567890"
                summary: "Test book summary"
              }) {
                id
                title
                isbn
                summary
                authorId
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("createBook");
    });

    it("should handle update author mutation", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            mutation {
              updateAuthor(id: "test-id", input: { name: "Updated Author" }) {
                id
                name
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("updateAuthor");
    });

    it("should handle update book mutation", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            mutation {
              updateBook(id: "test-id", input: { title: "Updated Book" }) {
                id
                title
                updatedAt
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("updateBook");
    });

    it("should handle delete author mutation", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            mutation {
              deleteAuthor(id: "test-id")
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("deleteAuthor");
      expect(response.body.data.deleteAuthor).toBe(true);
    });

    it("should handle delete book mutation", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            mutation {
              deleteBook(id: "test-id")
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("deleteBook");
      expect(response.body.data.deleteBook).toBe(true);
    });

    it("should handle invalid query gracefully", async () => {
      const response = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query: `
            query {
              invalidField {
                id
              }
            }
          `,
        })
        .expect(200);

      expect(response.body).toHaveProperty("errors");
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it("should handle malformed JSON", async () => {
      const response = await request(app.getHttpServer()).post("/graphql").send("{ invalid json }").expect(400);

      expect(response.status).toBe(400);
    });
  });
});
