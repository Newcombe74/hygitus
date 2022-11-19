import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppDB, db, User } from 'src/db/db';

export interface LoginResponse {
  status: number;
  user?: User;
  message: string;
}

export interface RegisterResponse {
  status: number;
  user: User;
  message?: string;
}

export interface UpdateResponse {
  status: number;
  user: User;
  message?: string;
}

@Injectable()
export class AppDBService {
  private db!: AppDB;

  constructor() {
    this.db = db;
  }

  async attemptLogin(email: string, password: string): Promise<LoginResponse> {
    var users = await this.db.users.where('email').equals(email).toArray();
    if (users.length == 1) {
      // user found
      var user = users[0];
      if (user.password == password) {
        // Successful login
        return { status: 0, user, message: 'Successful login' };
      } else {
        // Failed login
        return { status: 1, message: 'Failed login' };
      }
    } else if (users.length == 0) {
      // no user found
      return { status: 1, message: 'No user found' };
    } else {
      // multiple users found
      return {
        status: 2,
        message: 'ERROR: Email should not return multiple users',
      };
    }
  }

  async registerUser(user: User): Promise<RegisterResponse> {
    user.id = await this.db.users.add(user);
    return { status: 0, user };
  }

  async updateUser(user: User): Promise<UpdateResponse> {
    user.id = await this.db.users.update(user.id!, user);
    return { status: 0, user };
  }

  resetDB() {
    this.db.resetDatabase();
  }
}
