import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '@services/course/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.less'],
})
export class CourseFormComponent {
  wasValidated = false;
  test = 1;
  requestForm = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    code: new FormControl('', [Validators.pattern('^CSC[0-9]{3}$'), Validators.required]),
  });

  error = '';

  constructor(private formBuilder: FormBuilder, private courseService: CourseService, private router: Router) {}

  onSubmit() {
    this.wasValidated = true;
    if (!this.requestForm.valid) return;

    this.courseService.create(this.requestForm.value).subscribe({
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

  get name() {
    return this.requestForm.get('name');
  }

  get code() {
    return this.requestForm.get('email');
  }
}
