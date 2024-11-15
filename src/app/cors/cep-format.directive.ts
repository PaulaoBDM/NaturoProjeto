import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCepFormat]',
  standalone: true,
})
export class CepFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    input.value = value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      ![8, 9, 13, 37, 39, 46].includes(event.keyCode) &&
      (event.key < '0' || event.key > '9')
    ) {
      event.preventDefault();
    }
  }
}
