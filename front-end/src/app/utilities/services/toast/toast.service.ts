import { Injectable, TemplateRef } from '@angular/core';

interface ToastBody {
  header: string;
  content: string;
}

export interface Toast {
  header: string;
  template: TemplateRef<any>;
  body: ToastBody;
  classname: string;
  delay: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  show(textOrTpl: ToastBody | TemplateRef<any>, options: any = {}) {
    if (textOrTpl instanceof TemplateRef) {
      this.toasts.push({
        template: textOrTpl,
        ...options,
      });
    } else {
      this.toasts.push({ body: textOrTpl, ...options });
    }
  }

  showSuccess(textOrTpl: ToastBody | TemplateRef<any>, options: any = {}) {
    this.show(textOrTpl, { ...options, classname: 'bg-success text-light', delay: 10000 });
  }

  showError(textOrTpl: ToastBody | TemplateRef<any>, options: any = {}) {
    this.show(textOrTpl, { ...options, classname: 'bg-danger text-light', delay: 15000 });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
