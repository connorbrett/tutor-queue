import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThrottleError, UnauthorizedError } from '@app/error/exceptions/exceptions';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let underlyingError: any = error;
        if (error.error instanceof ErrorEvent) {
          underlyingError = error.error;
        } else {
          switch (error.status) {
            case 401:
              this.router.navigate(['/login']);
              break;
            case 429:
              this.router.navigate(['/throttled']);
              break;
            default:
              return throwError(error);
          }
        }
        console.log(underlyingError);
        return throwError(underlyingError);
      })
    );
  }
}
