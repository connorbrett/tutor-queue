import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { RequestService, REQUEST_QUEUE_EVENT, TutoringRequest } from '@services/request/request.service';
import { environment } from '@environments/environment';

/** Component to show a list of all requests currently not helped. */
@Component({
  selector: 'app-student-queue',
  templateUrl: './student-queue.component.html',
  styleUrls: ['./student-queue.component.less'],
})
export class StudentQueueComponent implements OnInit, OnDestroy {
  isLoading = true;
  queue: TutoringRequest[] = [];
  isVisible = true;
  oldTitle = '';

  reloadTimer = -1;

  firstLoad = true;

  /**
   * @param requestService Service to interact with /requests API.
   * @param bus Event bus.
   * @param ngZone Angular zone.
   */
  constructor(private requestService: RequestService, private bus: NgEventBus, private ngZone: NgZone) {
    bus.on(REQUEST_QUEUE_EVENT).subscribe(() => {
      this.loadQueue();
    });
    document.addEventListener('visibilitychange', () => {
      this.isVisible = document.visibilityState === 'visible';
      if (this.isVisible && this.oldTitle) {
        document.title = this.oldTitle;
      }
    });
  }

  /**
   * Load queue and setup interval on page load.
   */
  ngOnInit(): void {
    this.loadQueue();
    this.reloadTimer = this.ngZone.run(() => window.setInterval(() => this.loadQueue(), environment.reloadTime));

    this.firstLoad = false;
  }

  /** On component destroy, remove the interval. */
  ngOnDestroy(): void {
    clearInterval(this.reloadTimer);
  }

  /**
   * Assign a specific request to me.
   *
   * @param req Tutoring request to assign to me.
   */
  assignToMe(req: TutoringRequest): void {
    this.requestService.assign(req).subscribe(
      () => {
        this.bus.cast(REQUEST_QUEUE_EVENT);
      },
      (err) => {
        alert(err.message);
        this.bus.cast(REQUEST_QUEUE_EVENT);
      }
    );
  }

  /**
   * Play a beep sound.
   */
  beep(): void {
    const snd = new Audio('/assets/ping.mp3');
    snd.play();
  }

  /**
   * Load the queue from the API.
   */
  loadQueue(): void {
    this.isLoading = true;
    const flag = this.firstLoad;
    this.requestService.getQueue().subscribe((queue) => {
      this.ngZone.run(() => {
        // On first load do not run beep.
        if (!flag && queue.results.some((item) => !this.queue.find((e) => e._id === item._id))) {
          this.beep();
        }

        // Set title if not visible.
        if (!this.isVisible) {
          if (!this.oldTitle) this.oldTitle = document.title;
          document.title = `(${this.queue.length}) in Queue`;
        }
        this.queue = queue.results;
        this.isLoading = false;
      });
    });
  }
}
