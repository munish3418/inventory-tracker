import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from './services/user';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Inventory Tracker';
  
  constructor(public userService: UserService) {}

  logout() {
    this.userService.logout();
  }
}