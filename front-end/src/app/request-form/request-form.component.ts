import { Component, OnInit } from '@angular/core';
import {ICourse} from '../../models';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.less']
})
export class RequestFormComponent implements OnInit {
  courses: ICourse[] = [];

  requestForm = this.formBuilder.group({
    name: '',
    email: '',
    course: ''
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

  }

  onSubmit(){
    console.log(this.requestForm.value)
  }

}
