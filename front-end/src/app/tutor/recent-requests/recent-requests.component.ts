import { Component, OnInit } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import {
  RequestService,
  REQUEST_QUEUE_EVENT,
  REQUEST_UPDATE_EVENT,
  TutoringRequest,
} from '@services/request/request.service';
import { User, UserService } from '@services/user/user.service';
import { first } from 'rxjs/operators';

/**
 * Display a list of all recent requests, pending, in progress or completed.
 */
@Component({
  selector: 'app-recent-requests',
  templateUrl: './recent-requests.component.html',
  styleUrls: ['./recent-requests.component.less'],
})
export class RecentRequestsComponent implements OnInit {
  isLoading = true;
  requests: TutoringRequest[] = [];
  currentUser: User | null = null;

  /**
   * @param requestService Service to interact with /requests.
   * @param eventBus Event bus.
   * @param userService Service to get current user.
   */
  constructor(private requestService: RequestService, private eventBus: NgEventBus, private userService: UserService) {
    eventBus.on(REQUEST_UPDATE_EVENT).subscribe(() => {
      this.loadQueue();
    });
    eventBus.on(REQUEST_QUEUE_EVENT).subscribe(() => {
      this.loadQueue();
    });
    this.userService.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  /**
   * Delete the request with a specific id.
   *
   * @param id Request id to delete.
   */
  deleteRequest(id: string): void {
    this.requestService.delete(id);
  }

  /**
   * Load queue on init.
   */
  ngOnInit(): void {
    this.loadQueue();
  }

  /**
   * Mark the current request as complete.
   *
   * @param request
   */
  markComplete(request: TutoringRequest): void {
    this.requestService.markComplete(request);
  }

  /**
   * Actually load the list of items.
   */
  loadQueue(): void {
    this.isLoading = true;
    this.requestService.getRecent().subscribe((requests) => {
      this.requests = requests.results;
      this.isLoading = false;
    });
  }
}
