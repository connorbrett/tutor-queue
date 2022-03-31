import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { RequestService, REQUEST_ID_LOCALSTORAGE, TutoringRequest } from '@services/request/request.service';
import { environment } from '@environments/environment';

/**
 * Render the list of requests ahead of you without revealing student personal information like
 *  name or email.
 */
@Component({
  selector: 'app-student-queue',
  templateUrl: './student-queue.component.html',
  styleUrls: ['./student-queue.component.less'],
})
export class StudentQueueComponent implements OnInit, OnDestroy {
  isLoading = true;
  queue: TutoringRequest[] = [];

  currentRequest = -1;

  reloadTimer = -1;

  /**
   *
   * @param requestService
   * @param ngZone
   */
  constructor(private requestService: RequestService, private ngZone: NgZone) {}

  /** Get the list of users and then set up an interval to reload that list occasionally. */
  ngOnInit(): void {
    this.loadQueue();
    this.reloadTimer = this.ngZone.runOutsideAngular(() =>
      window.setInterval(() => this.loadQueue(), environment.reloadTime)
    );
  }

  /** Remove the interval. */
  ngOnDestroy(): void {
    clearInterval(this.reloadTimer);
  }

  /**
   * Execute HttpRequest to get the actual queue, if there is a current request then find its index
   *  in the response.
   */
  loadQueue(): void {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.ngZone.run(() => {
        this.queue = queue.results;
        const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
        if (requestId) this.currentRequest = this.queue.findIndex((val) => val._id === requestId);
        this.isLoading = false;
      });
    });
  }
}
