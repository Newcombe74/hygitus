import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  organization: string;
  bio?: string;

  email: string;
  password: string;
  phoneNumber?: string;
  addressLineOne?: string;
  addressLineTwo?: string;
  postcode?: string;

  enviroScore: number;
  socialScore: number;
  governScore: number;
  private: boolean;
  notifications: boolean;
  newsletter: boolean;
}

export class AppDB extends Dexie {
  users!: Table<User, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(5).stores({
      users: '++id, firstName, lastName, dob, sex, &healthCardNumber, &email, password, phoneNumber, addressLineOne, addressLineTwo, postcode, emergencyFullName, emergencyPhoneNumber',
      waitRequests: '++id, userId, created, done',
      hospitals: '++id, &name, addressLineOne, addressLineTwo, postcode, phoneNumber'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {

    // Create User
    const userId = await db.users.add({
      firstName: 'John',
      lastName: 'Smith',
      organization: 'Investico',
      bio: 'I am a test user.',
      email: 'jsmith@dal.ca',
      password: 'password',
      phoneNumber: '1234567890',
      addressLineOne: '208-1078 Tower Road',
      addressLineTwo: 'Halifax',
      postcode: 'B3H2Y5',
      enviroScore: 5,
      socialScore: 5,
      governScore: 5,
      private: false,
      notifications: true,
      newsletter: true
    });

    // Create wait request
    /*
    await db.waitRequests.add({
      userId,
    });
    */
  }

  async resetDatabase() {
    await db.transaction('rw', 'users', () => {
      this.users.clear();
      this.populate();
    });
  }
}

export const db = new AppDB();
