import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const _gqlHost = GqlArgumentsHost.create(host);

    if (process.env.NODE_ENV !== "production") {
      this.logger.error("GraphQL Error:", exception);
    }

    if (exception instanceof GraphQLError) {
      return exception;
    }

    const errorObj = exception as { message?: string; status?: number; error?: string };
    const message = errorObj?.message || "An unexpected error occurred";
    const status = typeof errorObj?.status === "number" ? errorObj.status : 500;
    const errorName = errorObj?.error || (status >= 500 ? "Internal Server Error" : "Bad Request");

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
