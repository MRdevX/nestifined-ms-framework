import { join } from "node:path";
import { ApolloDriverConfig } from "@nestjs/apollo";

export const graphqlConfig: ApolloDriverConfig = {
  autoSchemaFile: join(process.cwd(), "src/schema.gql"),
  sortSchema: true,
  playground: true,
  introspection: true,
  context: ({ req }) => ({ req }),
  formatError: (error) => {
    const originalError = error.extensions?.originalError as
      | { message?: string; statusCode?: number; error?: string }
      | undefined;

    if (originalError) {
      return {
        message: originalError.message,
        statusCode: originalError.statusCode,
        error: originalError.error,
      };
    }

    return error;
  },
  plugins: [],

  debug: true,
  autoTransformHttpErrors: true,
};
