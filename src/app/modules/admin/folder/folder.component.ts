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
import { FolderService } from './folder.services';
import { ActivatedRoute } from '@angular/router';
import { iFolder, iFolderList } from './folder.type';
import { iLaw, iLawList } from '../law/law.type';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { LawService } from '../law/law.services';
import { MatChipInputEvent,MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent,MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { FolderLaw } from './folder-law.component';
@Component({
    selector       : 'folder',
    templateUrl    : 'folder.component.html',
    styles         : [
        /* language=SCSS */
        `  
            .subs-grid {
                grid-template-columns: 48px auto  50px 50px;

                @screen sm {
                    grid-template-columns: 48px 48px auto  50px 50px 50px;
                }

                @screen md {
                    grid-template-columns: 48px 48px auto 96px 96px 96px; 
                }

                @screen lg {
                    grid-template-columns: 48px 48px auto  96px 96px 96px  ;
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

        

            .description{
                opacity: 70%;
                font-size: 12px;
            }

            .cdk-drag-preview {
                box-sizing: border-box;
                border-radius: 4px;
                box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                            0 8px 10px 1px rgba(0, 0, 0, 0.14),
                            0 3px 14px 2px rgba(0, 0, 0, 0.12);
              }
              
              .cdk-drag-placeholder {
                opacity: 0;
              }
              
              .cdk-drag-animating {
                transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
              }
              
             
              
              .folder-table.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
                transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
              }
 
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, CdkDropList, CdkDrag, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, MatAutocompleteModule,MatChipsModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe,MatDatepickerModule],
})

export class FolderComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) private _sort: MatSort;
   
    isEditing: boolean = false;
    PagedList$: Observable<iFolderList[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: iPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedItem: iFolder| null = null;
    selectedItemForm: UntypedFormGroup;
    newItem: boolean;
    toggleOpen: boolean = false;
    txtSearch = "";
    FolderPagedList:iFolderList[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    laws:iLaw[];
    filteredlaws$:Observable<iLaw[]>;
    folderLaw: iLaw[];
    deletedfolderLaw: iLaw[] = [];
    lawCtrl = new FormControl('');
    @ViewChild('lawInput') lawInput: ElementRef<HTMLInputElement>;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _folderService: FolderService,
        private _lawService: LawService,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,

    )
    {
        console.log("Constructor")
        this.filteredlaws$ = this.lawCtrl.valueChanges.pipe(
            startWith(null),
            map((law: string | null) => (law ? this._filter(law) : this.laws.slice())),
          );
    }
    private _filter(value: string): iLaw[] {
        const filterValue = value.toLowerCase();
    
        return this.laws.filter(law => law.title.toLowerCase().includes(filterValue));
      }
    drop(event: CdkDragDrop<iFolder[]>) {
        var dropItem = this.FolderPagedList[event.previousIndex];
        var displacedItem = this.FolderPagedList[event.currentIndex]
        
        console.log("Drag drop")

        console.log(event)
        console.log(displacedItem)
        //update order in API
        var newOrderNumber = (this.pagination.size * this.pagination.page) + event.currentIndex;
        this._folderService.reorder(dropItem.id, newOrderNumber).subscribe(res=>{
            console.log('moved Items')
            this._folderService.getListPaging( this.txtSearch,0,this._paginator.pageSize,"folder_order","asc")
             .subscribe(res=>{console.log('update table')})
           
        })
        moveItemInArray(this.FolderPagedList, event.previousIndex, event.currentIndex);
      }

    ngOnInit(): void
    {
        console.log("On Init")
        // Create the selected product form
        this.selectedItemForm = this._formBuilder.group({
            id             : [0, [Validators.required]],
            name             : ['', [Validators.required]],
        });

        //load data resolver
        this.activatedRoute.data.subscribe(({Laws}) => {
            console.log("loaded laws");
          });

        console.log(this.activatedRoute.data)
        this.activatedRoute.data.subscribe(({folders}) => {
            console.log("loaded folders");
          });


        //Get data observer and subscribe to data
        this.PagedList$ = this._folderService.PagedList$;

        this.PagedList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
                console.log("subscribed")
                console.log(res)
                this.FolderPagedList = res;
        });

        this._lawService.List$.subscribe(res=>{
            this.laws = res;
            console.log(this.laws)
        })

       // Get the pagination and subscribe
        this._folderService.pagination$
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
                return this._folderService.getListPaging(query.toLowerCase(),0,this._paginator.pageSize,this._sort.active,this._sort.direction)
            }),
            map(()=>{
                this.isLoading = false
            })).subscribe();
    }

    ngAfterViewInit(): void
    {
        console.log("After View Init");
        console.log(this._sort)
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'folder_order',
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
                    this._paginator.pageIndex = 0;
                    console.log("sort")
                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._folderService.getListPaging(this.txtSearch,this._paginator.pageIndex,this._paginator.pageSize,this._sort.active, this._sort.direction);
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

        this._folderService.getById(Id)
        .subscribe((item) =>
        {
            console.log(item)
            this.selectedItem = item;
            var itemForm:any = item;
          
            this.selectedItemForm.patchValue(itemForm);
            this._lawService.getByFolder(item.guid).subscribe(res=>{
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
        var newItemForm = {id:0, name:'',};
        var newItem = {id:0, name:''};
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
        
        this._folderService.create(newItem).subscribe((newItem) =>
        {
            // Go to new products
            this.selectedItem = newItem;

            // Fill the form
            this.selectedItemForm.patchValue(newItem);

            this.folderLaw.forEach(item=>{
                this._folderService.AddLaw(newItem.guid, item.guid).subscribe(res=>{
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

        
        this._folderService.update(item.id, item).subscribe({next: (event:any) =>{
            console.log('next');
            console.log(event);
            this.showFlashMessage('success');
            this.newItem = false;

            console.log(this.deletedfolderLaw)
    
            this.deletedfolderLaw.forEach(res=>{
                console.log('removing folders')
                this._folderService.RemoveLaw( this.selectedItem.guid,res.guid).subscribe(x=>{
                    console.log("cleared folder");
                    
            });     
            });
            this.folderLaw.forEach(res=>{
                console.log('adding folders')
                this._folderService.AddLaw( this.selectedItem.guid,res.guid,).subscribe(res=>{
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
                this._folderService.delete(item.id).subscribe(() =>
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

    addLaw(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
    
        var law = this.laws.find(t=>t.title===event.value);
        // Add our fruit
        if (value) {
          this.folderLaw.push(law);
        }
    
        // Clear the input value
        event.chipInput!.clear();
    
        this.lawCtrl.setValue(null);
      }
    
      removeLaw(law): void {
        console.log(law)
        const index = this.folderLaw.indexOf(law);
    
        if (index >= 0) {
          this.folderLaw.splice(index, 1);
        }

        this.deletedfolderLaw.push(law);
      }
    
      selectedLaw(event: MatAutocompleteSelectedEvent): void {
        var law = this.laws.find(t=>t.guid===event.option.value);
        
        if(law !== undefined){
            this.folderLaw.push(law);
            
        }
        console.log( this.folderLaw)
        this.lawInput.nativeElement.value = '';
        this.lawCtrl.setValue(null);
      }

            viewLaws(item:any){
              console.log('view content')
              const dialogRef = this.dialog.open(FolderLaw, {
                  height: '70%',
            width: '80%',
                  data: {guid: item.guid, name:item.name, lawlist:this.laws},
                    enterAnimationDuration:500, exitAnimationDuration:500
                });
            
                dialogRef.afterClosed().subscribe(result => {
                  console.log('The dialog was closed');
                 
                });
          }
}