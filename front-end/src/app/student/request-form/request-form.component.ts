import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '@services/course/course.service';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RequestService, REQUEST_ID_LOCALSTORAGE } from '@services/request/request.service';
import { ActivatedRoute, Router } from '@angular/router';

export function otherValidator(idOfOther: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent?.get(idOfOther)?.value === 'Other' && !control.value) {
      return { required: { value: 'This field is required.' } };
    }
    return null;
  };
}

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
    otherCourse: new FormControl('', [Validators.pattern('^CSC[0-9]{3}$'), otherValidator('requested_course')]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestService,
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
    const data = {
      ...this.requestForm.value,
    };
    if (this.otherCourse?.value) {
      data.requested_course = this.otherCourse.value;
    }
    delete data.otherCourse;

    this.requestService.create(data).subscribe((val) => {
      if (this.route.snapshot.queryParamMap.get('reload')) {
        this.router.navigate(['student', 'place'], {
          queryParams: {
            reload: true,
          },
        });
      } else {
        localStorage.setItem(REQUEST_ID_LOCALSTORAGE, val._id);
        this.router.navigate(['student', 'place']);
      }
    });
  }

  get name() {
    return this.requestForm.get('name');
  }

  get email() {
    return this.requestForm.get('email');
  }

  get course() {
    return this.requestForm.get('requested_course');
  }

  get description() {
    return this.requestForm.get('description');
  }

  get otherCourse() {
    return this.requestForm.get('otherCourse');
  }
}
