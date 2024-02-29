import { Component, OnInit, Input} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { Profile, SupabaseService } from '../../../services/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthSession } from '@supabase/supabase-js';
import { LayoutComponent } from '../layout/layout.component';
import { sequenceEqual } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, LayoutComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loading: boolean = false
  registerNewUser: boolean = false
  isLogIn: boolean = false
  profile! : Profile

  signInForm = this.formBuilder.group({
    email: '',
    password: '',
    fname: '',
    lname: '',
  })

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
    private router: Router
  ){
    this.supabase.currentUser.subscribe((user) => {
      console.log('user', user)
      if (user) {
        this.router.navigateByUrl('/dashboard', { replaceUrl: true})
      }
    })
  }


  ngOnInit() {
    if (this.router.url === '/register') {
      this.registerNewUser = true
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true

      const email = this.signInForm.value.email as string
      const password = this.signInForm.value.password as string
      const name = this.signInForm.value.fname as string
      const lastname = this.signInForm.value.lname as string
        
      if (this.registerNewUser) {
        const { error } = await this.supabase.signUp(email, password, name, lastname)
        if (error) throw error
        //alert('Revise en su correo el link para confirmar la cuenta')
      }
      else {
        const { data, error } = await this.supabase.signIn(email, password)
        if (error) throw error
      }

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
      }
  }
}
