import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    if (process.env.NODE_ENV !== "production") {
      this.logger.error("GraphQL Error:", exception);
    }

    if (exception instanceof GraphQLError) {
      return exception;
    }

    const message = exception?.message || "An unexpected error occurred";
    const status = typeof exception?.status === "number" ? exception.status : 500;
    const errorName = exception?.error || (status >= 500 ? "Internal Server Error" : "Bad Request");

    return new GraphQLError(status >= 500 ? "Internal Server Error" : message, {
      extensions: {
        code: status >= 500 ? "INTERNAL_SERVER_ERROR" : "BAD_USER_INPUT",
        originalError: {
          message,
          statusCode: status,
          error: errorName,
        },
      },
    });
  }
}
