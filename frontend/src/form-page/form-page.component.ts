import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterService } from '../router.service';


@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule,HttpClientModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss'
})
export class FormPageComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,private snackBar: MatSnackBar,private routerService: RouterService) {
    this.form = this.fb.group({
      text: ['', [Validators.required]] , // Alphanumeric and spaces
      multilineText: ['', [Validators.required]], // Minimum 5 characters
      email: ['', [Validators.required]],
      telephone: ['', [Validators.required]], // Exactly 10 digits
      number: ['', [Validators.required]], // Only digits
      date: ['', [Validators.required]], // YYYY-MM-DD format
      time: ['', [Validators.required]], // HH:MM or HH:MM:SS format
      timestamp: ['', [Validators.required]],
      checkbox: [false],
      dropdown: ['', Validators.required],
      radioList: ['', Validators.required],
      checkboxList: this.fb.array([
        this.fb.control(false),
        this.fb.control(false)
      ], Validators.required),
      pdfFile: [],
      imageFile: [],
      listBox: ['', Validators.required]
    });
  }

  navigateToManageForms(): void {
    this.routerService.navigateTo('/forms');
  }

  get checkboxList() {
    return this.form.get('checkboxList') as FormArray;
  }

  get checkboxListControls() {
    return this.checkboxList.controls;
  }

  get checkboxListInvalid() {
    return this.checkboxList.controls.every(control => !control.value);
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Checkbox changed:', input.value, input.checked);
  }

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(`File selected for ${controlName}:`, input.files[0]);
      this.form.get(controlName)?.setValue(input.files[0]);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      
      const formDataJson = this.form.value;

      const token = localStorage.getItem('token'); 

      if (!token) {
        console.error('No token found');
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Prepare form data for JSON
      const formData = {
          ...formDataJson,
          pdfFile: undefined, 
          imageFile: undefined 
      };
  
      // Sending the FormData to the backend
      this.http.post('http://localhost:3000/api/v1/form', formData, { headers, observe: 'response' }).subscribe({
        next: (response) => {
          console.log(formData);
          console.log('Form submitted successfully:', response.body);

          // Success MSG
          this.snackBar.open('Form Submitted', 'Close', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center' 
          });
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          if (error.status === 400) {
            try {
              const errorMessage = JSON.parse(error.error);
              console.error('Parsed server error:', errorMessage);
            } catch (e) {
              console.error('Server error is not JSON:', error.error);
            }
          } else {
            console.error('Server-side error:', error);
          }
        },
        complete: () => {
          console.log('Form submission process completed.');
          this.form.reset();
        }
      });
    } else {
      console.log('Form is invalid:', this.form.errors);
    }
  }
  
}

