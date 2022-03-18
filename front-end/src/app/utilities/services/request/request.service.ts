import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BaseApiService } from '../base-api/base-api.service';
import { Pageable } from '../base-api/paging.model';
import { Course } from '../course/course.service';
import { BaseService } from '../base-service/base-service.service';

export const REQUEST_ID_LOCALSTORAGE = 'requestId';

export const ALL_REQUEST_EVENTS = 'request:*';
export const REQUEST_QUEUE_EVENT = 'request:queue';
export const REQUEST_UPDATE_EVENT = 'request:update';

export interface TutoringRequest {
  email: string;
  name: string;
  requested_course: Course;
  description: string;
  _id: string;
  status: string;
  tutor: User;
  closed_time: string;
  created_time: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService extends BaseService<TutoringRequest> {
  constructor(http: BaseApiService, private userService: UserService) {
    super(http, 'requests');
  }

  public getQueue() {
    return this.get({
      status: 'WAITING',
    });
  }

  public getCurrent() {
    return this.userService.getUser().pipe(
      switchMap((currentUser: User | null) => {
        if (!currentUser) return throwError(new Error('Need to be logged in'));
        return this.get({
          status: 'INPROGRESS',
          tutor: currentUser._id,
        });
      })
    );
  }

  public getRecent() {
    return this.get({
      status: 'COMPLETE',
      limit: 10,
      ordering: '-closed_time',
    });
  }

  public assign(req: TutoringRequest) {
    return this.userService.getUser().pipe(
      switchMap((currentUser: User | null) => {
        if (!currentUser) return throwError(new Error('Need to be logged in'));
        return this.update(req._id, {
          status: 'INPROGRESS',
          tutor: currentUser._id,
        });
      })
    );
  }

  public markComplete(req: TutoringRequest) {
    return this.userService.getUser().pipe(
      switchMap((currentUser: User | null) => {
        if (!currentUser) return throwError(new Error('Need to be logged in'));
        return this.update(req._id, {
          status: 'COMPLETE',
          completed: new Date(),
          tutor: currentUser._id,
        });
      })
    );
  }
}
