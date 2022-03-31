import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@services/user/user.service';
import { Course } from '@services/course/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@services/toast/toast.service';

/**
 * Renders a list of all the current tutors.
 */
@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.less'],
})
export class TutorListComponent implements OnInit {
  tutors: User[] = [];
  isLoading = true;

  /**
   *
   * @param userService
   * @param router
   * @param toastService
   * @param activatedRoute
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {}

  /** Get a list of all users. */
  ngOnInit(): void {
    this.userService.getAll().subscribe((tutors) => {
      this.tutors = tutors.results;
      this.isLoading = false;
    });
  }

  /**
   * Begin the reset password flow for a specific passed in email.
   *
   * @param {string} email Email of user to reset password.
   */
  resetPassword(email: string): void {
    this.userService.resetPassword(email).subscribe(() => {
      this.toastService.showSuccess({
        header: 'Email Sent!',
        content: `${email} reset email sent!`,
      });
    });
  }

  /**
   * Navigate user to the correct page to edit the passed in tutor.
   *
   * @param {User} tutor Tutor to edit.
   */
  edit(tutor: User): void {
    this.router.navigate([tutor._id, 'edit'], {
      relativeTo: this.activatedRoute,
      state: {
        user: tutor,
      },
    });
  }

  /**
   * Convert the list of course objects to a readable list.
   *
   * @param {Course[]} courses List of courses to be readable.
   * @returns {string} Readable string of courses.
   */
  getCoursesString(courses: Course[]): string {
    return courses
      .map((e) => e.code)
      .sort()
      .join(', ');
  }
}
