import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if the code is running in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      // Token exists, allow access
      return true;
    } else {
      // No token, redirect to login
      return router.parseUrl('/login');
    }
  } else {
    // Server-side rendering or non-browser environment
    return router.parseUrl('/login');
  }
};