/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';

/*
Client Service import Example:
import { servicename } from 'app/sd-services/servicename';
*/

/*
Legacy Service import Example :
import { HeroService } from '../../services/hero/hero.service';
*/

@Component({
    selector: 'bh-print_ticket',
    templateUrl: './print_ticket.template.html'
})

export class print_ticketComponent extends NBaseComponent implements OnInit {

    details
    constructor() {
        super();
    }

    ngOnInit() {
        this.details = JSON.parse(sessionStorage.getItem('info'))
        console.log(this.details)
    }
}
