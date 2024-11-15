import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCpfFormat]',
  standalone: true,
})
export class CpfFormatDirective {
  private readonly maxLength = 11;
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    let input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > this.maxLength) {
      value = value.slice(0, this.maxLength);
    }

    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    input.value = value;
  }
}
