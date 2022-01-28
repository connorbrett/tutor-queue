import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserService } from '../user/user.service';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const REQUEST_ID_LOCALSTORAGE = 'requestId';

export const ALL_REQUEST_EVENTS = 'request:*';
export const REQUEST_QUEUE_EVENT = 'request:queue';
export const REQUEST_UPDATE_EVENT = 'request:update';

export interface TutoringRequest {
  email: string;
  name: string;
  requested_course: string;
  description: string;
  _id: string;
  status: string;
}

/**
 * DRF can handle pagination by default, we can intercept that here.
 * Good practice, not the most useful for the scale of our op.
 */
export interface Pageable<T> {
  count: number;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient, private userService: UserService) {}

  public create(data: any) {
    return this.http.post<TutoringRequest>(`${environment.apiHost}requests/`, data);
  }

  public getQueue() {
    return this.http
      .get<Pageable<TutoringRequest>>(`${environment.apiHost}requests/?status=WAITING`)
      .pipe(map((val) => val.results));
  }

  public getCurrent() {
    if (!this.userService.currentUser) return throwError(new Error('Need to be logged in'));
    return this.http
      .get<Pageable<TutoringRequest>>(
        `${environment.apiHost}requests/?status=INPROGRESS&tutor=${this.userService.currentUser._id}`
      )
      .pipe(map((val) => val.results));
  }

  public getRecent() {
    return this.http
      .get<Pageable<TutoringRequest>>(`${environment.apiHost}requests/?status=COMPLETE&limit=10`)
      .pipe(map((val) => val.results));
  }

  public assign(req: TutoringRequest) {
    const currentUser = this.userService.currentUser;
    if (!currentUser) return throwError(new Error('Need to be logged in'));
    return this.http.patch(`${environment.apiHost}requests/${req._id}/`, {
      status: 'INPROGRESS',
      tutor: currentUser._id,
    });
  }

  public markComplete(req: TutoringRequest) {
    if (!this.userService.currentUser) return throwError(new Error('Need to be logged in'));
    return this.http.patch(`${environment.apiHost}requests/${req._id}/`, {
      status: 'COMPLETE',
      completed: new Date(),
      tutor: this.userService.currentUser._id,
    });
  }
}
