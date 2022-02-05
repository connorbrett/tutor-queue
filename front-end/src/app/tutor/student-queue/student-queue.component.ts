import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import {
  RequestService,
  REQUEST_QUEUE_EVENT,
  REQUEST_UPDATE_EVENT,
  TutoringRequest,
} from '@services/request/request.service';
import { RELOAD_TIME } from '@utilities/const';

@Component({
  selector: 'app-student-queue',
  templateUrl: './student-queue.component.html',
  styleUrls: ['./student-queue.component.less'],
})
export class StudentQueueComponent implements OnInit, OnDestroy {
  isLoading = true;
  queue: TutoringRequest[] = [];

  reloadTimer = -1;

  firstLoad = true;

  constructor(private requestService: RequestService, private bus: NgEventBus) {
    bus.on(REQUEST_QUEUE_EVENT).subscribe((data) => {
      this.loadQueue();
    });
    document.addEventListener('visibilitychange', (event) => {
      if (document.visibilityState !== 'visible') {
        document.title = `(${this.queue.length}) in Queue`;
      }
    });
  }

  ngOnInit(): void {
    this.loadQueue();
    this.reloadTimer = window.setInterval(() => this.loadQueue(), RELOAD_TIME);

    this.firstLoad = false;
  }

  ngOnDestroy(): void {
    try {
      clearInterval(this.reloadTimer);
    } catch (err) {}
  }

  assignToMe(req: TutoringRequest) {
    this.requestService.assign(req).subscribe(() => {
      this.bus.cast(REQUEST_QUEUE_EVENT);
    });
  }

  beep() {
    var snd = new Audio('/assets/ping.mp3');
    snd.play();
  }

  loadQueue() {
    this.isLoading = true;
    let flag = this.firstLoad;
    this.requestService.getQueue().subscribe((queue) => {
      if (!flag && queue.results.some((item) => !this.queue.find((e) => e._id === item._id))) {
        this.beep();
      }
      this.queue = queue.results;
      this.isLoading = false;
    });
  }
}
