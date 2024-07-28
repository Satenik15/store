import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public token$ = this._token$.asObservable();

  public get token(): any {
    return this._token$.value;
  }

  login(token: string) {
    this._token$.next(token);
    return true
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string {
    return this.token;
  }

}
