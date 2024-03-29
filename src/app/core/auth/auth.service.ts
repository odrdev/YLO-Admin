import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
  } from '@angular/common/http';
import { environment } from 'environments/environment';
@Injectable({providedIn: 'root'})
export class AuthService
{
    private _authenticated: boolean = false;
    private apiUrl = environment.apiendpoint;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }



    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    get guid(): string
    {
        return localStorage.getItem('USER_GUID') ?? '';
    }




    getHeaders() {
        return {
          headers: new HttpHeaders({
           // 'Access-Control-Allow-Origin': '*',
          //  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Content-Type': 'application/json',
          })
        };
      }

      handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError(() => error);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        console.log(credentials);
        return this._httpClient.post(this.apiUrl + "User/login", credentials,this.getHeaders()).pipe(
            switchMap((response: any) =>
            {
                // Store the access token in the local storage
                console.log(response);
                this.accessToken = response.token;
               // this._userService.user = {firstName:'',userPhoto:''};
                this._userService.userGUID = response.userId;
                // Set the authenticated flag to true

                this._authenticated = true;
                // Store the user on the user service
                this._userService.user = response.profile
                // Return a new observable with the response
                return of(response);
            }),
        );
    }

    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        // if ( AuthUtils.isTokenExpired(this.accessToken) )
        // {
        //     return of(false);
        // }

        // If the access token exists, and it didn't expire, sign in using it
       // return this.signInUsingToken();
       return of(false);
    }
    /**
     * Sign in using the access token
     */


    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('token');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

}
