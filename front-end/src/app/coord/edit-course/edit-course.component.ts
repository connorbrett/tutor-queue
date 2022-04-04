import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';
import { UserService } from '@services/user/user.service';

/**
 * Edit tutor page.
 *
 */
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.less'],
})
export class EditCourseComponent {
  _course: Course | null = null;

  loading = false;

  wasValidated = false;

  requestForm: FormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    code: new FormControl('', [Validators.required]),
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
    this.course = this.router.getCurrentNavigation()?.extras?.state?.course;
    if (!this.course) {
      this.loading = true;
      this.courseService.getDetail(this.route.snapshot.params.id).subscribe(
        (course) => {
          this.course = course;
          this.error = '';
          this.loading = false;
        },
        (err) => {
          this.error = err.message;
          this.loading = false;
        }
      );
    }
  }

  /**
   * Handle form validation and submission.
   */
  onSubmit(): void {
    this.wasValidated = true;
    if (this.requestForm.valid) {
      console.log(this.requestForm.value);
      if (this.course) {
        this.userService.update(this.course?._id, this.requestForm.value).subscribe({
          next: () => {
            this.router.navigate(['coord', 'courses']);
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
   * Get the form control element 'name'.
   *
   * @returns {AbstractControl | null } Form control element that matches name.
   */
  get code(): AbstractControl | null {
    return this.requestForm.get('code');
  }

  /**
   * Get the form control element 'email'.
   *
   * @returns {AbstractControl | null } Form control element that matches email.
   */
  get name(): AbstractControl | null {
    return this.requestForm.get('name');
  }

  /**
   * @returns {Course | null} Get the current course, either from API or from history.
   */
  get course(): Course | null {
    return this._course;
  }

  /**
   * Set the current course to passed in val and patch the form with the new values.
   */
  set course(val: Course | null) {
    this._course = val;
    console.log(val);
    if (val) this.requestForm.patchValue(val);
  }
}
