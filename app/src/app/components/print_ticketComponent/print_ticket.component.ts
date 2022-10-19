/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { apiService } from '../../services/api/api.service';

@Component({
    selector: 'bh-print_ticket',
    templateUrl: './print_ticket.template.html'
})

export class print_ticketComponent extends NBaseComponent implements OnInit {

    details
    downloading = false;
    socialMediaIcons = []
    constructor(private api: apiService) {
        super();
    }

    ngOnInit() {
        this.details = JSON.parse(sessionStorage.getItem('info'))
        console.log(this.details)
        this.setIcons()
        // if(window.innerWidth > 600){
        //     this.socialMediaIcons[0]['link'] = 'https://web.whatsapp.com/send?Hey,%20I%20am%20going%20to%20a%20Free%20Dr%20Tumi%20Concert%20this%20Sunday%20and%20wanted%20you%20to%20come%20along.%20You%20can%20reserve%20a%20seat%20on%20this%20website:%20http://volt3c.web.app/'
        // }

        Notification.requestPermission().then(function (getperm) {

            console.log('Perm granted', getperm)

        });
    }

    setIcons() {
        this.socialMediaIcons = [
            {
                name: 'WhatsApp',
                link: 'whatsapp://send?Hey,%20I%20am%20going%20to%20a%20Free%20Dr%20Tumi%20Concert%20this%20Sunday%20and%20wanted%20you%20to%20come%20along.%20You%20can%20reserve%20a%20seat%20on%20this%20website:%20http://volt3c.web.app?inviteBy=' + this.details.firstName + '%20' + this.details.lastName,
                icon: 'assets/Web/Icons/whatsapp.png'
            },
            {
                name: 'Twitter',
                link: 'https://twitter.com/intent/tweet?source=tweetbutton&text=Hey,%20I%20am%20going%20to%20a%20Free%20Dr%20Tumi%20Concert%20this%20Sunday%20and%20wanted%20you%20to%20come%20along.%20You%20can%20reserve%20a%20seat%20on%20this%20website:%20http://volt3c.web.app/&url=https://volt3c.web.app?inviteBy=' + this.details.firstName + '-' + this.details.lastName,
                icon: 'assets/Web/Icons/twitter.png'
            },
            // {
            //     name: 'Facebook',
            //     link: '',
            //     icon: 'assets/Web/Icons/facebook.png'
            // }
        ]
    }

    printTicket() {
        this.downloading = true;
        let DATA: any = document.getElementById('ticket-info');
        console.log(DATA)
        html2canvas(DATA).then((canvas) => {
            let fileWidth = 208;
            let fileHeight = (canvas.height * fileWidth) / canvas.width;
            const FILEURI = canvas.toDataURL('image/png');
            let PDF = new jsPDF('p', 'mm', 'a4');
            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
            PDF.save(`${this.details.firstName}_Dr-Tumi-Concert.pdf`);
            this.api.openSnackBar('Ticket Downloaded');
            this.downloading = false
        });
    }

    share(item) {

        let data = this.details
        let body = {
            name: `${data.firstName} ${data.lastName}`,
            shareType: item.name,
            id: data.id,
            date: new Date(),
            invitedBy: data.whoInvitedYou
        }

        console.log(body)
        this.api.logShare(body).then(res => {
            console.log(res)
        })
    }
}
