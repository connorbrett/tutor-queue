import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { RequestService, REQUEST_ID_LOCALSTORAGE, TutoringRequest } from '@services/request/request.service';
import { environment } from '@environments/environment';

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

  constructor(private requestService: RequestService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadQueue();
    this.reloadTimer = this.ngZone.runOutsideAngular(() =>
      window.setInterval(() => this.loadQueue(), environment.reloadTime)
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.reloadTimer);
  }

  loadQueue() {
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
