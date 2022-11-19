import { Component } from '@angular/core';
import { User } from 'src/db/db';
import { AppDBService } from '../../services/db.service';
import { isDevMode } from '@angular/core';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  currentUser!: User;
  isDevMode = false;

  constructor(
    private router: Router,
    private appDBService: AppDBService,
    private toastService: ToastService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );

    this.isDevMode = isDevMode();
  }

  logout() {
    this.authenticationService.logout();
    this.toastService.submitToast('Logout Successful');
    this.router.navigate(['/']);
  }

  resetDB() {
    this.appDBService.resetDB();
    this.toastService.submitToast('Database Reset');
  }
}
