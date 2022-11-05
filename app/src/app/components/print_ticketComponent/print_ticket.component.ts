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
    googleCalendarLink = ''
    googleCalendar = {
        text: 'Khaya+Mthethwa+Concert',
        action: 'TEMPLATE',
        dates: '20221107T160000Z/20221107T171500Z',
        details: 'For+your+ticket,+click+here:+http://volt3c.web.app/ticket/',
        location: '209+Roper+Street,+Brooklyn,+Pretoria,+0181,+South+Africa'
    }
    constructor(private api: apiService) {
        super();
    }

    ngOnInit() {
        this.details = JSON.parse(sessionStorage.getItem('info'))
        console.log(this.details)

        Notification.requestPermission().then(function (getperm) {

            console.log('Perm granted', getperm)

        });

        const gcl = this.googleCalendar;
        this.googleCalendarLink = `https://www.google.com/calendar/render?action=${gcl['action']}&text=${gcl['text']}&${gcl['dates']}&${gcl['details']}${this.details['id']}&location=${gcl['location']}&sf=true&output=xml`
        this.setIcons()
    }

    setIcons() {
        this.socialMediaIcons = [
            {
                name: 'Share on WhatsApp',
                link: 'https://api.whatsapp.com/send?text=Hey,%20I%20am%20going%20to%20a%20Free%20Khaya%20Mthethwa%20Concert%20this%20Sunday%20and%20wanted%20you%20to%20come%20along.%20You%20can%20reserve%20a%20seat%20on%20this%20website:%20http://volt3c.web.app?inviteBy=' + this.details.firstName + '+' + this.details.lastName,
                icon: 'assets/Web/Icons/whatsapp.png'
            },
            // {
            //     name: 'Add to Google Calendar',
            //     link: this.googleCalendarLink,
            //     icon: 'assets/Web/Icons/Google-Calendar.png'
            // },
            {
                name: 'Share on Twitter',
                link: 'https://twitter.com/intent/tweet?source=tweetbutton&text=Hey,%20I%20am%20going%20to%20a%20Free%20Khaya%20Mthethwa%20Concert%20this%20Sunday%20and%20wanted%20you%20to%20come%20along.%20You%20can%20reserve%20a%20seat%20on%20this%20website:%20http://volt3c.web.app/&url=https://volt3c.web.app?inviteBy=' + this.details.firstName + '+' + this.details.lastName,
                icon: 'assets/Web/Icons/twitter.png'
            }
        ]
    }

    direct() {
        window.open('https://goo.gl/maps/87qBPhE72pqXjLMC8', "_blank");
    }

    printTicket() {
        this.downloading = true;
            this.api.openSnackBar('Downloading Ticket');
        let DATA: any = document.getElementById('ticket-info');
        console.log(DATA)
        html2canvas(DATA).then((canvas) => {
            let fileWidth = 208;
            let fileHeight = (canvas.height * fileWidth) / canvas.width;
            const FILEURI = canvas.toDataURL('image/png');
            let PDF = new jsPDF('p', 'mm', 'a4');
            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
            PDF.save(`${this.details.firstName}_Khaya-Mthethwa-Concert.pdf`);
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
