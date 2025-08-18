import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    // Log the incoming request
    this.logger.log(`START REQUEST 📥 ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;

          // Log successful response
          this.logger.log(
            `END REQUEST ✅ ${method} ${url} - ${statusCode} - ${duration}ms`,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;

          // Log error response
          this.logger.error(
            `END REQUEST ❌ ${method} ${url} - ${error.message || 500} - ${duration}ms`,
            error.stack,
          );
        },
      }),
    );
  }
}
