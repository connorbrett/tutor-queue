import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import {
  RequestService,
  REQUEST_QUEUE_EVENT,
  REQUEST_UPDATE_EVENT,
  TutoringRequest,
} from '@services/request/request.service';

@Component({
  selector: 'app-recent-requests',
  templateUrl: './recent-requests.component.html',
  styleUrls: ['./recent-requests.component.less'],
})
export class RecentRequestsComponent implements OnInit {
  isLoading = true;
  requests: TutoringRequest[] = [];

  constructor(private requestService: RequestService, private eventBus: NgEventBus) {
    eventBus.on(REQUEST_UPDATE_EVENT).subscribe((data) => {
      this.loadQueue();
    });
    eventBus.on(REQUEST_QUEUE_EVENT).subscribe((data) => {
      this.loadQueue();
    });
  }

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue() {
    this.isLoading = true;
    this.requestService.getRecent().subscribe((requests) => {
      this.requests = requests.results;
      this.isLoading = false;
    });
  }
}
