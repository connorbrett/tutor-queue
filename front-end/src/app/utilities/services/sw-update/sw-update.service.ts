import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

const SW_UPDATE_INTERVAL = 6 * 60 * 60;

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  /**
   *
   * @param updates
   * @param ngZone
   */
  constructor(public updates: SwUpdate, private ngZone: NgZone) {
    if (updates.isEnabled) {
      ngZone.runOutsideAngular(() => {
        interval(1000).subscribe(() => {
          updates.checkForUpdate();
        });
      });
    }
  }

  /**
   *
   */
  public checkForUpdates(): void {
    this.updates.available.subscribe((event) => this.promptUser());
  }

  /**
   *
   */
  private promptUser(): void {
    console.log('can update to new version');
    this.updates
      .activateUpdate()
      .then(() => alert('There is a new version available, please refresh the page to apply updates.'));
  }
}
