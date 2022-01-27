import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

export interface TutoringRequest {
  email: string;
  name: string;
  requested_course: string;
  description: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient, private userService: UserService) {}

  public create(data: any) {
    return this.http.post(`${environment.apiHost}requests/`, data);
  }

  public getQueue() {
    return this.http.get<TutoringRequest[]>(
      `${environment.apiHost}requests/queue`
    );
  }

  public assign(req: TutoringRequest) {
    if (!this.userService.currentUser)
      return throwError(new Error('Need to be logged in'));
    console.log(req, this.userService.currentUser);
    return this.http.put(`${environment.apiHost}requests/${req._id}/`, {
      ...req,
      status: 'InProgress',
      tutor: this.userService.currentUser._id,
    });
  }
}
