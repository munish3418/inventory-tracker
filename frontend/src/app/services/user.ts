// src/app/services/user.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // ✅ IMPORTANT: relative URL (goes via Nginx)
  private apiUrl = '/api/users';

  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.currentUser = {
          id: res.userId,
          username: credentials.username,
          email: res.email,
          token: res.token
        };

        localStorage.setItem('userId', res.userId.toString());
        localStorage.setItem('email', res.email);
        localStorage.setItem('token', res.token || '');

        console.log('UserService: login successful, stored user:', this.currentUser);
      })
    );
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUserId();
  }

  getCurrentUserId(): number | null {
    if (this.currentUser?.id) return this.currentUser.id;

    const id = localStorage.getItem('userId');
    return id ? +id : null;
  }

  getCurrentUserEmail(): string | null {
    if (this.currentUser?.email) return this.currentUser.email;

    const email = localStorage.getItem('email');
    return email ?? null;
  }

  getToken(): string | null {
    if (this.currentUser?.token) return this.currentUser.token;

    return localStorage.getItem('token');
  }
}