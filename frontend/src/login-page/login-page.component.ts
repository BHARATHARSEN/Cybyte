import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterService } from '../router.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private routerService: RouterService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
     
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.http.post('http://localhost:3000/api/v1/login', loginData)
        .subscribe({
          next: (response: any) => {
            console.log('Login successful:', response);

            // Storing the token in localStorage
            const token = response.token;
            localStorage.setItem('token', token);

            
            this.routerService.navigateTo('/form'); 
          },
          error: (error) => {
            console.error('Error logging in:', error);
            this.errorMessage = 'Failed to login. Please check your email or password.';
          }
        });
    }
  }
}
