import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
  } from '@angular/common/http';
import { environment } from 'environments/environment';

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { iPagination } from '../global.type';
import { AuthService } from 'app/core/auth/auth.service';
import { iFolder, iFolderList, iFolderResult } from './folder.type';
@Injectable({providedIn: 'root'})
export class FolderService
{
    // Private

    private _item: BehaviorSubject<iFolder | null> = new BehaviorSubject(null);
    private _List: BehaviorSubject<iFolder[] | null> = new BehaviorSubject(null);
    private _pagedList: BehaviorSubject<iFolderList[] | null> = new BehaviorSubject(null);
    private apiURL = environment.apiendpoint + "folder/";
    private _pagination: BehaviorSubject<iPagination | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private authServ: AuthService)
    {
    }

    getHeaders() {
        return {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authServ.accessToken,
            'userguid': this.authServ.guid,
          })
        };
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


 
    /**
     * Getter for services
     */
    get PagedList$(): Observable<iFolderList[]>
    {
        return this._pagedList.asObservable();
    }
    get List$(): Observable<iFolder[]>
    {
        return this._List.asObservable();
    }
    get item$(): Observable<iFolder>
    {
        return this._item.asObservable();
    }

    get pagination$(): Observable<iPagination>
    {
        return this._pagination.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    getList(): Observable<iFolder[]>
    {

        return this._httpClient.get<iFolder[]>(this.apiURL,this.getHeaders()).pipe(
            tap((res) =>
            {
                res = res.filter((type:any)=>{
                    return type.isDeleted === false
                })
                this._List.next(res);
            }),
        );
    }
/**
     * Get Paged List
     *
     *
     * @param page
     * @param size
     * @param sortField
     * @param sortAscending
     * @param txtsearch
     */
    getListPaging(txtsearch = "", page = 0, size = 10,sortField="name", sortAscending='asc'): Observable<iFolderResult>
    {
        
        var param = {
            "nameFilter": txtsearch,
            "page": page,
            "pagesize": size,
            "sortField": sortField,
            "sortAscending": sortAscending !== 'desc' ? true : false          };
        var url = this.apiURL + "Paging"
        console.log(param)
        return this._httpClient.post<iFolderResult>(url,param,this.getHeaders()).pipe(
            tap((res) =>
            {
                console.log(res.Pagination)
               this._pagination.next(res.Pagination);
                this._pagedList.next(res.result);
            }),
            catchError((err,caught)=>{
                console.log(err);
                return throwError(err)
            })
        );
    }

    

    getById(id:any): Observable<iFolder>
    {
        return this._pagedList.pipe(
            take(1),
            map((items) =>
            {
                // Find the product
                const item = items.find(i => i.id === id) || null;

                // Update the product
                this._item.next(item);

                // Return the product
                return item;
            }),
            switchMap((item) =>
            {
                if ( !item )
                {
                    return throwError('Could not find product with id of ' + id + '!');
                }

                return of(item);
            }),
        );
    }

    /**
     * Create product
     */
    
    create(item:iFolder): Observable<iFolder>
    {
        return this.PagedList$.pipe(
            take(1),
            switchMap(products => this._httpClient.post<iFolder>(this.apiURL, item, this.getHeaders()).pipe(
                map((newItem) =>
                {
                    // Update the products with the new product
                    this._pagedList.next([newItem, ...products]);

                    // Return the new product
                    return newItem;
                }),
            )),
        );
    }

    /**
     * Update service
     *
     * @param id
     * @param item
     */
    update(id: any, item: iFolder): Observable<iFolder>
    {
        console.log(item)
        return this.PagedList$.pipe(
            take(1),
            switchMap(items => this._httpClient.put<iFolder>(this.apiURL +  id, item, this.getHeaders()).pipe(
                map((updatedItem) =>
                {
                    // Find the index of the updated service
                    const index = items.findIndex(item => item.id === id);

                    // Update the service
                    items[index] = updatedItem;

                    // Update the service
                    this._pagedList.next(items);

                    // Return the updated service
                    return updatedItem;
                }),
                switchMap(updatedItem => this.item$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        // Update the service if it's selected
                        this._item.next(updatedItem);

                        // Return the updated service
                        return updatedItem;
                    }),
                )),
            )),
        );
    }

    /**
     * Delete the services
     *
     * @param id
     */
    delete(id: number): Observable<boolean>
    {
        return this.PagedList$.pipe(
            take(1),
            switchMap(items => this._httpClient.delete(this.apiURL + id,this.getHeaders() ).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted product
                    const index = items.findIndex(item => item.id === id);

                    // Delete the product
                    items.splice(index, 1);

                    // Update the products
                    this._pagedList.next(items);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
    getByLaw(GUID:any){
        var url = this.apiURL + "Law/" + GUID
        return this._httpClient.get<iFolder[]>(url,this.getHeaders()).pipe();
    }
    getByTopic(GUID:any){
        var url = this.apiURL + "Topic/" + GUID
        return this._httpClient.get<iFolder[]>(url,this.getHeaders()).pipe();
    }
    AddTopic(FolderGUID, TopicGUID){ 
        var url = this.apiURL + FolderGUID + "/AddTopic/" + TopicGUID
        return  this._httpClient.post(url, null, this.getHeaders()).pipe();
    }
    AddLaw(FolderGUID, LawGUID){ 
        var url = this.apiURL + FolderGUID + "/AddLaw/" + LawGUID
        return  this._httpClient.post(url, null, this.getHeaders()).pipe();
    }
    RemoveTopic(FolderGUID, LawGUID){ 
        var url = this.apiURL + FolderGUID + "/RemoveTopic/" + LawGUID
        return  this._httpClient.delete(url, this.getHeaders()).pipe();
    }
    RemoveLaw(FolderGUID, TopicGUID){ 
        var url = this.apiURL + FolderGUID + "/RemoveLaw/" + TopicGUID
        return  this._httpClient.delete(url, this.getHeaders()).pipe();
    }
    reorder(folderId,orderNumber): Observable<any>
    {
        var url = this.apiURL +"reorder/" + folderId + "?FolderOrder="+orderNumber
        return this._httpClient.post<iFolder>(url, null, this.getHeaders());
        
    }
}
