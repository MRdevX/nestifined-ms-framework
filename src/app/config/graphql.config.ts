import { ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

export const graphqlConfig: ApolloDriverConfig = {
  autoSchemaFile: join(process.cwd(), "src/schema.gql"),
  sortSchema: true,
  playground: true,
  introspection: true,
  context: ({ req }) => ({ req }),
  formatError: (error) => {
    const originalError = error.extensions?.originalError as any;

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
