import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, retryWhen, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication/authentication.service';

const retryCount = 1;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen((error) =>
        error.pipe(
          concatMap((error, count) => {
            if (count < retryCount && error.status == 401) {
              return this.authService.refresh().pipe(
                switchMap(() => {
                  const clone = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${this.authService.accessToken}`,
                    },
                  });
                  return next.handle(clone);
                })
              );
            }
            return throwError(error);
          })
        )
      )
    );
  }
}
