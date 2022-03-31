import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';
import { User, UserService } from '@services/user/user.service';
import { map } from 'rxjs/operators';

const LOWER_LEVEL_CSC_CLASSES = /^CSC1/;

/**
 * Edit tutor page.
 *
 */
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

  /**
   * Initialize injected services.
   *
   * @param {ActivatedRoute} route Current route.
   * @param {Router} router Angular router.
   * @param {UserService} userService User API service.
   * @param {FormBuilder} formBuilder FormBuilder inject.
   * @param {CourseService} courseService Course API service.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private courseService: CourseService
  ) {
    // Get the current user, allows passing it through state to prevent multiple API calls.
    this.user = this.router.getCurrentNavigation()?.extras?.state?.user;
    if (!this.user) {
      this.loading = true;
      this.userService
        .getAll()
        .pipe(map((e) => e.results))
        .subscribe((users) => {
          this.user = users.find((e) => e._id === this.route.snapshot.params.id) || null;
          console.log(this.user);
          if (!this.user) {
            throw new Error('User not found.');
          }
          this.loading = false;
        });
    }
  }

  /** Get a list of all courses. */
  ngOnInit(): void {
    this.courseService.getAll().subscribe((courses) => (this.courses = courses.results));
  }

  /**
   * Handle form validation and submission.
   */
  onSubmit(): void {
    this.wasValidated = true;
    if (this.requestForm.valid) {
      console.log(this.requestForm.value);
      if (this.user) {
        // Add the list of courses that are required dynamically.
        this.requestForm.value.courses = (this.requestForm.value.courses as string[]).concat(
          ...this.courses.filter((e) => e.code.match(LOWER_LEVEL_CSC_CLASSES)).map((e) => e._id)
        );
        this.userService.update(this.user?._id, this.requestForm.value).subscribe({
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
  }

  /**
   * Check if the passed in course is required.
   *
   * @param {Course} course Course to validate.
   * @returns {boolean} True if it is required, false otherwise.
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
   * Get the form control element 'email'.
   *
   * @returns {AbstractControl | null } Form control element that matches email.
   */
  get email(): AbstractControl | null {
    return this.requestForm.get('email');
  }

  /**
   * Get the form control element 'course'.
   *
   * @returns { AbstractControl | null } Form control element that matches course.
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
   * @returns {User | null} Get the current user, either from API or from history.
   */
  get user(): User | null {
    return this._user;
  }

  /**
   * Set the current user to passed in val and patch the form with the new values.
   */
  set user(val: User | null) {
    this._user = val;
    if (val)
      this.requestForm.patchValue({
        ...val,
        courses: val.courses.filter((e) => !e.code.match(LOWER_LEVEL_CSC_CLASSES)).map((e) => e._id),
      });
  }
}
