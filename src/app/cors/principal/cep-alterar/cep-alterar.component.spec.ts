import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepAlterarComponent } from './cep-alterar.component';

describe('CepAlterarComponent', () => {
  let component: CepAlterarComponent;
  let fixture: ComponentFixture<CepAlterarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepAlterarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CepAlterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
