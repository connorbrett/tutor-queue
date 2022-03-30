import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import {
  RequestService,
  REQUEST_ID_LOCALSTORAGE,
  REQUEST_QUEUE_EVENT,
  TutoringRequest,
} from '@services/request/request.service';
import { NgEventBus } from 'ng-event-bus';

@Component({
  selector: 'app-queue-place',
  templateUrl: './queue-place.component.html',
  styleUrls: ['./queue-place.component.less'],
})
export class QueuePlaceComponent implements OnInit, OnDestroy {
  queue: TutoringRequest[] = [];
  place = -1;
  isLoading = false;
  reloadTimer = -1;
  constructor(
    private requestService: RequestService,
    private activatedRoute: ActivatedRoute,
    private bus: NgEventBus,
    private router: Router,
    private ngZone: NgZone
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
        this.reloadTimer = this.ngZone.runOutsideAngular(() =>
          window.setInterval(() => this.getPlaceInQueue(requestId), environment.reloadTime)
        );
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.reloadTimer);
  }

  getPlaceInQueue(id: string) {
    this.isLoading = true;
    this.requestService.getQueue().subscribe((queue) => {
      this.ngZone.run(() => {
        this.queue = queue.results;
        this.place = this.queue.findIndex((e) => e._id === id);
        this.isLoading = false;
      });
    });
  }
}
