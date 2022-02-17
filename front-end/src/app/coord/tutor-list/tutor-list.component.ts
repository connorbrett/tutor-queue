import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@services/user/user.service';
import { Course } from '@services/course/course.service';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast/toast.service';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.less'],
})
export class TutorListComponent implements OnInit {
  tutors: User[] = [];
  isLoading = true;

  constructor(private userService: UserService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((tutors) => {
      this.tutors = tutors.results;
      this.isLoading = false;
    });
  }

  resetPassword(email: string) {
    return this.userService.resetPassword(email).subscribe((success) => {
      this.toastService.showSuccess({
        header: 'Email Sent!',
        content: `${email} reset email sent!`,
      });
    });
  }

  getCoursesString(courses: Course[]) {
    return courses
      .map((e) => e.code)
      .sort()
      .join(', ');
  }
}
