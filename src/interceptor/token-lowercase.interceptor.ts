import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenLowercaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    request.params.token = token.toLowerCase();

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
