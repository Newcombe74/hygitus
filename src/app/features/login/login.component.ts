import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AppDBService } from 'src/app/core/services/db.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppDB, db, User } from 'src/db/db';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  passwordCtrl = new FormControl('', [Validators.required]);
  loginFailed = false;
  hidePassword = true;

  constructor(
    private router: Router,
    private appDBService: AppDBService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
  ) {}

  getEmailErrorMessage() {
    if (this.emailCtrl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.emailCtrl.hasError('email') ? 'Not a valid email' : '';
  }

  async attemptLogin() {
    let email = this.emailCtrl.value;
    let password = this.passwordCtrl.value;

    let response = await this.appDBService.attemptLogin(email, password);

    switch (response.status) {
      case 0: // Successful login
        this.authenticationService.login(response.user!);
        this.toastService.submitToast('Login Successful');
        this.router.navigate(['/resources']);
        break;
      case 1: // Failed login
        this.loginFailed = true;
        console.log(response.message);
        break;
      case 2: // Multiple users found
        console.error(response.message);
        break;
      default:
        // Status not known
        console.error(
          'ERROR: Response status ' + response.status + ' not recognized'
        );
    }
  }
}
