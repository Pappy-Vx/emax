import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

function extractEmail(req: Request): string {
  const u = (req as any).user;
  if (u?.email) return u.email;
  if (req.body?.email) return req.body.email as string;
  return 'anon';
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx   = host.switchToHttp();
    const req   = ctx.getRequest<Request>();
    const res   = ctx.getResponse<Response>();
    const email = extractEmail(req);

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Something went wrong. Please try again.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as Record<string, unknown> | string;

      if (typeof body === 'string') {
        message = body;
      } else if (body?.message) {
        message = body.message as string | string[];
      }
    } else if (exception instanceof Error) {
      // MySQL duplicate-entry — treat as a known 409
      if ((exception as any).code === 'ER_DUP_ENTRY') {
        status  = HttpStatus.CONFLICT;
        message = 'An account with that email already exists.';
      } else {
        // Unexpected — log full stack so Render shows the trace
        this.logger.error(
          `[${email}] Unhandled ${exception.constructor.name} on ${req.method} ${req.url}: ${exception.message}`,
          exception.stack,
        );
      }
    }

    const short = Array.isArray(message) ? message[0] : message;

    if (status >= 500) {
      this.logger.error(`[${email}] ${status} ${req.method} ${req.url} — ${short}`);
    } else {
      this.logger.warn(`[${email}] ${status} ${req.method} ${req.url} — ${short}`);
    }

    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
