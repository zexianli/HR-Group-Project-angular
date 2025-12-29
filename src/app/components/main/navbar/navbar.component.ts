import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthActions } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'home-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  logout() {
    // do logout
    this.store.dispatch(AuthActions.logout());
  }
}
