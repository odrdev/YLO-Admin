import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { LawService } from '../law/law.services';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
    selector: 'content-modal',
    templateUrl: 'contentModal.component.html',
    styleUrls: ['contentModal.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule,CommonModule, MatProgressSpinnerModule],
  })

  export class ContentModal {
    content:any;
    constructor(@Inject(MAT_DIALOG_DATA) public data: {id:any}, private _lawService:LawService,
    private _changeDetectorRef: ChangeDetectorRef,
    ) { 
        this.loadContent();
    }

   loadContent(){
        this._lawService.getContent(this.data.id).subscribe(res=>{
                this.content = res[0];
                console.log(res);
                this._changeDetectorRef.markForCheck();
        })
   }
  }