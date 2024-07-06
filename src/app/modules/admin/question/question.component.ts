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
import { QuestionService } from './question.services';
import { ActivatedRoute,Router } from '@angular/router';
import { iQuestion, iQuestionList } from './question.type';
import { TopicService } from '../topic/topic.services';
import { iTopic } from '../topic/topic.type';
import { QuillModule } from 'ngx-quill';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
	ClassicEditor,
	AccessibilityHelp,
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CodeBlock,
	Essentials,
	FindAndReplace,
	GeneralHtmlSupport,
	Heading,
	HorizontalLine,
	Indent,
	IndentBlock,
	Italic,
	Link,
	Paragraph,
	SelectAll,
	Style,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	Undo,
	type EditorConfig
} from 'ckeditor5';
//import 'ckeditor5/ckeditor5.css';
@Component({
    selector       : 'question-component',
    templateUrl    : 'question.component.html',
    styleUrls      : ['question.component.scss'],
  
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf,QuillModule,CKEditorModule, MatRadioModule, MatProgressBarModule, MatFormFieldModule, MatAutocompleteModule, MatChipsModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe,MatDatepickerModule,],
})

export class QuestionComponent implements OnInit, AfterViewInit, OnDestroy
{

    public Editor = ClassicEditor;
    public config = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'findAndReplace',
                'selectAll',
                '|',
                'heading',
                'style',
                '|',
                'bold',
                'italic',
                '|',
                'horizontalLine',
                'link',
                'insertTable',
                'blockQuote',
                'codeBlock',
                '|',
                'alignment',
                '|',
                'indent',
                'outdent',
                '|',
                'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            Alignment,
            Autoformat,
            AutoLink,
            Autosave,
            BlockQuote,
            Bold,
            CodeBlock,
            Essentials,
            FindAndReplace,
            GeneralHtmlSupport,
            Heading,
            HorizontalLine,
            Indent,
            IndentBlock,
            Italic,
            Link,
            Paragraph,
            SelectAll,
            Style,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            Undo
        ],
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true
                }
            ]
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        placeholder: '',
        style: {
            definitions: [
                {
                    name: 'Article category',
                    element: 'h3',
                    classes: ['category']
                },
                {
                    name: 'Title',
                    element: 'h2',
                    classes: ['document-title']
                },
                {
                    name: 'Subtitle',
                    element: 'h3',
                    classes: ['document-subtitle']
                },
                {
                    name: 'Info box',
                    element: 'p',
                    classes: ['info-box']
                },
                {
                    name: 'Side quote',
                    element: 'blockquote',
                    classes: ['side-quote']
                },
                {
                    name: 'Marker',
                    element: 'span',
                    classes: ['marker']
                },
                {
                    name: 'Spoiler',
                    element: 'span',
                    classes: ['spoiler']
                },
                {
                    name: 'Code (dark)',
                    element: 'pre',
                    classes: ['fancy-code', 'fancy-code-dark']
                },
                {
                    name: 'Code (bright)',
                    element: 'pre',
                    classes: ['fancy-code', 'fancy-code-bright']
                }
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    };

    @ViewChild('paginatorQuestion',{static: false}) private paginatorQuestion: MatPaginator;
    @ViewChild(MatSort,{static:false}) private _sort: MatSort;
   
    isEditing: boolean = false;
    PagedList$: Observable<iQuestionList[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: iPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedItem: iQuestion| null = null;
    selectedItemForm: UntypedFormGroup;
    newItem: boolean;
    toggleOpen: boolean = false;
    txtSearch = "";
    showContent:boolean = false;
    topics:iTopic[];
    filteredtopics$:Observable<iTopic[]>;
    topicQuestion: iTopic[];
    deletedtopicQuestion: iTopic[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    topicCtrl = new FormControl('');
    
    questionDetails:string;

    modules = {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'list': 'check' }],
          [{ 'size': ['small', false, 'large'] }],  // custom dropdown
          [{ 'color': [] }],          // dropdown with defaults from theme
          [{ 'align': [false,'center','right'] }],
        ]
      };

    @ViewChild('topicInput') topicInput: ElementRef<HTMLInputElement>;
    isLayoutReady: boolean;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _QuestionService: QuestionService,
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
            description             : ['', [Validators.required]],
            answer             : [false, [Validators.required]],
            explanation             : ['', [Validators.required]],
        });

        //load data resolver
        console.log(this.activatedRoute.data)
        this.activatedRoute.data.subscribe(({Questions}) => {
            console.log("loaded data");
          });

          this.activatedRoute.data.subscribe(({Topics}) => {
            console.log("loaded Topics data");
          });  

          this.isLayoutReady = true;
   
        //Get data observer and subscribe to data
        this.PagedList$ = this._QuestionService.PagedList$;

         this._TopicService.List$.subscribe(res=>{
                this.topics = res;
        });

        this.PagedList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res=>{
                console.log("subscribed")
                console.log(res)
        });

       // Get the pagination and subscribe
        this._QuestionService.pagination$
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
                return this._QuestionService.getListPaging(query.toLowerCase(),0,this.paginatorQuestion.pageSize,this._sort.active,this._sort.direction)
            }),
            map(()=>{
                this.isLoading = false
            })).subscribe();
    }

    ngAfterViewInit(): void
    {
        console.log("After View Init");
        console.log(this._sort)
        if ( this._sort && this.paginatorQuestion )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'id',
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
                    this.paginatorQuestion.pageIndex = 0;
                    console.log("sort")
                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this.paginatorQuestion.page).pipe(
                switchMap(() =>
                {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._QuestionService.getListPaging(this.txtSearch,this.paginatorQuestion.pageIndex,this.paginatorQuestion.pageSize,this._sort.active, this._sort.direction);
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
        this.topicQuestion = [];
        this.deletedtopicQuestion = [];
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
        
        this._QuestionService.getById(Id)
        .subscribe((item:any) =>
        {
            console.log(item)
            this.selectedItem = item;
            var itemForm:any = item;
            this.selectedItemForm.patchValue(itemForm);
            
            this._TopicService.getByQuestion(item.id).subscribe(res=>{
                console.log(res);
                this.topicQuestion = res;
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
        var newItemForm = {id:0,description:"",answer:false,explanation:""};
        var newItem = {id:0,description:"",answer:false,explanation:""};
        this.selectedItem = newItem;
        this.selectedItemForm.setValue(newItemForm);
        this.topicQuestion = [];
        this._changeDetectorRef.markForCheck();
        el.scrollIntoView();
    }
    create(): void
    {
        const newItem = this.selectedItemForm.getRawValue();
        // Create the products
        
    
        console.log(newItem)
        
        this._QuestionService.create(newItem).subscribe((newItem) =>
        {
            // Go to new products
            this.selectedItem = newItem;

            // Fill the form
            this.selectedItemForm.patchValue(newItem);

            // Mark for check

         
            //add topic to topicQuestion
            this.topicQuestion.forEach(item=>{
                this._QuestionService.AddToTopic(newItem.id, item.guid).subscribe(res=>{
                    console.log("Question added to Topic");
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
        
        this._QuestionService.update(item.id, item).subscribe({next: (event:any) =>{
            console.log('next');
            console.log(event);
            this.showFlashMessage('success');
            this.newItem = false;

            console.log(this.deletedtopicQuestion);
            console.log(this.topicQuestion);
            this.deletedtopicQuestion.forEach(res=>{
                this._QuestionService.RemoveFromTopic(this.selectedItem.id,res.guid).subscribe(x=>{
                    console.log("cleared question");
                    
            });     
            });
            this.topicQuestion.forEach(res=>{
                this._QuestionService.AddToTopic(this.selectedItem.id,res.guid).subscribe(res=>{
                    console.log("added question");
                });
            });
            this.deletedtopicQuestion = [];
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
                this._QuestionService.delete(item.id).subscribe(() =>
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
          this.topicQuestion.push(topic);
        }
    
        // Clear the input value
        event.chipInput!.clear();
    
        this.topicCtrl.setValue(null);
      }
    
      removeTopic(topic): void {
        const index = this.topicQuestion.indexOf(topic);
    
        if (index >= 0) {
          this.topicQuestion.splice(index, 1);
          this.deletedtopicQuestion.push(topic)
        }
      }
    
      selectedTopic(event: MatAutocompleteSelectedEvent): void {
        var topic = this.topics.find(t=>t.guid===event.option.value);
        if(topic !== undefined){
            this.topicQuestion.push(topic);
            
        }
        
        this.topicInput.nativeElement.value = '';
        this.topicCtrl.setValue(null);
      }

}