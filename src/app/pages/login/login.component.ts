import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { AuthService } from 'src/app/service/auth.service';
import { AuthActions } from 'src/app/store/actions/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private store: Store) {}
  username = '';
  password = '';

  // private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    this.store.dispatch(
      AuthActions.login({
        username: this.username,
        password: this.password,
        role: 'HR',
      })
    );
    // navigate to dashboard;
    // this.router.navigate(['/dashboard'], { replaceUrl: true });
  }
}
