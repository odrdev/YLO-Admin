import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
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
import { SectionService } from './section.services';
import { ActivatedRoute,Router } from '@angular/router';
import { iSection,iSectionList} from './section.type';
import { iArticle } from '../article/article.type';
import { ArticleService } from '../article/article.services';
import { LawService } from '../law/law.services';
import { iLaw } from '../law/law.type';
import { MatAutocompleteSelectedEvent,MatAutocompleteModule } from '@angular/material/autocomplete';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import { iTopic } from '../topic/topic.type';
import { MatChipInputEvent,MatChipsModule } from '@angular/material/chips';
import { TopicService } from '../topic/topic.services';
import { ContentModal } from '../contentmodal/contentModal.component';
import { MatDialog } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill'
@Component({
    selector       : 'section-component',
    templateUrl    : 'section.component.html',
    styleUrls      : ['section.component.scss'],

    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, CdkDropList, QuillModule, MatChipsModule,TextFieldModule, CdkDrag,MatAutocompleteModule, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe,MatDatepickerModule],
})

export class SectionComponent implements OnInit, AfterViewInit, OnDestroy
{
    @Output() HideContentEvent = new EventEmitter<boolean>();
    @ViewChild('paginatorSection',{static: false}) private paginatorSection: MatPaginator;
    @ViewChild(MatSort,{static:false}) private _sort: MatSort;
   
    isEditing: boolean = false;
    SectionPagedList$: Observable<iSectionList[]>;
    SectionPagedList: iSectionList[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: iPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedItem: iSection| null = null;
    selectedItemForm: UntypedFormGroup;
    newItem: boolean;
    toggleOpen: boolean = false;
    txtSearch = "";
    articles: iArticle[];
    filteredArticles: iArticle[];
    selectedArticle:iArticle;
    selectedLaw:iLaw;
    articleCtrl = new FormControl();
    TopicList:iTopic[];
    filteredtopics$:Observable<iTopic[]>
    max=10;
    @ViewChild('articleInput') articleInput: ElementRef<HTMLInputElement>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    topicCtrl = new FormControl('');
    @ViewChild('topicInput') topicInput: ElementRef<HTMLInputElement>;
    topicSection: iTopic[];
    deletedtopicSection: iTopic[] = [];

    modules = {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'size': ['small', false, 'large'] }],  // custom dropdown
          [{ 'color': [] }],          // dropdown with defaults from theme
          [{ 'align': [false,'center','right'] }],
        ]
      };
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _SectionService: SectionService,
        private activatedRoute: ActivatedRoute,
        private _ArticleService: ArticleService,
        private _LawService: LawService,
        private _TopicService: TopicService,
        private router:Router,
        public dialog: MatDialog,
    )
    {
        console.log("Constructor");
        this.filteredtopics$ = this.topicCtrl.valueChanges.pipe(
            startWith(null),
            map((topic: string | null) => (topic ? this._filterTopic(topic) : this.TopicList.slice())),
          );
    }
    private _filterTopic(value: string): iTopic[] {
        const filterValue = value.toLowerCase();
    
        return this.TopicList.filter(topic => topic.title.toLowerCase().includes(filterValue));
      }

    filter(): void {
        const filterValue = this.articleInput.nativeElement.value.toLowerCase();
        this.filteredArticles = this.articles.filter(o => o.title.toLowerCase().includes(filterValue));
      }

    removeSelectedArticle(){
        console.log("remove")
        this.selectedArticle = null;
        this.articleCtrl.setValue("");
    }
    selectArticle(event){
        console.log(event)
        this.selectedArticle = event.option.value;

    }
    displayArticle(article:iArticle){

        return article && article.title ? article.title : article.guid;
    }
    drop(event: CdkDragDrop<iSection[]>) {
        var dropItem = this.SectionPagedList[event.previousIndex];
        var displacedItem = this.SectionPagedList[event.currentIndex]
        
        console.log("Drag drop")

        console.log(event)
        console.log(displacedItem)
        //update order in API
        var newOrderNumber = displacedItem.section_order;
        this._SectionService.reorder(this.selectedArticle.guid, dropItem.id, newOrderNumber).subscribe(res=>{
            console.log('moved Items')
            this._SectionService.getListPaging(this.selectedArticle.guid, this.txtSearch,0,this.paginatorSection.pageSize,"section_order","asc")
             .subscribe(res=>{console.log('update table')})
           
        })
        moveItemInArray(this.SectionPagedList, event.previousIndex, event.currentIndex);
      }
    ngOnInit(): void
    {
        console.log("On Init")
        // Create the selected product form
        this.selectedItemForm = this._formBuilder.group({
            id             : [0, [Validators.required]],
            title          : ['', [Validators.required]],
            articleGUID    : ['', [Validators.required]],
            subtitle       : [''],
            description    : [''],
            section_order  : [0],
            tags           : [''],

        });
        this.activatedRoute.data.subscribe(({Laws}) => {
            console.log("loaded data");
            this._ArticleService.List$.subscribe(res=>{
                console.log(res)
                this.articles = res;
                this.filteredArticles = res;
            });

          });
          this.activatedRoute.data.subscribe(({Topics}) => {
            console.log("loaded data");
            this._TopicService.List$.subscribe(res=>{
                console.log(res)
                this.TopicList = res;

            });

          });
        this.activatedRoute.queryParams.subscribe((articleGUID: any) => {
            console.log("pass article guid")
            console.log(articleGUID)
            var article:iArticle = this.articles.find(item=>item.guid===articleGUID.articleGUID);
            
            var sArticle =  article !== undefined ? article : this.articles[0];
            this.articleCtrl.setValue(sArticle)
            this.selectedArticle = sArticle;
           
            console.log(sArticle)
            this._LawService.getbyGUID(sArticle.lawGUID).subscribe(res=>{
                this.selectedLaw = res;
            });
            this._SectionService.getListPaging(sArticle.guid,"",0,10,"section_order","asc").subscribe(res=>{
                console.log(res)
            });
          });




        //Get data observer and subscribe to data
        this.SectionPagedList$ = this._SectionService.PagedList$;

        this.SectionPagedList$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res:iSectionList[])=>{
                console.log("subscribed to pagedlist$")
                console.log(res)
           
                this.max = res ? res.length + 1 : 1;
                this.SectionPagedList = res;



        });

       // Get the pagination and subscribe
        this._SectionService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: iPagination) =>
            {
                // Update the pagination
                console.log(pagination);
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            this.articleCtrl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((value) =>
                {
                   
                    this.closeDetails();
                    this.isLoading = true;
                    console.log(value)
                    return this._SectionService.getListPaging(value.guid, this.txtSearch,0,this.paginatorSection.pageSize,"section_order","asc")
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
                return this._SectionService.getListPaging(this.selectedArticle.guid, query.toLowerCase(),0,this.paginatorSection.pageSize,this._sort.active,this._sort.direction)
            }),
            map(()=>{
                this.isLoading = false
            })).subscribe();
    }

    ngAfterViewInit(): void
    {
        console.log("After View Init");
        console.log(this._sort)
        if ( this._sort && this.paginatorSection )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'section_order',
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
                    this.paginatorSection.pageIndex = 0;
                    console.log("sort")
                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this.paginatorSection.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._SectionService.getListPaging(this.selectedArticle.guid,this.txtSearch,this.paginatorSection.pageIndex,this.paginatorSection.pageSize,this._sort.active, this._sort.direction);
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
        this.topicSection = [];
        this.deletedtopicSection = []
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

        this._SectionService.getById(Id)
        .subscribe((item) =>
        {
            console.log(item)
            this.selectedItem = item;
            var itemForm:any = item;
          
            this.selectedItemForm.patchValue(itemForm);
            
            this._TopicService.getBySection(this.selectedItem.guid).subscribe(res=>{
                console.log(res);
                this.topicSection = res;
                this._changeDetectorRef.markForCheck();
            })
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    hideContent()
    {
      this.HideContentEvent.emit(false);
        
    }
    new(el:HTMLElement):void{
       
        this.newItem = true; 
        var newItemForm = {id:0, title:'',subtitle:"",description:"",tags:"",section_order:this.max, articleGUID:this.selectedArticle.guid};
        var newItem = {id:0, title:'',subtitle:"",description:"",tags:"",section_order:this.max, articleGUID:this.selectedArticle.guid};
        this.selectedItem = newItem;
        this.selectedItemForm.setValue(newItemForm);
        this.deletedtopicSection = [];
        this._changeDetectorRef.markForCheck();
        el.scrollIntoView();
    }
    create(): void
    {
        const newItem = this.selectedItemForm.getRawValue();
        // Create the products
        
    
        console.log(newItem)
        
        this._SectionService.create(newItem).subscribe((newItem) =>
        {
            // Go to new products
            this.selectedItem = newItem;

            // Fill the form
            this.selectedItemForm.patchValue(newItem);
            this.topicSection.forEach(item=>{
                this._SectionService.AddToTopic(newItem.guid, item.guid).subscribe(res=>{
                    console.log("Doctrine added to Topic");
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

        
        this._SectionService.update(item.id, item).subscribe({next: (event:any) =>{
            console.log('next');
            console.log(event);
            this.deletedtopicSection.forEach(res=>{
                this._SectionService.RemoveFromTopic(this.selectedItem.guid,res.guid).subscribe(x=>{
                    console.log("cleared doctrine");
                    
            });     
            });
            this.topicSection.forEach(res=>{
                this._SectionService.AddToTopic(this.selectedItem.guid,res.guid).subscribe(res=>{
                    console.log("added doctrine");
                });
            });

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
                this._SectionService.delete(item.id).subscribe(() =>
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
    
        var topic = this.TopicList.find(t=>t.title===event.value);
        // Add our fruit
        if (value) {
          this.topicSection.push(topic);
        }
    
        // Clear the input value
        event.chipInput!.clear();
    
        this.topicCtrl.setValue(null);
      }
    
      removeTopic(topic): void {
        const index = this.topicSection.indexOf(topic);
    
        if (index >= 0) {
          this.topicSection.splice(index, 1);
          this.deletedtopicSection.push(topic)
        }
      }
    
      selectedTopic(event: MatAutocompleteSelectedEvent): void {
        var topic = this.TopicList.find(t=>t.guid===event.option.value);
        if(topic !== undefined){
            this.topicSection.push(topic);
            
        }
        
        this.topicInput.nativeElement.value = '';
        this.topicCtrl.setValue(null);
      }

      viewContent(){
        console.log('view content')
        const dialogRef = this.dialog.open(ContentModal, {
            data: {id: this.selectedLaw.id},
              enterAnimationDuration:500, exitAnimationDuration:500
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
           
          });
    }
}