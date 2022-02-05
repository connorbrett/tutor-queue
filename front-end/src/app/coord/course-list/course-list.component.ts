import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course, CourseService } from '@services/course/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.less']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(){
    this.isLoading = true;
    this.courseService.getAll({ordering: 'code'}).subscribe((courses)=>{
      this.isLoading = false;
      this.courses = courses.results;
    })
  }

  editItem(item: Course){
    this.router.navigate(['edit', item._id]);
  }

  deleteItem(item: Course){
    this.isLoading = true;
    this.courseService.delete(item._id).subscribe(()=>{
      this.loadCourses();
    })
  }

}
