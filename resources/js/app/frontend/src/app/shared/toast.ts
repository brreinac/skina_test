import { Injectable } from '@angular/core';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'danger';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private container: HTMLElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container position-fixed top-0 end-0 p-3';
    this.container.style.zIndex = '1055';
    document.body.appendChild(this.container);
  }

  show(message: string, type: ToastType = 'info') {
    if (!this.container) return;

    // Convertir "danger" a "error" visualmente
    const bootstrapType = type === 'error' ? 'danger' : type;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${bootstrapType} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto"></button>
      </div>
    `;

    toast.querySelector('.btn-close')?.addEventListener('click', () => toast.remove());

    setTimeout(() => toast.remove(), 3000);

    this.container.appendChild(toast);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  confirm(message: string, onConfirm: () => void) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-warning border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
      <div class="d-flex flex-column p-2">
        <div class="toast-body">${message}</div>
        <div class="mt-2 text-end">
          <button class="btn btn-sm btn-primary me-2">Sí</button>
          <button class="btn btn-sm btn-secondary">No</button>
        </div>
      </div>
    `;

    const [yesBtn, noBtn] = toast.querySelectorAll('button');

    yesBtn.addEventListener('click', () => {
      onConfirm();
      toast.remove();
    });

    noBtn.addEventListener('click', () => toast.remove());

    this.container.appendChild(toast);
  }
}
