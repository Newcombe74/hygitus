import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AppDBService } from 'src/app/core/services/db.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HygitusErrorStateMatcher } from 'src/app/shared/utils/hygitus-error-state-matcher';
import { User } from 'src/db/db';

@Component({
  selector: 'user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent {
  currentUser!: User;

  isLoaded = false;
  isEditing = false;

  personalInfoFormGroup!: FormGroup;
  contactInfoFormGroup!: FormGroup;
  preferencesFormGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  hidePassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  matcher = new HygitusErrorStateMatcher();
  passwordFailed = false;

  sexes = [
    { value: 0, viewValue: 'Male' },
    { value: 1, viewValue: 'Female' },
    { value: 2, viewValue: 'Prefer not to say' },
  ];

  constructor(
    private appDBService: AppDBService,
    private toastService: ToastService,
    private authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }

  ngOnInit() {
    let user = this.currentUser;
    this.personalInfoFormGroup = this._formBuilder.group({
      firstNameCtrl: [{ value: user.firstName, disabled: true }, Validators.required],
      lastNameCtrl: [{ value: user.lastName, disabled: true }, Validators.required],
      organizationCtrl: [{ value: user.organization, disabled: true }],
      bioCtrl: [{ value: user.bio, disabled: true }],
    });
    this.contactInfoFormGroup = this._formBuilder.group({
      emailCtrl: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
      phoneNumberCtrl: [{ value: user.phoneNumber, disabled: true }, Validators.required],
      addressLineOneCtrl: [{ value: user.addressLineOne, disabled: true }, Validators.required],
      addressLineTwoCtrl: [{ value: user.addressLineTwo, disabled: true }, Validators.required],
      postcodeCtrl: [{ value: user.postcode, disabled: true }, Validators.required],
    });
    this.preferencesFormGroup = this._formBuilder.group({
      privateCtrl: [{ value: user.private, disabled: true }, Validators.required],
      notificationsCtrl: [{ value: user.notifications, disabled: true }, Validators.required],
      newsletterCtrl: [{ value: user.newsletter, disabled: true }, Validators.required],
    });
    this.passwordFormGroup = this._formBuilder.group(
      {
        passwordOldCtrl: ['', Validators.required],
        passwordCtrl: ['', Validators.required],
        passwordConfirmCtrl: ['', Validators.required],
      },
      { validators: this.checkPasswords }
    );
  }

  async submitUpdate() {
    // Populate user object
    let personalInfoCtrls = this.personalInfoFormGroup.controls;
    let contactInfoCtrls = this.contactInfoFormGroup.controls;
    let preferencesCtrls = this.preferencesFormGroup.controls;
    let user: User;
    user = {
      id: this.currentUser.id,
      firstName: personalInfoCtrls['firstNameCtrl'].value,
      lastName: personalInfoCtrls['lastNameCtrl'].value,
      organization: personalInfoCtrls['organizationCtrl'].value,
      bio: personalInfoCtrls['bioCtrl'].value,

      email: contactInfoCtrls['emailCtrl'].value,
      phoneNumber: contactInfoCtrls['phoneNumberCtrl'].value,
      addressLineOne: contactInfoCtrls['addressLineOneCtrl'].value,
      addressLineTwo: contactInfoCtrls['addressLineTwoCtrl'].value,
      postcode: contactInfoCtrls['postcodeCtrl'].value,

      private: preferencesCtrls['privateCtrl'].value,
      notifications: preferencesCtrls['notificationsCtrl'].value,
      newsletter: preferencesCtrls['newsletterCtrl'].value,

      password: this.currentUser.password
    };

    // Update DB
    let response = await this.appDBService.updateUser(user);

    // Handle DB Response
    if (response.status === 0) {
      this.toastService.submitToast('Update Successful');

      this.authenticationService.login(response.user);

      this.cancelEditing();
    }
  }

  async attemptUpdatePassword() {
    // Populate user object
    let passwordCtrls = this.passwordFormGroup.controls;
    let user: User = this.currentUser;

    let oldPassword = passwordCtrls['passwordOldCtrl'].value;
    let newPassword = passwordCtrls['passwordCtrl'].value;

    if (oldPassword === user.password) {
      // Set new password
      user.password = newPassword;

      // Update DB
      let response = await this.appDBService.updateUser(user);

      // Handle DB Response
      if (response.status === 0) {
        this.toastService.submitToast('Update Password Successful');
        this.passwordFailed = false;

        this.authenticationService.login(response.user);

        this.passwordFormGroup = this._formBuilder.group(
          {
            passwordOldCtrl: ['', Validators.required],
            passwordCtrl: ['', Validators.required],
            passwordConfirmCtrl: ['', Validators.required],
          },
          { validators: this.checkPasswords }
        );
      }
    } else {
      this.passwordFailed = true;
    }
  }

  enableEditing() {
    this.isEditing = true;

    this.personalInfoFormGroup.enable();
    this.contactInfoFormGroup.enable();
    this.preferencesFormGroup.enable();
  }

  cancelEditing() {
    this.isEditing = false;

    let user = this.currentUser;

    this.personalInfoFormGroup = this._formBuilder.group({
      firstNameCtrl: [{ value: user.firstName, disabled: true }, Validators.required],
      lastNameCtrl: [{ value: user.lastName, disabled: true }, Validators.required],
      organizationCtrl: [{ value: user.organization, disabled: true }],
      bioCtrl: [{ value: user.bio, disabled: true }],
    });
    this.contactInfoFormGroup = this._formBuilder.group({
      emailCtrl: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
      phoneNumberCtrl: [{ value: user.phoneNumber, disabled: true }, Validators.required],
      addressLineOneCtrl: [{ value: user.addressLineOne, disabled: true }, Validators.required],
      addressLineTwoCtrl: [{ value: user.addressLineTwo, disabled: true }, Validators.required],
      postcodeCtrl: [{ value: user.postcode, disabled: true }, Validators.required],
    });
    this.preferencesFormGroup = this._formBuilder.group({
      privateCtrl: [{ value: user.private, disabled: true }, Validators.required],
      notificationsCtrl: [{ value: user.notifications, disabled: true }, Validators.required],
      newsletterCtrl: [{ value: user.newsletter, disabled: true }, Validators.required],
    });
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
