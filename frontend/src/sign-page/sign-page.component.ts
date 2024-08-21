import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterService } from '../router.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-page.component.html',
  styleUrl: './sign-page.component.scss'
})
export class SignUpPageComponent {
  signUp: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private routerService: RouterService, private snackBar: MatSnackBar) {
    this.signUp = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  

  onSubmit() {
    if (this.signUp.valid) {
      const signUpData = this.signUp.value;
      console.log(signUpData);

      this.http.post('http://localhost:3000/api/v1/register', signUpData)
        .subscribe({
          next: (response: any) => {
            console.log('Sign up successful:', response);

            // Show success message
            this.snackBar.open('Sign Up Successful', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });

            // Navigate to the login page or other route
            this.routerService.navigateTo('/login');
          },
          error: (error) => {
            console.error('Error signing up:', error);
            this.errorMessage = 'Failed to sign up. Please try again.';
          }
        });
    }
  }
}
