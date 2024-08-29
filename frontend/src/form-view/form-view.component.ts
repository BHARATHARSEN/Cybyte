// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule, FormControl, AbstractControl } from '@angular/forms';
// import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { RouterService } from '../router.service';

// interface FormData {
//   id: number;
//   text: string;
//   multilineText: string;
//   email: string;
//   telephone: string;
//   number: number;
//   date: string;
//   time: string;
//   timestamp: string;
//   checkbox: boolean;
//   dropdown: string;
//   radioList: string;
//   checkboxList: string;
//   pdfFile: string | null;
//   imageFile: string | null;
//   listBox: string;
//   user_id: number;
// }

// @Component({
//   selector: 'app-form-view',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     ReactiveFormsModule,
//     FormsModule,
//     HttpClientModule,
//   ],
//   templateUrl: './form-view.component.html',
//   styleUrls: ['./form-view.component.scss'],
// })
// export class FormViewComponent implements OnInit {
//   formArray: FormArray;
//   editingFormId: number | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private routerService: RouterService,
    
//   ) {
//     this.formArray = this.fb.array([]);
//   }

//   ngOnInit(): void {
//     this.loadForms();
//   }

//   getFormGroup(index: number): FormGroup {
//     return this.formArray.at(index) as FormGroup;
//   }

//   getCheckboxListControls(index: number): AbstractControl[] {
//     return (this.getFormGroup(index).get('checkboxList') as FormArray).controls;
//   }

//   loadForms(): void {
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     });

//     this.http
//       .get<FormData[]>('http://localhost:3000/api/v1/forms', { headers })
//       .subscribe({
//         next: (data: FormData[]) => {
//           console.log('Data received from API:', data);
//           this.formArray.clear();
//           data.forEach((form) => {
//             console.log('Processing form:', form);
//             const formGroup = this.createFormGroup(form);
//             if (form.checkboxList) {
//               const checkboxListArray = formGroup.get('checkboxList') as FormArray;
//               checkboxListArray.clear();
//               form.checkboxList.split(',').forEach((value) => {
//                 checkboxListArray.push(this.fb.control(value === 'true'));
//               });
//             }
//             this.formArray.push(formGroup);
//           });
//         },
//         error: (error) => {
//           console.error('Error loading forms:', error);
//         },
//       });
//   }

//   createFormGroup(form: FormData): FormGroup {
//     return this.fb.group({
//       id: [form.id],
//       text: [form.text, Validators.required],
//       multilineText: [form.multilineText, Validators.required],
//       email: [form.email, [Validators.required, Validators.email]],
//       telephone: [
//         form.telephone,
//         [Validators.required, Validators.pattern(/^\d{10}$/)],
//       ],
//       number: [form.number, [Validators.required, Validators.min(0)]],
//       date: [this.formatDate(form.date), Validators.required],
//       time: [this.formatTime(form.time), Validators.required],
//       timestamp: [this.formatTimestamp(form.timestamp), Validators.required],
//       checkbox: [Boolean(form.checkbox)],
//       dropdown: [form.dropdown, Validators.required],
//       radioList: [form.radioList, Validators.required],
//       checkboxList: this.fb.array(
//         this.initializeCheckboxList(form.checkboxList)
//       ),
//       listBox: [this.formatListBox(form.listBox), Validators.required],
//       imageFile: [form.imageFile]||null,
//       pdfFile: [form.pdfFile]||null,
//       user_id: [form.user_id],
//     });
//   }

//   private formatDate(date: string | Date): string {
//     if (date instanceof Date) {
//       return date.toISOString().split('T')[0];
//     }
//     return date;
//   }

//   private formatTime(time: string): string {
//     const hours = parseInt(time.slice(0, 2));
//     const minutes = parseInt(time.slice(3, 5));
//     return `${hours.toString().padStart(2, '0')}:${minutes
//       .toString()
//       .padStart(2, '0')}`;
//   }

//   private formatTimestamp(timestamp: string | Date): string {
//     if (timestamp instanceof Date) {
//       const date = new Date(timestamp);
//       return date.toISOString().replace('Z', '').split('.')[0];
//     }
//     return timestamp;
//   }


//   private formatListBox(listBox: string | string[]): string {
//     if (Array.isArray(listBox)) {
//       return listBox.join(',');
//     }
//     return listBox;
//   }
  

//   private initializeCheckboxList(checkboxList: string): FormControl[] {
//     return checkboxList
//       .split(',')
//       .map((value) => this.fb.control(value === 'true'));
//   }
  

//   saveForm(index: number): void {
//     const formGroup = this.getFormGroup(index);
//     const formId = formGroup.get('id')?.value;

//     if (formGroup.valid) {
//       const token = localStorage.getItem('token');
//       const headers = new HttpHeaders({
//         Authorization: `Bearer ${token}`,
//       });

//       const formData = { ...formGroup.value };
//       delete formData.id;

//       Object.keys(formData).forEach((key) => {
//         if (formData[key] === undefined) {
//           formData[key] = null;
//         }
//       });

//       formData.date = this.formatDate(formData.date);
//       formData.time = this.formatTime(formData.time);
//       formData.timestamp = this.formatTimestamp(formData.timestamp);

//       // Converting checkboxList and listBox to comma-separated strings if they are arrays
//     if (Array.isArray(formData.checkboxList)) {
//       formData.checkboxList = formData.checkboxList.join(',');
//     }
//     if (Array.isArray(formData.listBox)) {
//       formData.listBox = formData.listBox.join(',');
//     }

//       console.log(formData, " Form data after time date and timestamp");

//       this.http
//         .put(`http://localhost:3000/api/v1/forms/${formId}`, formData, {
//           headers,
//         })
//         .subscribe({
//           next: () => {
//             this.loadForms();
//             this.editingFormId = null;
//           },
//           error: (error) => {
//             console.error('Error saving form:', error);
//           },
//         });
//     }
//   }

//   getCheckboxListDisplayValue(index: number): string {
//     const formGroup = this.getFormGroup(index);
//     const checkboxList = formGroup.get('checkboxList') as FormArray;
//     return checkboxList.value
//       ?.map((value: boolean) => (value ? 'true' : 'false'))
//       .join(',');
//   }

//   deleteForm(index: number): void {
//     const formGroup = this.getFormGroup(index);
//     const formId = formGroup.get('id')?.value;

//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     });

//     this.http
//       .delete(`http://localhost:3000/api/v1/forms/${formId}`, { headers })
//       .subscribe({
//         next: () => {
//           this.formArray.removeAt(index);
//           if (this.editingFormId === formId) {
//             this.editingFormId = null;
//           }
//         },
//         error: (error) => {
//           console.error('Error deleting form:', error);
//         },
//       });
//   }

//   getSafeFormControlValue(
//     control: AbstractControl | null,
//     controlName?: string
//   ): any {
//     if (control instanceof FormGroup && controlName) {
//       return control.get(controlName)?.value;
//     } else if (control instanceof FormControl) {
//       return control.value;
//     }
//     return null;
//   }

//   cancelEdit(): void {
//     this.editingFormId = null;
//     this.loadForms(); // Reloading forms to discard changes
//   }

//   navigateToManageForms(): void {
//     this.routerService.navigateTo('/manage-forms');
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RouterService } from '../router.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

interface FormData {
  id: number;
  text: string;
  multilineText: string;
  email: string;
  telephone: string;
  number: number;
  date: string;
  time: string;
  timestamp: string;
  checkbox: boolean;
  dropdown: string;
  radioList: string;
  checkboxList: string;
  pdfFile: string | null;
  imageFile: string | null;
  listBox: string;
  user_id: number;
}

@Component({
  selector: 'app-form-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
  ],
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
})
export class FormViewComponent implements OnInit {
  formArray: FormArray;
  editingFormId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private routerService: RouterService,
    private snackBar: MatSnackBar
  ) {
    // Initializing formArray
    this.formArray = this.fb.array([]);
  }

  ngOnInit(): void {
    // Loading forms on component initialization
    this.loadForms();
  }

  // Retrieving FormGroup from formArray at specified index
  getFormGroup(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  // Retrieving the controls for the checkboxList in the FormGroup
  getCheckboxListControls(index: number): AbstractControl[] {
    return (this.getFormGroup(index).get('checkboxList') as FormArray).controls;
  }

  // Loading forms data from the API and populating the formArray
  loadForms(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('Fetching forms data from API');

    this.http
      .get<FormData[]>('http://localhost:3000/api/v1/forms', { headers })
      .subscribe({
        next: (data: FormData[]) => {
          console.log('Data received from API:', data);
          this.formArray.clear();
          data.forEach((form) => {
            console.log('Processing form:', form);
            const formGroup = this.createFormGroup(form);
            // Initialize checkboxList as FormArray if it exists
            if (form.checkboxList) {
              const checkboxListArray = formGroup.get('checkboxList') as FormArray;
              checkboxListArray.clear();
              form.checkboxList.split(',').forEach((value) => {
                checkboxListArray.push(this.fb.control(value === 'true'));
              });

              
            }
            this.formArray.push(formGroup);
          });
          
        },
        error: (error) => {
          console.error('Error loading forms:', error);
          this.snackBar.open('Error while loading forms', 'Close', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center' 
          });
          
        },
      });
  }

  // This function creates a FormGroup from the FormData
  createFormGroup(form: FormData): FormGroup {
    console.log('Creating FormGroup for:', form);

    return this.fb.group({
      id: [form.id],
      text: [form.text, Validators.required],
      multilineText: [form.multilineText, Validators.required],
      email: [form.email, [Validators.required, Validators.email]],
      telephone: [
        form.telephone,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      number: [form.number, [Validators.required, Validators.min(0)]],
      date: [this.formatDate(form.date), Validators.required],
      time: [this.formatTime(form.time), Validators.required],
      timestamp: [this.formatTimestamp(form.timestamp), Validators.required],
      checkbox: [Boolean(form.checkbox)],
      dropdown: [form.dropdown, Validators.required],
      radioList: [form.radioList, Validators.required],
      checkboxList: this.fb.array(
        this.initializeCheckboxList(form.checkboxList)
      ),
      listBox: [this.formatListBox(form.listBox), Validators.required],
      imageFile: [form.imageFile] || null,
      pdfFile: [form.pdfFile] || null,
      user_id: [form.user_id],
    });
  }

  // Formatting date to ISO format (YYYY-MM-DD)
  private formatDate(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  // Formatting time to HH:mm format
  private formatTime(time: string): string {
    const hours = parseInt(time.slice(0, 2));
    const minutes = parseInt(time.slice(3, 5));
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  // Formatting timestamp to ISO format without milliseconds and timezone
  private formatTimestamp(timestamp: string | Date): string {
    if (timestamp instanceof Date) {
      const date = new Date(timestamp);
      return date.toISOString().replace('Z', '').split('.')[0];
    }
    return timestamp;
  }

  // Converting listBox or array to a comma-separated string
  private formatListBox(listBox: string | string[]): string {
    if (Array.isArray(listBox)) {
      return listBox.join(',');
    }
    return listBox;
  }

  // Initializes FormArray for checkboxList
  private initializeCheckboxList(checkboxList: string): FormControl[] {
    return checkboxList
      .split(',')
      .map((value) => this.fb.control(value === 'true'));
  }

  // Saves form data by making a PUT request
  saveForm(index: number): void {
    const formGroup = this.getFormGroup(index);
    const formId = formGroup.get('id')?.value;

    if (formGroup.valid) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Extract form data and exclude 'id' field
      const formData = { ...formGroup.value };
      delete formData.id;

      // Log form data before sending
      console.log('Form data before sending:', formData);

      // Ensuring all undefined values are set to null
      Object.keys(formData).forEach((key) => {
        if (formData[key] === undefined) {
          formData[key] = null;
        }
      });

      // Formatting date, time, and timestamp
      formData.date = this.formatDate(formData.date);
      formData.time = this.formatTime(formData.time);
      formData.timestamp = this.formatTimestamp(formData.timestamp);

      // Converting arrays to comma-separated strings
      if (Array.isArray(formData.checkboxList)) {
        formData.checkboxList = formData.checkboxList.join(',');
      }
      if (Array.isArray(formData.listBox)) {
        formData.listBox = formData.listBox.join(',');
      }

      console.log('Form data after formatting:', formData);

      this.http
        .put(`http://localhost:3000/api/v1/forms/${formId}`, formData, {
          headers,
        })
        .subscribe({
          next: () => {
            console.log('Form saved successfully');
            this.loadForms();
            this.editingFormId = null;

            this.snackBar.open('Your changes are saved', 'Close', {
              duration: 3000, 
              verticalPosition: 'top', 
              horizontalPosition: 'center' 
            });
          },
          error: (error) => {
            console.error('Error saving form:', error);
            this.snackBar.open('Error saving your form', 'Close', {
              duration: 3000, 
              verticalPosition: 'top', 
              horizontalPosition: 'right' 
            });
          },
        });
    }
  }

  // Returns a comma-separated string of checkboxList values
  getCheckboxListDisplayValue(index: number): string {
    const formGroup = this.getFormGroup(index);
    const checkboxList = formGroup.get('checkboxList') as FormArray;
    return checkboxList.value
      ?.map((value: boolean) => (value ? 'true' : 'false'))
      .join(',');
  }

  // Deletes form and removes it from the formArray
  deleteForm(index: number): void {
    const formGroup = this.getFormGroup(index);
    const formId = formGroup.get('id')?.value;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log(`Deleting form with ID: ${formId}`);

    this.http
      .delete(`http://localhost:3000/api/v1/forms/${formId}`, { headers })
      .subscribe({
        next: () => {
          console.log('Form deleted successfully');
          this.formArray.removeAt(index);
          if (this.editingFormId === formId) {
            this.editingFormId = null;
          }

          this.snackBar.open('Your Form is deleted', 'Close', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center' 
          });
        },
        error: (error) => {
          console.error('Error deleting form:', error);
          this.snackBar.open('Cannot delete your form', 'Close', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center' 
          });
        },
      });
  }

  // Safely retrieves the value of a form control
  getSafeFormControlValue(
    control: AbstractControl | null,
    controlName?: string
  ): any {
    if (control instanceof FormGroup && controlName) {
      return control.get(controlName)?.value;
    } else if (control instanceof FormControl) {
      return control.value;
    }
    return null;
  }

  // Cancels editing and reloads forms
  cancelEdit(): void {
    console.log('Editing canceled');
    this.editingFormId = null;
    this.loadForms(); // Reloading forms to discard changes
  }

  // Navigates to manage forms page
  navigateToManageForms(): void {
    console.log('Navigating to manage forms');
    this.routerService.navigateTo('/manage-forms');
  }
}
