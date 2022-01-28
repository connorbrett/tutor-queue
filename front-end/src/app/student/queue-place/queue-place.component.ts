import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RequestService,
  REQUEST_ID_LOCALSTORAGE,
  REQUEST_QUEUE_EVENT,
  TutoringRequest,
} from '@utilities/services/request/request.service';
import { NgEventBus } from 'ng-event-bus';

@Component({
  selector: 'app-queue-place',
  templateUrl: './queue-place.component.html',
  styleUrls: ['./queue-place.component.less'],
})
export class QueuePlaceComponent implements OnInit {
  queue: TutoringRequest[] = [];
  place: number = -1;
  isLoading = false;
  constructor(private requestService: RequestService, private activatedRoute: ActivatedRoute, private bus: NgEventBus) {
    bus.on(REQUEST_QUEUE_EVENT).subscribe((data) => {
      const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
      if (requestId) this.getPlaceInQueue(requestId);
    });
  }

  ngOnInit(): void {
    const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
    if (requestId) this.getPlaceInQueue(requestId);
  }

  getPlaceInQueue(id: string) {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.queue = queue;
      this.place = this.queue.findIndex((e) => e._id === id);
      this.isLoading = false;
    });
  }
}
