import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { ERRORS } from '../errors/errors';

interface ExceptionResponse {
  message?: string;
  code?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(readonly _configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.getErrorMessage(exception),
      code: this.getErrorCode(exception),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string' ? response : (response as ExceptionResponse).message || 'Unknown error';
    }
    return ERRORS.GENERIC.INTERNAL_SERVER_ERROR.message;
  }

  private getErrorCode(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string' ? 'UNKNOWN_ERROR' : (response as ExceptionResponse).code || 'UNKNOWN_ERROR';
    }
    return ERRORS.GENERIC.INTERNAL_SERVER_ERROR.code;
  }
}
