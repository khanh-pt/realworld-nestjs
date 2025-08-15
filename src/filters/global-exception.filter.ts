import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { ErrorDetailDto } from 'src/common/dto/error-detail.dto';
import { ErrorDto } from 'src/common/dto/error.dto';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: Error | HttpException | QueryFailedError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      error = this.handleQueryFailedError(exception);
    } else {
      error = this.handleError(exception);
    }

    response.status(error.statusCode).json(error);
  }

  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ): ErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: 'Validation failed',
      details: this.extractValidationErrorDetails(r.message),
    };

    return errorRes;
  }

  private handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: exception.message,
    };

    return errorRes;
  }

  private handleQueryFailedError(error: QueryFailedError): ErrorDto {
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.CONFLICT,
      error: STATUS_CODES[HttpStatus.CONFLICT],
      message: error.message,
    } as unknown as ErrorDto;

    return errorRes;
  }

  private handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error.message || 'An unexpected error occurred',
    };

    return errorRes;
  }

  private extractValidationErrorDetails(
    errors: ValidationError[],
  ): ErrorDetailDto[] {
    const extractErrors = (
      error: ValidationError,
      parentProperty: string = '',
    ): ErrorDetailDto[] => {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: ErrorDetailDto[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property: propertyPath,
        code,
        message,
      }));

      const childErrors: ErrorDetailDto[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, propertyPath),
        ) || [];

      return [...currentErrors, ...childErrors];
    };

    return errors.flatMap((error) => extractErrors(error));
  }
}
