import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ThrottleError } from '../exceptions/exceptions';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private zone: NgZone, private router: Router) {}

  handleError(error: any) {
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection; // get the error object
    }

    console.error('Error from global error handler', error);
  }
}
