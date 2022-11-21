import { Component, isDevMode } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'src/db/db';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentUser!: User;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyBTvinHi3BUi-g1gNd6fUctxOvzVjHw5Tc',
      authDomain: 'hygitus.firebaseapp.com',
      projectId: 'hygitus',
      storageBucket: 'hygitus.appspot.com',
      messagingSenderId: '920266743300',
      appId: '1:920266743300:web:bc5e229fbfacdf694f1f51',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);


    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );
  }
}
