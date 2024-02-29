import { Injectable } from "@angular/core";
import { AuthChangeEvent, AuthSession, AuthUser, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

export interface Profile {
    id?: string
    name: string
    lastname: string
    role: boolean
}

export interface Device {
    id?: string
    onUse: boolean
}

@Injectable({
    providedIn: 'root'
})

export class SupabaseService {

    private subapase: SupabaseClient;
    _session: AuthSession | null = null
    private _currentUser: BehaviorSubject<boolean | User | any> = new BehaviorSubject(null);

    constructor(private router: Router) {
        this.subapase = createClient(environment.supabaseUrl, environment.supabaseKey)
        
        this.subapase.auth.onAuthStateChange((event, session) => {
            console.log(event)
            if (event === 'SIGNED_IN'){
                this._currentUser.next(session?.user)
            } else {
                this._currentUser.next(false)
            }
        }) 
    }

    get currentUser() {
        return this._currentUser.asObservable();
    }

    get session() {
        this.subapase.auth.getSession().then(({ data }) => {
            this._session = data.session
        })
        return this._session
    }

    profile(user: User) {
        return this.subapase
        .from('profiles')
        .select('name, lastname, role')
        .eq('id', user.id)
        .single()
    }

    devices() {
        return this.subapase
        .from('devices')
        .select()
        
    }

    authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        return this.subapase.auth.onAuthStateChange(callback)
    }

    signIn(email: string, password: string) {
        return this.subapase.auth.signInWithPassword({ email, password})
    }

    signOut() {
        return this.subapase.auth.signOut()
    }

    signUp(email: string, password: string, name: string, lastname: string) {
        return this.subapase.auth.signUp(
            { 
            email, 
            password,
            
            options: {
                data: {
                    name: name,
                    lastname: lastname
                }
            }
        }
        )
    }

    async fetchUser() {
        const data = await this.subapase.auth.getUser()
        return data
    }
    
    updateProfile(profile: Profile) {
        const update = {
            ...profile
        }

        return this.subapase.from('profiles').upsert(update)
    }

}