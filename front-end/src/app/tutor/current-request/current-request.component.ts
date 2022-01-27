import { Component, OnInit } from '@angular/core';
import {
  RequestService,
  TutoringRequest,
} from '@utilities/services/request/request.service';

@Component({
  selector: 'app-current-request',
  templateUrl: './current-request.component.html',
  styleUrls: ['./current-request.component.less'],
})
export class CurrentRequestComponent implements OnInit {
  requests: TutoringRequest[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.requestService.getCurrent().subscribe((requests) => {
      this.requests = requests;
    });
  }

  markComplete(req: TutoringRequest) {
    this.requestService.markComplete(req).subscribe(() => {
      this.requests = this.requests.filter((e) => e._id !== req._id);
    });
  }
}
