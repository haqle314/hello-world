import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const [req, res] = context.getArgs();
    let logs = [req.ip, 'user', new Date(), req.method, req.url];
    return next.handle().pipe(
      tap(function (responseBody) {
        logs = logs.concat(res.statusCode, JSON.stringify(responseBody));
        console.log(logs.join(' '));
      }),
    );
  }
}
