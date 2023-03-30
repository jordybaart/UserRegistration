import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserRegistration } from '../models/userRegistration';
import { UserService } from '../services/user.service';
import CustomFormValidators from '../utils/customFormValidators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  userRegistration!: UserRegistration;

  private readonly REG_PATTERN_LOWERCASE = /^(?=.*[A-Z])/;
  private readonly REG_PATTERN_UPPERCASE = /^(?=.*[a-z])/;
  signupForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.REG_PATTERN_LOWERCASE),
      Validators.pattern(this.REG_PATTERN_UPPERCASE),
    ]]
  },);

  isSubmitted = false;
  destroy = new Subject<void>();

  isLoading = false;
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  constructor(private formBuilder: FormBuilder, private userService: UserService) {

    // create a form validator to check if password field contains firstName or lastName
    this.signupForm.addValidators(CustomFormValidators.forbiddenValues('password', ['firstName', 'lastName'], { requiresNoForbiddenValues: true }));
  }

  hasError(field: any): boolean {
    return field.errors && field?.invalid && ((field?.dirty || field?.touched) || this.isSubmitted);
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.sendForm();
  }

  private sendForm(): void {
    const formValues = this.signupForm.value;

    this.userRegistration = new UserRegistration();
    this.userRegistration = {
      firstName: formValues.firstName as string,
      lastName: formValues.lastName as string,
      email: formValues.email as string
    };

    this.isLoading = true;
    this.userService.register(this.userRegistration)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (_) => alert("Successful registration"),
        error: (err: HttpErrorResponse) => { 
          this.isLoading = false;
          console.log(err.error.errors)
        },
        complete: () => this.isLoading = false
    })

}

  private get passwordControl(): FormControl {
  return this.f["password"];
}

  get requiredEmailValid(): boolean {
  return !this.f['email'].hasError("email");
}

  get passwordValid(): boolean {
  return this.passwordControl.errors === null;
}

  get requiredPasswordValid(): boolean {
  return !this.passwordControl.hasError("required");
}

  get requiresMinLengthValid(): boolean {
  return !this.passwordControl.hasError("minlength");
}

  get requiresUppercaseValid(): boolean {
  if (!this.passwordControl || !this.passwordControl.errors || !this.passwordControl.hasError('pattern')) {
    return true;
  }
  const requiredPattern: string = this.passwordControl.errors["pattern"]?.['requiredPattern'];
  return requiredPattern == this.REG_PATTERN_UPPERCASE.toString();
}

  get requiresLowercaseValid(): boolean {
  if (!this.passwordControl || !this.passwordControl.errors || !this.passwordControl.hasError('pattern')) {
    return true;
  }
  const requiredPattern: string = this.passwordControl.errors["pattern"]?.['requiredPattern'];
  return requiredPattern == this.REG_PATTERN_LOWERCASE.toString();
}

  get requiresNoForbiddenValues(): boolean {
  return !this.passwordControl.hasError("requiresNoForbiddenValues");
}
}
