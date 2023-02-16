import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';
import { UserService } from '@services/user/user.service';

const LOWER_LEVEL_CSC_CLASSES = /^CSC1/;

/**
 * Check to ensure that the control being validated has the same value as control with @param idOfOther.
 *
 * @param {string} idOfOther Id of the other control.
 * @returns {ValidatorFn} Fn to return indication of validation state.
 */
export function verifySameAsValidator(idOfOther: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent?.get(idOfOther)?.value !== control.value) {
      return { required: { value: 'This field needs to match the other field.' } };
    }
    return null;
  };
}

/**
 * Component to create a tutor.
 */
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
    is_coord: new FormControl(false),
  });

  error = '';

  /**
   * Initialize injected services.
   *
   * @param {FormBuilder} formBuilder FormBuilder inject.
   * @param {UserService} userService User API service.
   * @param {CourseService} courseService Course API service.
   * @param {ActivatedRoute} route Current route.
   * @param {Router} router Angular router.
   */
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Fetch courses on load.
   */
  ngOnInit(): void {
    this.courseService.getAll().subscribe((courses) => (this.courses = courses.results));
  }

  /**
   * Called when the form is submitted, checks validation state and submits if valid.
   *
   */
  onSubmit(): void {
    this.wasValidated = true;
    if (this.requestForm.valid) {
      this.requestForm.value.courses = (this.requestForm.value.courses as string[]).concat(
        ...this.courses.filter((e) => e.code.match(LOWER_LEVEL_CSC_CLASSES)).map((e) => e._id)
      );
      this.userService.create(this.requestForm.value).subscribe({
        next: () => {
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

  /**
   * Is the passed in course a lower level, required course for tutors?
   *
   * @param {Course} course Course to check.
   * @returns {boolean} Indicate if course is required.
   */
  isLowerLevel(course: Course): boolean {
    return !!course.code.match(LOWER_LEVEL_CSC_CLASSES);
  }

  /**
   * Get the form control element 'name'.
   *
   * @returns {AbstractControl | null } Form control element that matches name.
   */
  get name(): AbstractControl | null {
    return this.requestForm.get('name');
  }

  /**
   * Get the form control element 'name'.
   *
   * @returns {AbstractControl | null } Form control element that matches name.
   */
  get email(): AbstractControl | null {
    return this.requestForm.get('email');
  }

  /**
   * Get the form control element 'course'.
   *
   * @returns {AbstractControl | null } Form control element that matches course.
   */
  get course(): AbstractControl | null {
    return this.requestForm.get('courses');
  }

  /**
   * Get the form control element 'password'.
   *
   * @returns {AbstractControl | null } Form control element that matches password.
   */
  get password(): AbstractControl | null {
    return this.requestForm.get('password');
  }

  /**
   * Get the form control element 're_password'.
   *
   * @returns {AbstractControl | null } Form control element that matches re_password.
   */
  get re_password(): AbstractControl | null {
    return this.requestForm.get('re_password');
  }

  /**
   * Get the form control element `is_coord`.
   *
   * @returns Form control element for this component.
   */
  get is_coord(): AbstractControl | null {
    return this.requestForm.get('is_coord');
  }
}
