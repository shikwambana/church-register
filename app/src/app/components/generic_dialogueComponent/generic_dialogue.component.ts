/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit, Inject } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'bh-generic_dialogue',
    templateUrl: './generic_dialogue.template.html'
})

export class generic_dialogueComponent extends NBaseComponent implements OnInit {

    constructor(public thisDialogRef: MatDialogRef<generic_dialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
    }

    ngOnInit() {
        console.log(this.data)
    }

    close() {
        this.thisDialogRef.close(false);
    }
}
