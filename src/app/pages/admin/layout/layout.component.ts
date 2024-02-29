import { Component, Input } from '@angular/core';
import { Device, SupabaseService } from '../../../services/supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  loading = false
  devices : any[] = []
  waves = [
    {id: 1, signal: 'Cuadrada'},
    {id: 2, signal: 'Seno'},
    {id: 3, signal: 'Sierra'},
  ]
  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
    private router: Router
  ){
  }

  async ngOnInit(): Promise<void> {
    this.devices = await this.getDevices()
  }
  
  signOut() {
    this.supabase.signOut();
  }
  
  async getDevices(): Promise<any[]> {
    try {
      const { data, error, status } = await this.supabase.devices()
      if (error && status !== 406) { 
        throw error
      }
      
      return data || [];

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
      return [];
    }
    
  }
}
