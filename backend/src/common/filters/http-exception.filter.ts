import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MESSAGES } from '../constants/string-const';

/**
 * Global exception filter that catches all HttpExceptions
 * Provides consistent error response format and detailed logging
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract message from exception response
    let message: string | string[];
    let error: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
      const responseObj = exceptionResponse as any;
      message =
        responseObj.message || exception.message || MESSAGES.UNEXPECTED_ERROR;
      error = responseObj.error;
    } else {
      message = exception.message || MESSAGES.UNEXPECTED_ERROR;
    }

    // Generate request ID for tracking
    const requestId = crypto.randomUUID();

    // Log error with context
    this.logger.error('HTTP Exception caught', {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: status,
      message,
      error,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      timestamp: new Date().toISOString(),
      // Include stack trace in development
      stack:
        process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    });

    // Build error response
    const errorResponse: any = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    // Include error type for client debugging
    if (error) {
      errorResponse.error = error;
    }

    // Include validation errors if present (class-validator)
    if (Array.isArray(message)) {
      errorResponse.validationErrors = message;
      errorResponse.message = MESSAGES.VALIDATION_ERROR;
    }

    // Return consistent error format
    response.status(status).json(errorResponse);
  }
}
