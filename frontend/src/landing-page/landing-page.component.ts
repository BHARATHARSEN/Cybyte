import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],  
})
export class LandingPageComponent implements OnInit {
  form: FormGroup;
  data: any[] = []; 

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initializing the form with a dropdown for selecting the database
    this.form = this.fb.group({
      database: ['database1']  // Default to database1
    });
  }

  ngOnInit(): void {}

  onDatabaseSelect(): void {
    const selectedDatabase = this.form.get('database')?.value;

    // Fetching data based on selected database
    this.http
      .get<any[]>(`http://localhost:3000/api/v1/data?dbName=${selectedDatabase}`)
      .subscribe({
        next: (response) => {
          this.data = response;
          console.log('Data received from backend:', this.data); // Log response data
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  }
}
