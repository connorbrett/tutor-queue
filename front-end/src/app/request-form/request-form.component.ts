import { Component, OnInit } from '@angular/core';
import { Course } from '../../models';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RequestService } from '../services/request/request.service';
import { CourseService } from '../services/course/course.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.less'],
})
export class RequestFormComponent implements OnInit {
  courses: Course[] = [];

  wasValidated = false;

  requestForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    requested_course: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseService
      .getAll()
      .subscribe((courses) => (this.courses = courses));
  }

  onSubmit() {
    this.wasValidated = true;
    console.log(this.requestForm);
    //if (!this.requestForm.valid) return;
    this.requestService.create(this.requestForm.value).subscribe((val) => {
      window.location.reload();
    });
  }

  get name() {
    return this.requestForm.get('name');
  }

  get email() {
    return this.requestForm.get('email');
  }

  get course() {
    return this.requestForm.get('course');
  }

  get description() {
    return this.requestForm.get('description');
  }
}
