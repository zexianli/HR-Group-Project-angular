import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'auth-textfield',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css'],
})
export class TextfieldComponent {
  @Input() type: 'text' | 'password' = 'text';
  @Input() placeholder: string = '';
}
