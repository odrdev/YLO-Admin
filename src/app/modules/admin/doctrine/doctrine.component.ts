import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
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
import { DoctrineService } from './doctrine.services';
import { ActivatedRoute,Router } from '@angular/router';
import { iDoctrine, iDoctrineList } from './doctrine.type';
import { TopicService } from '../topic/topic.services';
import { iTopic } from '../topic/topic.type';

@Component({
    selector       : 'doctrine-component',
    templateUrl    : 'doctrine.component.html',
    styles         : [
        /* language=SCSS */
        `  
            .subs-grid {
                grid-template-columns: 48px auto  100px 50px 48px;

                @screen sm {
                    grid-template-columns: 48px auto  150px 50px 48px;
                }

                @screen md {
                    grid-template-columns: 48px auto  300px 96px 48px; 
                }

                @screen lg {
                    grid-template-columns: 48px auto  350px 96px 48px;
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
    imports        : [NgIf, MatProgressBarModule, MatFormFieldModule, MatAutocompleteModule, MatChipsModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe,MatDatepickerModule,],
})

export class DoctrineComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('paginatorDoctrine',{static: false}) private paginatorDoctrine: MatPaginator;
    @ViewChild(MatSort,{static:false}) private _sort: MatSort;
   
    isEditing: boolean = false;
    PagedList$: Observable<iDoctrineList[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: iPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedItem: iDoctrine| null = null;
    selectedItemForm: UntypedFormGroup;
    newItem: boolean;
    toggleOpen: boolean = false;
    txtSearch = "";
    showContent:boolean = false;
    topics:iTopic[];
    filteredtopics$:Observable<iTopic[]>;
    topicDoctrine: iTopic[];
    deletedtopicDoctrine: iTopic[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    topicCtrl = new FormControl('');
    @ViewChild('topicInput') topicInput: ElementRef<HTMLInputElement>;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _DoctrineService: DoctrineService,
        private _TopicService:TopicService,
        private activatedRoute: ActivatedRoute,
        private router:Router
    )
    {
        console.log("Constructor")
        this.filteredtopics$ = this.topicCtrl.valueChanges.pipe(
            startWith(null),
            map((topic: string | null) => (topic ? this._filter(topic) : this.topics.slice())),
          );
    }
    private _filter(value: string): iTopic[] {
        const filterValue = value.toLowerCase();
    
        return this.topics.filter(topic => topic.title.toLowerCase().includes(filterValue));
      }
    ngOnInit(): void
    {
        console.log("On Init")
        // Create the selected product form
        this.selectedItemForm = this._formBuilder.group({
            id             : [0, [Validators.required]],
            details             : ['', [Validators.required]],
            citation             : [''],

        });

        //load data resolver
        console.log(this.activatedRoute.data)
        this.activatedRoute.data.subscribe(({Doctrines}) => {
            console.log("loaded data");
          });

          this.activatedRoute.data.subscribe(({Topics}) => {
            console.log("loaded Topics data");
          });  


        //Get data observer and subscribe to data
        this.PagedList$ = this._DoctrineService.PagedList$;

         this._TopicService.List$.subscribe(res=>{
                this.topics = res;
        });

        this.PagedList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
                console.log("subscribed")
                console.log(res)
        });

       // Get the pagination and subscribe
        this._DoctrineService.pagination$
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
                return this._DoctrineService.getListPaging(query.toLowerCase(),0,this.paginatorDoctrine.pageSize,this._sort.active,this._sort.direction)
            }),
            map(()=>{
                this.isLoading = false
            })).subscribe();
    }

    ngAfterViewInit(): void
    {
        console.log("After View Init");
        console.log(this._sort)
        if ( this._sort && this.paginatorDoctrine )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'details',
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
                    this.paginatorDoctrine.pageIndex = 0;
                    console.log("sort")
                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this.paginatorDoctrine.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._DoctrineService.getListPaging(this.txtSearch,this.paginatorDoctrine.pageIndex,this.paginatorDoctrine.pageSize,this._sort.active, this._sort.direction);
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
        this.topicDoctrine = [];
        this.deletedtopicDoctrine = [];
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
        
        this._DoctrineService.getById(Id)
        .subscribe((item) =>
        {
            console.log(item)
            this.selectedItem = item;
            var itemForm:any = item;
          
            this.selectedItemForm.patchValue(itemForm);
            
            this._TopicService.getByDoctrine(item.guid).subscribe(res=>{
                console.log(res);
                this.topicDoctrine = res;
                this._changeDetectorRef.markForCheck();
            })
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
        
        this.newItem = true; 
        var newItemForm = {id:0, details:'',citation:""};
        var newItem = {id:0, details:'',citation:""};
        this.selectedItem = newItem;
        this.selectedItemForm.setValue(newItemForm);
        this.topicDoctrine = [];
        this._changeDetectorRef.markForCheck();
        el.scrollIntoView();
    }
    create(): void
    {
        const newItem = this.selectedItemForm.getRawValue();
        // Create the products
        
    
        console.log(newItem)
        
        this._DoctrineService.create(newItem).subscribe((newItem) =>
        {
            // Go to new products
            this.selectedItem = newItem;

            // Fill the form
            this.selectedItemForm.patchValue(newItem);

            // Mark for check

         
            //add topic to topicDoctrine
            this.topicDoctrine.forEach(item=>{
                this._DoctrineService.AddToTopic(newItem.guid, item.guid).subscribe(res=>{
                    console.log("Doctrine added to Topic");
                });
            })    

            this._changeDetectorRef.markForCheck();
            this.showFlashMessage('success');
            this.newItem = false;
        });
    }

    update(): void
    {
        // Get the product object

        const item = this.selectedItemForm.getRawValue();
        
        this._DoctrineService.update(item.id, item).subscribe({next: (event:any) =>{
            console.log('next');
            console.log(event);
            this.showFlashMessage('success');
            this.newItem = false;

            console.log(this.deletedtopicDoctrine);
            console.log(this.topicDoctrine);
            this.deletedtopicDoctrine.forEach(res=>{
                this._DoctrineService.RemoveFromTopic(this.selectedItem.guid,res.guid).subscribe(x=>{
                    console.log("cleared doctrine");
                    
            });     
            });
            this.topicDoctrine.forEach(res=>{
                this._DoctrineService.AddToTopic(this.selectedItem.guid,res.guid).subscribe(res=>{
                    console.log("added doctrine");
                });
            });
            this.deletedtopicDoctrine = [];
            this._changeDetectorRef.markForCheck();
              
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
                this._DoctrineService.delete(item.id).subscribe(() =>
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

    addTopic(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
    
        var topic = this.topics.find(t=>t.title===event.value);
        // Add our fruit
        if (value) {
          this.topicDoctrine.push(topic);
        }
    
        // Clear the input value
        event.chipInput!.clear();
    
        this.topicCtrl.setValue(null);
      }
    
      removeTopic(topic): void {
        const index = this.topicDoctrine.indexOf(topic);
    
        if (index >= 0) {
          this.topicDoctrine.splice(index, 1);
          this.deletedtopicDoctrine.push(topic)
        }
      }
    
      selectedTopic(event: MatAutocompleteSelectedEvent): void {
        var topic = this.topics.find(t=>t.guid===event.option.value);
        if(topic !== undefined){
            this.topicDoctrine.push(topic);
            
        }
        
        this.topicInput.nativeElement.value = '';
        this.topicCtrl.setValue(null);
      }

}