import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { AuthService } from 'src/app/service/auth.service';
import { AuthActions } from 'src/app/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from 'src/app/components/auth/button/button.component';
// import { TextfieldComponent } from 'src/app/components/auth/textfield/textfield.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
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
