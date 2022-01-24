import { Component, OnInit } from '@angular/core';
import {ICourse} from '../../models';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.less']
})
export class RequestFormComponent implements OnInit {
  courses: ICourse[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
