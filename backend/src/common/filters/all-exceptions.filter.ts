import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MESSAGES } from '../constants/string-const';

/**
 * Global exception filter that catches ALL exceptions (including non-HTTP)
 * Provides consistent error response format and detailed logging
 * This filter catches exceptions that are not HttpExceptions
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Generate request ID for tracking
    const requestId = crypto.randomUUID();

    // Determine status code and message
    let status: number;
    let message: string | string[];
    let error: string | undefined;

    if (exception instanceof HttpException) {
      // Handle HttpException
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

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
    } else if (exception instanceof Error) {
      // Handle standard Error
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = MESSAGES.INTERNAL_SERVER_ERROR;
      error = exception.name;

      this.logger.error('Unhandled Error caught', {
        requestId,
        method: request.method,
        url: request.url,
        errorName: exception.name,
        errorMessage: exception.message,
        stack: exception.stack,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Handle unknown exception type
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = MESSAGES.UNEXPECTED_ERROR;

      this.logger.error('Unknown exception caught', {
        requestId,
        method: request.method,
        url: request.url,
        exception: String(exception),
        timestamp: new Date().toISOString(),
      });
    }

    // Log error with context
    this.logger.error('Exception caught', {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: status,
      message,
      error,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      timestamp: new Date().toISOString(),
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
