import { ErrorHandler } from '@angular/core';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private ngZone: NgZone, private snackBar: MatSnackBar) {}

  handleError(error: any): void {
    const message = error?.message || error.toString();
    this.ngZone.run(() => {
      if (!!error) {
        this.snackBar.open(message, 'Dismiss', { duration: 5000 });
        console.error(message);
      }
    });
  }
}
