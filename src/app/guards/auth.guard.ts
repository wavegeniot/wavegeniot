import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { filter, take, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(SupabaseService)

  return authService.currentUser.pipe(
    filter(val => val !== null),
    take(1),
    map((isAuthenticated) => {
      console.log("isAuthenticated: ", isAuthenticated)
      if (isAuthenticated) {
        return true;
      }
      return false
    }
    )
  )
};
