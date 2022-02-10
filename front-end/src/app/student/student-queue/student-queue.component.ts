import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { RequestService, REQUEST_ID_LOCALSTORAGE, TutoringRequest } from '@services/request/request.service';
import { RELOAD_TIME } from '@utilities/const';

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

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadQueue();
    this.reloadTimer = window.setInterval(() => this.loadQueue(), RELOAD_TIME);
  }

  ngOnDestroy(): void {
    clearInterval(this.reloadTimer);
  }

  loadQueue() {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.queue = queue.results;
      const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
      if (requestId) this.currentRequest = this.queue.findIndex((val) => val._id === requestId);
      this.isLoading = false;
    });
  }
}