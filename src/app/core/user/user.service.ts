import { HttpClient  ,   HttpHeaders,
    HttpErrorResponse,} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap,throwError } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({providedIn: 'root'})
export class UserService
{
    private _user: ReplaySubject<UserProfile> = new ReplaySubject<UserProfile>(1);
    private apiUrl = environment.apiendpoint;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        var s = {firstname:'', lastname:''};
        this._user.next(s);
        console.log('initialize user');

    }

    getHeaders() {
        return {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',

          })
        };
      }

      handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError(() => error);
    }



    
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: UserProfile)
    {
        console.log('set user');

         this._user.next(value);
    }

    set userGUID(guid: string)
    {
        localStorage.setItem('USER_GUID', guid);
    }

    get userGUID(): string
    {
        return localStorage.getItem('USER_GUID') ?? '';
    }


    get user$(): Observable<UserProfile>
    {
        return this._user.asObservable();
    }

    new(){
        var s = {firstname:'', lastname:''};
        this._user.next(s);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Get the current logged in user data
     */

}
