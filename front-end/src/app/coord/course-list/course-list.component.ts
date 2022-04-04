import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';

/**
 * Component to list all of the courses in the admin dashboard.
 */
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.less'],
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;

  /**
   * Constructor.
   *
   * @param courseService Injected service to interact with /courses endpoint.
   * @param router Injected router.
   * @param route Injected route.
   */
  constructor(private courseService: CourseService, private router: Router, private route: ActivatedRoute) {}

  /** Load all courses on page load. */
  ngOnInit(): void {
    this.loadCourses();
  }

  /**
   * Actually do the loading.
   */
  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAll().subscribe((courses) => {
      this.isLoading = false;
      this.courses = courses.results;
    });
  }

  /**
   * Redirect user to edit a specific item.
   *
   * @param item Item to navigate to.
   */
  editItem(item: Course): void {
    this.router.navigate([item._id, 'edit'], {
      relativeTo: this.route,
      state: {
        course: item,
      },
    });
  }

  /**
   * Deletes a specific item.
   *
   * @param item Item to delete.
   */
  deleteItem(item: Course): void {
    this.isLoading = true;
    this.courseService.delete(item._id).subscribe(() => {
      this.loadCourses();
    });
  }
}
