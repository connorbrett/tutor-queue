import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@services/user/user.service';
import { Course } from '@services/course/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.less'],
})
export class TutorListComponent implements OnInit {
  tutors: User[] = [];
  isLoading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((tutors) => {
      this.tutors = tutors.results;
      this.isLoading = false;
    });
  }

  getCoursesString(courses: Course[]) {
    return courses
      .map((e) => e.code)
      .sort()
      .join(', ');
  }
}
