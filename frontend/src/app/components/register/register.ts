import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  username = '';
  password = '';
  email = '';
  message = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  register() {
    console.log('Register clicked', { username: this.username, password: this.password, email: this.email });

    if (!this.username || !this.password || !this.email) {
      this.message = 'All fields are required';
      this.cdr.detectChanges(); // Ensure message shows immediately
      return;
    }

    this.userService.register({
      username: this.username,
      password: this.password,
      email: this.email
    }).subscribe({
      next: () => {
        console.log('Register success');
        this.ngZone.run(() => {
          this.message = 'Registration successful';
          this.cdr.detectChanges(); // Force UI update
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        console.error('Register API Error:', err);
        this.ngZone.run(() => {
          if (err.error?.title) {
            this.message = err.error.title;
          } else if (err.error) {
            this.message = err.error;
          } else {
            this.message = 'Registration failed';
          }
          console.log('Message set to:', this.message);
          this.cdr.detectChanges(); // Force UI update
        });
      }
    });
  }
}