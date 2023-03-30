import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegistration } from '../models/userRegistration';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://demo-api.now.sh';
  private usersBaseURL = `${this.baseUrl}/users`;

  register(userRegistration: UserRegistration): Observable<any> {
    return this.http.post(`${this.usersBaseURL}`, userRegistration);
  }

  constructor(private http: HttpClient) { }
}
