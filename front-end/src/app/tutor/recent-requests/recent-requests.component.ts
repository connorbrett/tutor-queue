import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import {
  RequestService,
  TutoringRequest,
} from '@utilities/services/request/request.service';

@Component({
  selector: 'app-recent-requests',
  templateUrl: './recent-requests.component.html',
  styleUrls: ['./recent-requests.component.less'],
})
export class RecentRequestsComponent implements OnInit {
  isLoading = true;
  requests: TutoringRequest[] = [];

  constructor(
    private requestService: RequestService,
    private eventBus: NgEventBus
  ) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue() {
    this.isLoading = true;
    this.requestService.getRecent().subscribe((requests) => {
      this.requests = requests;
      this.isLoading = false;
    });
  }
}
