import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { RequestService, REQUEST_ID_LOCALSTORAGE, TutoringRequest } from '@utilities/services/request/request.service';

@Component({
  selector: 'app-student-queue',
  templateUrl: './student-queue.component.html',
  styleUrls: ['./student-queue.component.less'],
})
export class StudentQueueComponent implements OnInit {
  isLoading = true;
  queue: TutoringRequest[] = [];

  currentRequest: number = -1;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue() {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.queue = queue;
      const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
      if (requestId) this.currentRequest = this.queue.findIndex((val) => val._id === requestId);
      this.isLoading = false;
    });
  }
}
