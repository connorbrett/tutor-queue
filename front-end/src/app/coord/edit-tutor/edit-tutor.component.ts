import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';
import { User, UserService } from '@services/user/user.service';
import { map } from 'rxjs/operators';

const LOWER_LEVEL_CSC_CLASSES = /^CSC1/;

@Component({
  selector: 'app-edit-tutor',
  templateUrl: './edit-tutor.component.html',
  styleUrls: ['./edit-tutor.component.less'],
})
export class EditTutorComponent implements OnInit {
  _user: User | null = null;
  courses: Course[] = [];

  loading = false;

  wasValidated = false;

  requestForm: FormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    courses: new FormControl('', Validators.required),
  });

  error = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private courseService: CourseService
  ) {
    this.user = this.router.getCurrentNavigation()?.extras?.state?.user;
    if (!this.user) {
      this.loading = true;
      this.userService
        .getAll()
        .pipe(map((e) => e.results))
        .subscribe((users) => {
          this.user = users.find((e) => e._id === this.activatedRoute.snapshot.params.id) || null;
          console.log(this.user);
          if (!this.user) {
            throw new Error('User not found.');
          }
          this.loading = false;
        });
    }
  }

  ngOnInit(): void {
    this.courseService.getAll().subscribe((courses) => (this.courses = courses.results));
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.requestForm.valid) return;
    console.log(this.requestForm.value);
    if (this.user) {
      this.requestForm.value.courses = (this.requestForm.value.courses as string[]).concat(
        ...this.courses.filter((e) => e.code.match(LOWER_LEVEL_CSC_CLASSES)).map((e) => e._id)
      );
      this.userService.update(this.user?._id, this.requestForm.value).subscribe({
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
  }

  isLowerLevel(course: Course): boolean {
    return !!course.code.match(LOWER_LEVEL_CSC_CLASSES);
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

  get re_password() {
    return this.requestForm.get('re_password');
  }

  get user() {
    return this._user;
  }
  set user(val: User | null) {
    this._user = val;
    if (val)
      this.requestForm.patchValue({
        ...val,
        courses: val.courses.filter((e) => !e.code.match(LOWER_LEVEL_CSC_CLASSES)).map((e) => e._id),
      });
  }
}
