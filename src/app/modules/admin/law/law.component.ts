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
import { LawService } from './law.services';
import { FolderService } from '../folder/folder.services';
import { ActivatedRoute,Router } from '@angular/router';
import { iLaw, iLawList } from './law.type';
import { iFolder, iFolderList } from '../folder/folder.type';
import { MatAutocompleteSelectedEvent,MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent,MatChipsModule } from '@angular/material/chips';
import { ContentModal } from '../contentmodal/contentModal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector       : 'Law',
    templateUrl    : 'law.component.html',
    styles         : [
        /* language=SCSS */
        `  
            .law-grid {
                grid-template-columns: auto  48px 48px 50px;

                @screen sm {
                    grid-template-columns: 48px auto  150px 50px 50px  50px 50px;
                }

                @screen md {
                    grid-template-columns: 48px auto  150px 96px 72px 72px 72px; 
                }

                @screen lg {
                    grid-template-columns: 48px auto  250px 96px 72px 72px 72px;
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

export class LawComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('paginatorLaw',{static: false}) private paginatorLaw: MatPaginator;
    @ViewChild(MatSort,{static:false}) private _sort: MatSort;
   
    isEditing: boolean = false;
    PagedList$: Observable<iLawList[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: iPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedItem: iLaw| null = null;
    selectedItemForm: UntypedFormGroup;
    newItem: boolean;
    toggleOpen: boolean = false;
    txtSearch = "";
    folders:iFolder[];
    filteredfolders$:Observable<iFolder[]>;
    folderLaw: iFolder[];
    deletedfolderLaw: iFolder[] = [];
    folderCtrl = new FormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('folderInput') folderInput: ElementRef<HTMLInputElement>;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _LawService: LawService,
        private _foldeService: FolderService,
        private activatedRoute: ActivatedRoute,
        private router:Router,
        public dialog: MatDialog,
    )
    {
        console.log("Constructor");
        this.filteredfolders$ = this.folderCtrl.valueChanges.pipe(
            startWith(null),
            map((topic: string | null) => (topic ? this._filter(topic) : this.folders.slice())),
          );

    }
    private _filter(value: string): iFolder[] {
        const filterValue = value.toLowerCase();
    
        return this.folders.filter(topic => topic.name.toLowerCase().includes(filterValue));
      }
    ngOnInit(): void
    {
        console.log("On Init")

        // Create the selected product form
        this.selectedItemForm = this._formBuilder.group({
            id             : [0, [Validators.required]],
            title             : ['', [Validators.required]],
            subtitle             : [''],
            description             : [''],
            tags             : [''],

        });

        //load data resolver
        console.log(this.activatedRoute.data)
        this.activatedRoute.data.subscribe(({Laws}) => {
            console.log("loaded data");
          });

          console.log(this.activatedRoute.data)
          this.activatedRoute.data.subscribe(({Folders}) => {
              console.log("loaded data");
            });
        //Get data observer and subscribe to data
        this.PagedList$ = this._LawService.PagedList$;

        this.PagedList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
                console.log("subscribed")
                console.log(res)
        });

        this._foldeService.List$.subscribe(res=>{
            this.folders = res;
        })
       // Get the pagination and subscribe
        this._LawService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: iPagination) =>
            {
                // Update the pagination
                console.log(pagination);
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

 
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
                return this._LawService.getListPaging(query.toLowerCase(),0,this.paginatorLaw.pageSize,this._sort.active,this._sort.direction)
            }),
            map(()=>{
                this.isLoading = false
            })).subscribe();
    }

    ngAfterViewInit(): void
    {
        console.log("After View Init");
        console.log(this._sort)
        if ( this._sort && this.paginatorLaw )
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
                    this.paginatorLaw.pageIndex = 0;
                    console.log("sort")
                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this.paginatorLaw.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._LawService.getListPaging(this.txtSearch,this.paginatorLaw.pageIndex,this.paginatorLaw.pageSize,this._sort.active, this._sort.direction);
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

        this._LawService.getById(Id)
        .subscribe((item) =>
        {
            console.log(item)
            this.selectedItem = item;
            var itemForm:any = item;
          
            this.selectedItemForm.patchValue(itemForm);
            
            this._foldeService.getByLaw(item.guid).subscribe(res=>{
                console.log(res);
                this.folderLaw = res;
                this._changeDetectorRef.markForCheck();
            })
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    
    new(el:HTMLElement):void{
        
        this.newItem = true; 
        var newItemForm = {id:0, title:'',subtitle:"",description:"",tags:""};
        var newItem = {id:0, title:'',subtitle:"",description:"",tags:""};
        this.selectedItem = newItem;
        this.selectedItemForm.setValue(newItemForm);
        this.folderLaw = [];
        this.deletedfolderLaw = [];
        this._changeDetectorRef.markForCheck();
        el.scrollIntoView();
    }
    create(): void
    {
        const newItem = this.selectedItemForm.getRawValue();
        // Create the products
        
    
        console.log(newItem)
        
        this._LawService.create(newItem).subscribe((newItem) =>
        {
            // Go to new products
            this.selectedItem = newItem;

            // Fill the form
            this.selectedItemForm.patchValue(newItem);

             //add Law to Folder
             this.folderLaw.forEach(item=>{
                this._foldeService.AddLaw(item.guid, newItem.guid).subscribe(res=>{
                    console.log("Law added to Folder");
                });
            })    
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

        
        this._LawService.update(item.id, item).subscribe({next: (event:any) =>{
            console.log('next');
            console.log(event);
            this.showFlashMessage('success');
            this.newItem = false;

    
            this.deletedfolderLaw.forEach(res=>{
                this._foldeService.RemoveLaw(res.guid, this.selectedItem.guid).subscribe(x=>{
                    console.log("cleared folder");
                    
            });     
            });
            this.folderLaw.forEach(res=>{
                this._foldeService.AddLaw(res.guid, this.selectedItem.guid).subscribe(res=>{
                    console.log("added to folder");
                });
            });
            this.deletedfolderLaw = [];
              
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
                this._LawService.delete(item.id).subscribe(() =>
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
    addFolder(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
    
        var folder = this.folders.find(t=>t.name===event.value);
        // Add our fruit
        if (value) {
          this.folderLaw.push(folder);
        }
    
        // Clear the input value
        event.chipInput!.clear();
    
        this.folderCtrl.setValue(null);
      }
    
      removeFolder(folder): void {
        console.log(folder)
        const index = this.folderLaw.indexOf(folder);
    
        if (index >= 0) {
          this.folderLaw.splice(index, 1);
        }
      }
    
      selectedFolder(event: MatAutocompleteSelectedEvent): void {
        var folder = this.folders.find(t=>t.guid===event.option.value);
        
        if(folder !== undefined){
            this.folderLaw.push(folder);
            
        }
        console.log( this.folderLaw)
        this.folderInput.nativeElement.value = '';
        this.folderCtrl.setValue(null);
      }

      toggleContent(item:iLaw){
         this.router.navigate(['article'],{ queryParams: { lawGUID: item.guid }});
      }

      viewContent(item:any){
        console.log('view content')
        const dialogRef = this.dialog.open(ContentModal, {
            data: {id: item.id},
              enterAnimationDuration:500, exitAnimationDuration:500
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
           
          });
    }

}