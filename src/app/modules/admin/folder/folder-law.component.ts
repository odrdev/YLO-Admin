import {ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { LawService } from '../law/law.services';
import { FolderService } from './folder.services';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatAutocompleteSelectedEvent,MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { fuseAnimations } from '@fuse/animations';
import { MatChipInputEvent,MatChipsModule } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { iLaw } from '../law/law.type';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
    selector: 'folder-law',
    templateUrl: 'folder-law.component.html',
    standalone: true,
    styles         : [
      /* language=SCSS */
      `  
          .subs-grid {
              grid-template-columns: 48px auto  50px 50px;

              @screen sm {
                  grid-template-columns: 48px  auto  50px 50px ;
              }

              @screen md {
                  grid-template-columns: 48px  auto 96px 96px ; 
              }

              @screen lg {
                  grid-template-columns: 48px  auto  96px 96px   ;
              }
          }
        .mat-mdc-dialog-actions{
           justify-content:end !important;
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
    animations     : fuseAnimations,
    imports: [MatDialogModule,MatInputModule,MatChipsModule,MatCheckboxModule,MatSlideToggleModule,MatFormFieldModule, MatAutocompleteModule, CdkDropList, CdkDrag, MatButtonModule,CommonModule, MatProgressSpinnerModule,MatIconModule,],
  })

  export class FolderLaw {
    folderLaw:any;
    newItem:any;
    newLawItems:any = [];
    lawCtrl = new FormControl('');
    filteredLawList:any;
    flashMessage: 'success' | 'error' | null = null;
    @ViewChild('lawInput') lawInput: ElementRef<HTMLInputElement>;
    constructor(@Inject(MAT_DIALOG_DATA) public data: {guid:any,name:any, lawlist:any}, private _lawService:LawService, private _folderService:FolderService,
    private _fuseconfirmationservice : FuseConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef,
    ) { 
        this.loadContent();
                this.filteredLawList = this.lawCtrl.valueChanges.pipe(
                    startWith(null),
                    map((law: string | null) => (law ? this._filter(law) : this.data.lawlist.slice())),
                  );
    }
    private _filter(value: string): iLaw[] {
        const filterValue = value.toLowerCase();
    
        return this.data.lawlist.filter(law => law.title.toLowerCase().includes(filterValue));
      }
   loadContent(){
    this._folderService.getByFolder(this.data.guid).subscribe(res=>{
      console.log(res);
      this.folderLaw = res;
      this._changeDetectorRef.markForCheck();
  })
   }
   removeLaw(law): void {
    console.log(law)
    const index = this.newLawItems.indexOf(law);

    if (index >= 0) {
      this.newLawItems.splice(index, 1);
    }

  }
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
  deleteFolderLaw(index,fl){
      console.log(index);


      const confirmation = this._fuseconfirmationservice.open({
        title  : 'Delete Law from Folder',
        message: 'Are you sure you want to remove this item from this folder? This action cannot be undone!',
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
         

            // Delete the product on the server
            this._folderService.RemoveLaw( fl.folderGUID,fl.lawGUID).subscribe(x=>{
              console.log("removed law");
              this.folderLaw.splice(index, 1);
            });   

        }
    });

  }
  toggleShowFL(fl, value){
    this._folderService.HideLaw( fl.folderGUID,fl.lawGUID,!value).subscribe(x=>{
      console.log("hide law");
      fl.show = value;
    }); 
  }
   new(el:HTMLElement):void{  
    this.newItem = true; 

    this._changeDetectorRef.markForCheck();
    el.scrollIntoView();
}
     selectedLaw(event: MatAutocompleteSelectedEvent): void {
        var law = this.data.lawlist.find(t=>t.guid===event.option.value);
        
        if(law !== undefined){
            this.newLawItems.push(law);
            
        }
        console.log( this.folderLaw)
        this.lawInput.nativeElement.value = '';
        this.lawCtrl.setValue(null);
      }

    addLawToFolder(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
    
        var law = this.data.lawlist.find(t=>t.title===event.value);
        // Add our fruit
        if (value) {
          this.newLawItems.push(law);
        }
    
        // Clear the input value
        event.chipInput!.clear();
    
        this.lawCtrl.setValue(null);
      }
      create(): void
      {


  
              this.newLawItems.forEach(item=>{
                  this._folderService.AddLaw(this.data.guid, item.guid).subscribe(res=>{
                      console.log("Law added to Folder");
                  });
              })  
  
                            // Mark for check
              this._changeDetectorRef.markForCheck();
              this.showFlashMessage('success');
            this.newItem = false;
            this.newLawItems = [];

      }
          drop(event: CdkDragDrop<any>) {
              var dropItem = this.folderLaw[event.previousIndex];
              var displacedItem = this.folderLaw[event.currentIndex]
              
              console.log("Drag drop")
      
              console.log(event)
              console.log(displacedItem)
              //update order in API
              var newOrderNumber = event.currentIndex;
              this._folderService.reorderFolderLaw(dropItem.fl.id,dropItem.fl.folderGUID, newOrderNumber).subscribe(res=>{
                  console.log('moved Items')
                                 
              })
              moveItemInArray(this.folderLaw, event.previousIndex, event.currentIndex);
            }

            closeDetails(): void
            {
                this.newItem = false;
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
  }