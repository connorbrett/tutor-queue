import { Component, OnInit } from '@angular/core';
import { UserService, User } from '@utilities/services/user/user.service';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.less'],
})
export class TutorListComponent implements OnInit {
  tutors: User[] = [];
  isLoading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.listTutors().subscribe((tutors) => {
      this.tutors = tutors;
      this.isLoading = false;
    });
  }
}
