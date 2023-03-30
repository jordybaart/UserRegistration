import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpComponent', () => {

  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(SignUpComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should require firstname, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('jordy'));
    const firstName = f.get("firstName");
    expect(firstName?.hasError('required')).toBe(false);
  });

  it('should require firstname otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues());
    const firstName = f.get("firstName");
    expect(firstName?.hasError('required')).toBe(true);

  });

  it('should require lastName, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', 'baart'));
    const lastName = f.get("lastName");
    expect(lastName?.hasError('required')).toBe(false);
  });

  it('should require lastName otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues());
    const lastName = f.get("lastName");
    expect(lastName?.hasError('required')).toBe(true);
  });

  it('should require password success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', '', 'welkom!01'));
    const password = f.get("password");
    expect(password?.hasError('required')).toBe(false);
  });

  it('should require password otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues());
    const lastName = f.get("password");
    expect(lastName?.hasError('required')).toBe(true);
  });

  it('Email must be valid, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', 'jbaart@hotmail.com', ''));
    expect(component.requiredEmailValid).toBe(true);
  });

  it('Email must be valid otherwise error, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', 'jbaarthotmail.com', ''));
    expect(component.requiredEmailValid).toBe(false);
  });

  it('Password must contain at least 1 uppercase character, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', '', 'Welkom!01'));
    expect(component.requiresUppercaseValid).toBe(true);
  });

  it('Password must contain at least 1 uppercase character otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', '', 'welkom!01'));
    expect(component.requiresUppercaseValid).toBe(false);
  });

  it('Password must contain at least 1 lower character, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', '', 'Welkom!01'));
    expect(component.requiresLowercaseValid).toBe(true);
  });

  it('Password must contain at least 1 lower character otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('', '', '', 'WELKOM!01'));
    expect(component.requiresLowercaseValid).toBe(false);
  });

  it('Password must contain firstname or lastname, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('jordy', 'baart', '', 'welkom01'));
    expect(component.requiresNoForbiddenValues).toBe(true);
  });

  it('Password must contain firstname or lastname otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('welkom', 'baart', '', 'welkom01'));
    expect(component.requiresNoForbiddenValues).toBe(true);
  });

  it('Password must consist of 8 characters, success', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('welkom', 'baart', '', 'welkom01'));
    expect(component.requiresMinLengthValid).toBe(true);
  });

  it('Password must consist of 8 characters otherwise error', () => {
    const f = component.signupForm;
    f.setValue(createFormValues('welkom', 'baart', '', 'welk'));
    expect(component.requiresMinLengthValid).toBe(false);
  });

});

// helper function
function createFormValues(firstName: string = '', lastName: string = '', email: string = '', password: string = '') {
  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  };
}

