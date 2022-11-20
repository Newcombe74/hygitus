import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AppDBService } from 'src/app/core/services/db.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HygitusErrorStateMatcher } from 'src/app/shared/utils/hygitus-error-state-matcher';
import { User } from 'src/db/db';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  personalInfoFormGroup!: FormGroup;
  contactInfoFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;
  matcher = new HygitusErrorStateMatcher();

  constructor(
    private router: Router,
    private appDBService: AppDBService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.personalInfoFormGroup = this._formBuilder.group({
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
      organizationCtrl: [''],
    });
    this.contactInfoFormGroup = this._formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email]],
      phoneNumberCtrl: [''],
      addressLineOneCtrl: [''],
      addressLineTwoCtrl: [''],
      postcodeCtrl: [''],
    });
    this.passwordFormGroup = this._formBuilder.group(
      {
        passwordCtrl: ['', Validators.required],
        passwordConfirmCtrl: ['', Validators.required],
      },
      { validators: this.checkPasswords }
    );
  }

  async submitRegistration() {
    // Populate user object
    let personalInfoCtrls = this.personalInfoFormGroup.controls;
    let contactInfoCtrls = this.contactInfoFormGroup.controls;
    let user: User;
    user = {
      firstName: personalInfoCtrls['firstNameCtrl'].value,
      lastName: personalInfoCtrls['lastNameCtrl'].value,
      organization: personalInfoCtrls['organizationCtrl'].value,
      bio: '',

      email: contactInfoCtrls['emailCtrl'].value,
      phoneNumber: contactInfoCtrls['phoneNumberCtrl'].value,
      addressLineOne: contactInfoCtrls['addressLineOneCtrl'].value,
      addressLineTwo: contactInfoCtrls['addressLineTwoCtrl'].value,
      postcode: contactInfoCtrls['postcodeCtrl'].value,

      private: false,
      notifications: true,
      newsletter: true,

      password: this.passwordFormGroup.controls['passwordCtrl'].value,
    };

    // Add to DB
    let response = await this.appDBService.registerUser(user);

    // Handle DB Response
    if(response.status === 0) {
      this.toastService.submitToast('Registration Successful');

      // Login user
      this.authenticationService.login(response.user);

      this.router.navigate(['/']);
    }
  }

  getEmailErrorMessage() {
    let emailCtrl = this.contactInfoFormGroup.controls['emailCtrl'];
    if (emailCtrl.hasError('email')) {
      return 'Not a valid email';
    }
    return '';
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('passwordCtrl');
    if (pass) {
      pass = pass.value;
    }
    let confirmPass = group.get('passwordConfirmCtrl');
    if (confirmPass) {
      confirmPass = confirmPass.value;
    }
    return pass === confirmPass ? null : { notSame: true };
  };
}
