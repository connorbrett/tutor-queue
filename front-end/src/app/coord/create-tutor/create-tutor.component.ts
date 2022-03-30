import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';
import { UserService } from '@services/user/user.service';

const LOWER_LEVEL_CSC_CLASSES = /^CSC1/;

export function verifySameAsValidator(idOfOther: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent?.get(idOfOther)?.value !== control.value) {
      return { required: { value: 'This field needs to match the other field.' } };
    }
    return null;
  };
}

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
    re_password: new FormControl('', [Validators.required, verifySameAsValidator('password')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    courses: new FormControl('', Validators.required),
  });

  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseService.getAll().subscribe((courses) => (this.courses = courses.results));
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.requestForm.valid) return;

    this.requestForm.value.courses = (this.requestForm.value.courses as string[]).concat(
      ...this.courses.filter((e) => e.code.match(LOWER_LEVEL_CSC_CLASSES)).map((e) => e._id)
    );

    this.userService.create(this.requestForm.value).subscribe({
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
}
