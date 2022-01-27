import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Course } from '@app/../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}

  public getAll() {
    return this.http.get<Course[]>(`${environment.apiHost}courses`);
  }
}
