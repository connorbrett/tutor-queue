import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { RequestService, TutoringRequest } from '@utilities/services/request/request.service';

@Component({
  selector: 'app-student-queue',
  templateUrl: './student-queue.component.html',
  styleUrls: ['./student-queue.component.less'],
})
export class StudentQueueComponent implements OnInit {
  isLoading = true;
  queue: TutoringRequest[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  assignToMe(req: TutoringRequest) {
    this.requestService.assign(req).subscribe(() => this.loadQueue());
  }

  loadQueue() {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.queue = queue;
      this.isLoading = false;
    });
  }
}
