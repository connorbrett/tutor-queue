import { Component, TemplateRef } from '@angular/core';
import { Toast, ToastService } from '@services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.less'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
