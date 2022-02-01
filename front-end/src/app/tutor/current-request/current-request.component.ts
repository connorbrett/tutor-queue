import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  RequestService,
  REQUEST_QUEUE_EVENT,
  REQUEST_UPDATE_EVENT,
  TutoringRequest,
} from '@utilities/services/request/request.service';
import { NgEventBus } from 'ng-event-bus';

@Component({
  selector: 'app-current-request',
  templateUrl: './current-request.component.html',
  styleUrls: ['./current-request.component.less'],
})
export class CurrentRequestComponent implements OnInit {
  requests: TutoringRequest[] = [];

  constructor(private requestService: RequestService, private bus: NgEventBus, private route: ActivatedRoute) {
    bus.on(REQUEST_QUEUE_EVENT).subscribe((data) => {
      this.getCurrent();
    });
    bus.on(REQUEST_UPDATE_EVENT).subscribe((data) => {
      this.getCurrent();
    });
  }

  ngOnInit(): void {
    this.getCurrent();
  }

  getCurrent() {
    this.requestService.getCurrent().subscribe((requests) => {
      this.requests = requests;
    });
  }

  markComplete(req: TutoringRequest) {
    this.requestService.markComplete(req).subscribe(() => {
      this.bus.cast(REQUEST_UPDATE_EVENT);
    });
  }
}
