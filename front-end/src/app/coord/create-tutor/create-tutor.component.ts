import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '../../utilities/services/course/course.service';
import { RequestService } from '../../utilities/services/request/request.service';
import { UserService } from '../../utilities/services/user/user.service';

const LOWER_LEVEL_CSC_CLASSES = /^CSC1/;

@Component({
  selector: 'app-create-tutor',
  templateUrl: './create-tutor.component.html',
  styleUrls: ['./create-tutor.component.less'],
})
export class CreateTutorComponent implements OnInit {
  courses: Course[] = [];

  wasValidated = false;

  requestForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    courses: new FormControl('', Validators.required),
  });

  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseService
      .getAll()
      .subscribe((courses) => (this.courses = courses.filter((e) => !e.match(LOWER_LEVEL_CSC_CLASSES))));
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.requestForm.valid) return;

    this.userService
      .create({
        ...this.requestForm.value,
        courses: this.course?.value.join(','),
      })
      .subscribe({
        next: (val) => {
          this.router.navigate(['coord', 'tutors']);
        },
        error: (err: Error) => {
          if (err instanceof HttpErrorResponse) {
            this.error = JSON.stringify(err.error);
          }
        },
      });
  }

  get name() {
    return this.requestForm.get('name');
  }

  get email() {
    return this.requestForm.get('email');
  }

  get course() {
    return this.requestForm.get('courses');
  }

  get password() {
    return this.requestForm.get('password');
  }
}
