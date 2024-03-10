import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { iPagination } from '../global.type';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil, BehaviorSubject, of, tap, startWith } from 'rxjs';
import { DateTime } from 'luxon';
import { ArticleService } from './article.services';
import { LawService } from '../law/law.services';
import { ActivatedRoute,Router } from '@angular/router';
import { iArticle, iArticleList } from './article.type';
import { iLaw } from '../law/law.type';
import { MatAutocompleteSelectedEvent,MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent,MatChipsModule } from '@angular/material/chips';


@Component({
    selector       : 'article-component',
    templateUrl    : 'article.component.html',
    styles         : [
        /* language=SCSS */
        `  
            .article-grid {
                grid-template-columns: 48px auto  100px 50px 50px 50px;

                @screen sm {
                    grid-template-columns: 48px auto  150px 50px 50px  50px;
                }

                @screen md {
                    grid-template-columns: 48px auto  150px 96px 72px  72px; 
                }

                @screen lg {
                    grid-template-columns: 48px auto  250px 96px 72px  72px ;
                }
            }
            .file-input {

                display: none;
              
              }

              .edit-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center; /* Center horizontally */
                align-items: center; /* Center vertically */
                background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
                backdrop-filter: blur(5px); /* Blur the background */
                z-index: 100
            }

            .edit-dialog {
                background-color: white;
                padding: 20px;
                width: 40%;
                min-width: 221.594px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
            }

            .circle{
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }
            .red{
                color: red;
            }

            p{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .description{
                opacity: 70%;
                font-size: 12px;
            }
 
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [ NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule,MatChipsModule, MatAutocompleteModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe,MatDatepickerModule,],
})

export class ArticleComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('paginatorArticle',{static: false}) private paginatorArticle: MatPaginator;
    @ViewChild(MatSort,{static:false}) private _sort: MatSort;
   
    isEditing: boolean = false;
    PagedList$: Observable<iArticleList[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: iPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedItem: iArticle| null = null;
    selectedItemForm: UntypedFormGroup;
    newItem: boolean;
    toggleOpen: boolean = false;
    txtSearch = "";
    showContent:boolean = false;
    laws:iLaw[];
    filteredLaws:iLaw[];
    selectedLaw:iLaw;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    lawCtrl = new FormControl();
    @ViewChild('lawInput') lawInput: ElementRef<HTMLInputElement>;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _ArticleService: ArticleService,
        private _lawService: LawService,
        private activatedRoute: ActivatedRoute,
        private router:Router
    )
    {
        console.log("Constructor");


    }
    filter(): void {
        const filterValue = this.lawInput.nativeElement.value.toLowerCase();
        this.filteredLaws = this.laws.filter(o => o.title.toLowerCase().includes(filterValue));
      }
    removeSelectedLaw(){
        console.log("remove")
        this.selectedLaw = null;
        this.lawCtrl.setValue("");
    }
    selectLaw(event){
        console.log(event)
        this.selectedLaw = event.option.value;
    }
    displayLaw(law:iLaw){

        return law && law.title ? law.title : law.guid;
    }
    ngOnInit(): void
    {
        console.log("On Init")
        this.showContent = false;
        this.activatedRoute.data.subscribe(({Laws}) => {
            console.log("loaded data");
            this._lawService.List$.subscribe(res=>{
                console.log(res)
                this.laws = res;
                this.filteredLaws = res;
            });

          });

        this.activatedRoute.queryParams.subscribe((lawGUID: any) => {
            console.log("pass lawGUID")
            console.log(lawGUID)
            var law:iLaw = this.laws.find(item=>item.guid===lawGUID.lawGUID);
            console.log(law)
            var sLaw =  law !== undefined ? law : this.laws[0];
            this.lawCtrl.setValue(sLaw)
            this.selectedLaw = sLaw;
            this._ArticleService.getListPaging(sLaw.guid,"",0,10,"title","asc").subscribe(res=>{
                console.log(res)
            });
          });

        // Create the selected product form
        this.selectedItemForm = this._formBuilder.group({
            id             : [0, [Validators.required]],
            title          : ['', [Validators.required]],
            lawGUID        : ['', [Validators.required]],
            subtitle       : [''],
            description    : [''],
            visible        : [false],
            tags           : [''],

        });


        //load data resolver
        console.log(this.activatedRoute.data)


        //Get data observer and subscribe to data
        this.PagedList$ = this._ArticleService.PagedList$;

        this.PagedList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
                console.log("Article subscribed")
                console.log(res)
        });




       // Get the pagination and subscribe
        this._ArticleService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: iPagination) =>
            {
                // Update the pagination
                console.log(pagination);
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            this.lawCtrl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((value) =>
                {
                   
                    this.closeDetails();
                    this.isLoading = true;
                    return this._ArticleService.getListPaging(value.guid,this.txtSearch,0,this.paginatorArticle.pageSize,this._sort.active,this._sort.direction)
                }),
                map(()=>{
                    this.isLoading = false
                })).subscribe();
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
                this.txtSearch = query;
                this.closeDetails();
                this.isLoading = true;
                return this._ArticleService.getListPaging(this.selectedLaw.guid, query.toLowerCase(),0,this.paginatorArticle.pageSize,this._sort.active,this._sort.direction)
            }),
            map(()=>{
                this.isLoading = false
            })).subscribe();
    }

    ngAfterViewInit(): void
    {
        console.log("After View Init");
        console.log(this._sort)
        if ( this._sort && this.paginatorArticle )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'title',
                start       : 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() =>
                {
                    // Reset back to the first page
                    this.paginatorArticle.pageIndex = 0;
                    console.log("sort")
                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this.paginatorArticle.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._ArticleService.getListPaging(this.selectedLaw.guid, this.txtSearch,this.paginatorArticle.pageIndex,this.paginatorArticle.pageSize,this._sort.active, this._sort.direction);
                }),
                map(() =>
                {
                    this.isLoading = false;
                }),
            ).subscribe();
        }
    }

    numericValidator(control) {
        if (control.value && isNaN(control.value)) {
          return { 'numeric': true };
        }
        return null;
      }



    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    closeDetails(): void
    {
        this.newItem = false;
        this.selectedItem = null;
    }

    toggleDetails(Id: number): void
    {
        this.newItem = false;

        if ( this.selectedItem && this.selectedItem.id === Id )
        {
            // Close the details
           
            this.closeDetails();
            return;
        }

        this._ArticleService.getById(Id)
        .subscribe((item) =>
        {
            console.log(item)
            this.selectedItem = item;
            var itemForm:any = item;
          
            this.selectedItemForm.patchValue(itemForm);
            
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    toggleContent(event)
    {
        this.newItem = false;
        this.closeDetails;
        this.showContent=event;
    }
    
    new(el:HTMLElement):void{
        console.log("New")
        console.log(this.selectedLaw)
        this.newItem = true; 
        var newItemForm = {id:0, title:'',subtitle:"",description:"",tags:"",visible:false, lawGUID:this.selectedLaw.guid};
        var newItem = {id:0, title:'',subtitle:"",description:"",tags:"",visible:false, lawGUID:this.selectedLaw.guid};
        this.selectedItem = newItem;
        this.selectedItemForm.setValue(newItemForm);

        this._changeDetectorRef.markForCheck();
        el.scrollIntoView();
    }
    create(): void
    {
        const newItem = this.selectedItemForm.getRawValue();
        // Create the products
        
    
        console.log(newItem)
        
        this._ArticleService.create(newItem).subscribe((newItem) =>
        {
            // Go to new products
            this.selectedItem = newItem;

            // Fill the form
            this.selectedItemForm.patchValue(newItem);

 
            // Mark for check
            this._changeDetectorRef.markForCheck();
            this.showFlashMessage('success');
            this.newItem = false;
        });
    }

    update(): void
    {
        // Get the product object

        const item = this.selectedItemForm.getRawValue();

        
        this._ArticleService.update(item.id, item).subscribe({next: (event:any) =>{
            console.log('next');
            console.log(event);
            this.showFlashMessage('success');
            this.newItem = false;
              
        },complete(){
            console.log('complete');
        }
        ,error(err) {
            this.showFlashMessage("error");
        },});
        this._changeDetectorRef.markForCheck();

    }
    delete(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete Item',
            message: 'Are you sure you want to remove this item? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) =>
        {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the product object
                const item = this.selectedItemForm.getRawValue();

                // Delete the product on the server
                this._ArticleService.delete(item.id).subscribe(() =>
                {
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() =>
        {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}