import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  message = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef   // inject ChangeDetectorRef
  ) {}

  login(): void {
    console.log('Login clicked', this.username, this.password);

    if (!this.username || !this.password) {
      this.message = 'Username and password are required';
      this.cd.detectChanges(); // update view immediately
      return;
    }

    this.userService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('Login success', res);
          this.ngZone.run(() => {
            this.message = '';
            this.router.navigate(['/items']);
          });
        },
        error: (err: any) => {
          console.error('Login API Error:', err);
          this.ngZone.run(() => {
            this.message = err.error?.title || err.error || 'Invalid username or password';
            console.log('Message set to:', this.message);
            this.cd.detectChanges(); // force update UI
          });
        }
      });
  }
}