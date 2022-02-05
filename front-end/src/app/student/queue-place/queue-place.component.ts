import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RequestService,
  REQUEST_ID_LOCALSTORAGE,
  REQUEST_QUEUE_EVENT,
  TutoringRequest,
} from '@services/request/request.service';
import { NgEventBus } from 'ng-event-bus';
import { RELOAD_TIME } from '@utilities/const';

@Component({
  selector: 'app-queue-place',
  templateUrl: './queue-place.component.html',
  styleUrls: ['./queue-place.component.less'],
})
export class QueuePlaceComponent implements OnInit, OnDestroy {
  queue: TutoringRequest[] = [];
  place: number = -1;
  isLoading = false;
  reloadTimer = -1;
  constructor(
    private requestService: RequestService,
    private activatedRoute: ActivatedRoute,
    private bus: NgEventBus,
    private router: Router
  ) {
    bus.on(REQUEST_QUEUE_EVENT).subscribe((data) => {
      const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
      if (requestId) this.getPlaceInQueue(requestId);
    });
  }

  ngOnInit(): void {
    const requestId = localStorage.getItem(REQUEST_ID_LOCALSTORAGE);
    if (requestId) {
      this.getPlaceInQueue(requestId);
      if (this.activatedRoute.snapshot.queryParamMap.get('reload')) {
        setTimeout(
          () =>
            this.router.navigate(['student', 'request'], {
              queryParams: {
                reload: true,
              },
            }),
          10000
        );
      } else {
        this.reloadTimer = window.setInterval(() => this.getPlaceInQueue(requestId), RELOAD_TIME);
      }
    }
  }

  ngOnDestroy(): void {
    try {
      clearInterval(this.reloadTimer);
    } catch (err) {}
  }

  getPlaceInQueue(id: string) {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.queue = queue.results;
      this.place = this.queue.findIndex((e) => e._id === id);
      this.isLoading = false;
    });
  }
}
