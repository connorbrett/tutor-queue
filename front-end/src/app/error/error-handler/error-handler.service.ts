import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { ThrottleError } from '../exceptions/exceptions';

const ERROR_EVENT = 'error:*';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private zone: NgZone, private router: Router, private bus: NgEventBus) {}

  handleError(error: any) {
    console.error(error);
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection; // get the error object
    }

    console.error('Error from global error handler', error);
    this.bus.cast(ERROR_EVENT, {
      label: JSON.stringify(error),
      text: error,
    });
  }
}
