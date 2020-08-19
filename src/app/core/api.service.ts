import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

export class User {
  id: number;
  name: string;
  username: string;
  email: string;

  constructor(data: ApiUser) {
    this.id = data.id;
    this.name = data.name;
    this.username = data.username;
    this.email = data.email;
  }

  hasEmail(): boolean {
    return this.email.length > 0;
  }

  hasUsername(): boolean {
    return this.username.length > 0;
  }

  isName(name: string): boolean {
    return name === this.name;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // tslint:disable-next-line:variable-name
  constructor(private http_: HttpClient) { }

  // getApiUsers returns a an array of unmodified users from the API
  public getApiUsers(): Observable<ApiUser[]> {
    return this.http_.get<ApiUser[]>('https://jsonplaceholder.typicode.com/users');
  }

  // getUsers returns an array of ApiUsers but pipes it through an
  // observable that turns it into the type User before returning
  public getUsers(): Observable<User[]> {
    // The API is going to give us data that looks like RandomData, we want to mutate
    // it before it can be consumed
    return this.http_.get<ApiUser[]>('https://jsonplaceholder.typicode.com/users')
      // pipe the RandomData
      .pipe(
        // map each RandomData into a constructor that can convert from RandomData to
        // ModifiedRandomData and then return
        map(response => response.map((user: ApiUser) => new User(user)))
      );
  }
}
