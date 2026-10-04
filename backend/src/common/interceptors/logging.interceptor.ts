import {
  Injectable, NestInterceptor, ExecutionContext,
  CallHandler, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

function extractEmail(req: Request): string {
  // Authenticated routes: JWT guard populates req.user with the full User entity
  const u = (req as any).user;
  if (u?.email) return u.email;
  // Public auth routes (register / login / verify-otp / resend-otp): email in body
  if (req.body?.email) return req.body.email as string;
  return 'anon';
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req   = ctx.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const email = extractEmail(req);
    const start = Date.now();

    this.logger.log(`[${email}] → ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const res = ctx.switchToHttp().getResponse<Response>();
          this.logger.log(`[${email}] ← ${res.statusCode} ${method} ${url} (${Date.now() - start}ms)`);
        },
        error: (err: Error) => {
          const ms  = Date.now() - start;
          const msg = err?.message ?? 'unknown error';
          this.logger.warn(`[${email}] ← ERR ${method} ${url} (${ms}ms) — ${msg}`);
        },
      }),
    );
  }
}
