import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule,HttpClientModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss'
})
export class FormPageComponent {
  form : FormGroup;

  constructor(private fb : FormBuilder, private http : HttpClient){
    this.form = this.fb.group({
      text: ['', Validators.required],
      multilineText: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      number: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      timestamp: ['', Validators.required],
      checkbox: [false],
      dropdown: ['', Validators.required],
      radioList: ['', Validators.required],
      checkboxList: this.fb.array([], Validators.required),
      pdfFile: [null, Validators.required],
      imageFile: [null, Validators.required],
      listBox: ['', Validators.required]

    });

  }

  get checkboxList() {
    return this.form.get('checkboxList') as FormArray;
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.checkboxList.push(this.fb.control(input.value));
    } else {
      const index = this.checkboxList.controls.findIndex(control => control.value === input.value);
      if (index !== -1) {
        this.checkboxList.removeAt(index);
      }
    }
  }

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.get(controlName)?.setValue(input.files[0]);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      
      // Append form values to FormData
      for (const key in this.form.value) {
        const value = this.form.value[key];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item: any) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }

      this.http.post('http://localhost:3000/api/v1/form', formData).subscribe(response => {
        console.log("Form submitted successfully", response);
      });
    }
  }

}
