import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from '../base-api/base-api.service';
import { Pageable } from '../base-api/paging.model';
import { BaseService } from '../base-service/base-service.service';

export interface Course {
  code: string;
  name: string;
  _id: string;
};
@Injectable({
  providedIn: 'root',
})
export class CourseService extends BaseService<Course>{
  constructor(http: BaseApiService) {
    super(http, 'courses');
  }
}
