import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Checking if the code is running in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      
      return true;
    } else {
      
      return router.parseUrl('/login');
    }
  } else {
    // SSR or non-browser environment
    return router.parseUrl('/login');
  }
};