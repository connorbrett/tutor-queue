import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '@utilities/services/course/course.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RequestService, REQUEST_ID_LOCALSTORAGE } from '@utilities/services/request/request.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseService.getAll().subscribe((courses) => (this.courses = courses));
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.requestForm.valid) return;
    this.requestService.create(this.requestForm.value).subscribe((val) => {
      if (this.route.snapshot.queryParamMap.get('reload')) {
        window.location.reload();
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
    return this.requestForm.get('course');
  }

  get description() {
    return this.requestForm.get('description');
  }
}
