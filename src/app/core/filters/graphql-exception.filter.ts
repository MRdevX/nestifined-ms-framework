import { ArgumentsHost, Catch } from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();

    console.error("GraphQL Error:", exception);

    if (exception instanceof GraphQLError) {
      return exception;
    }

    if (exception.status) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: exception.status,
          originalError: {
            message: exception.message,
            statusCode: exception.status,
            error: exception.error || "Internal Server Error",
          },
        },
      });
    }

    return new GraphQLError("Internal Server Error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        originalError: {
          message: exception.message || "An unexpected error occurred",
          statusCode: 500,
          error: "Internal Server Error",
        },
      },
    });
  }
}
