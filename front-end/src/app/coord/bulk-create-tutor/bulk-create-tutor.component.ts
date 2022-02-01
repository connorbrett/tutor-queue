import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../utilities/services/user/user.service';

@Component({
  selector: 'app-bulk-create-tutor',
  templateUrl: './bulk-create-tutor.component.html',
  styleUrls: ['./bulk-create-tutor.component.less'],
})
export class BulkCreateTutorComponent {
  bulkForm = this.builder.group({
    file: new FormControl('', Validators.required),
  });

  error = '';

  wasValidated = false;

  rawFile: File | null = null;

  constructor(private builder: FormBuilder, private userService: UserService) {}

  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.rawFile = target.files[0];
    }
  }

  onSubmit() {
    this.wasValidated = true;
    if (!this.bulkForm.valid) return;
    this.userService.createBulk(this.rawFile!).subscribe({
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          this.error = err.statusText;
        }
      },
    });
  }

  get file() {
    return this.bulkForm.get('file');
  }
}
