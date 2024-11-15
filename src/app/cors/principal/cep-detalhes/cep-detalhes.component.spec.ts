import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepDetalhesComponent } from './cep-detalhes.component';

describe('CepDetalhesComponent', () => {
  let component: CepDetalhesComponent;
  let fixture: ComponentFixture<CepDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CepDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
