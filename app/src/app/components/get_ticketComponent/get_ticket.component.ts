/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { generic_dialogueComponent } from 'app/components/generic_dialogueComponent/generic_dialogue.component'
import { apiService } from '../../services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'bh-get_ticket',
    templateUrl: './get_ticket.template.html'
})

export class get_ticketComponent extends NBaseComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
    searchForNumber: boolean = true;
    displayRegisterForm: boolean = false;
    emailNumber: string = '';
    message: string = ''
    symptoms = []
    services = []
    selectedService;
    showNumberHint: boolean = false;
    alreadyRegistered: boolean = false;
    newUser: boolean = true;
    data: unknown;
    enterData = true
    constructor(private router: Router, private dialog: MatDialog, private formBuilder: FormBuilder, public api: apiService) {
        super();
    }

    ngOnInit() {
        this.buildForm()
    }

    buildForm() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            contactNumber: ['', Validators.required],
            id: [this.makeid(5), Validators.required],
            email: ['', [Validators.required]],
            gender: ['', Validators.required],
            time: ['', Validators.required],
            address: ['', Validators.required],
            firstTimeVisitor: [true, Validators.required],
            whoInvitedYou: ['', Validators.required],
            date: [new Date(), Validators.required],
            captureDate: ['']
        })

    }

    removeData(formDirective?) {
        this.data = null;
        this.emailNumber = ''
        this.registerForm.reset()
        if (formDirective) {
            formDirective.resetForm();
        }
        this.displayRegisterForm = false
    }

    showMessage(data) {

        const dialogRef = this.dialog.open(generic_dialogueComponent, {
            data: data
        });

        return dialogRef.afterClosed().subscribe(res => {
            this.router.navigate(['ticket/'+data.id])
            return res
        })
    }

    get f() { return this.registerForm.value; }

    onSubmit(formDirective: FormGroupDirective) {
        console.log('befoe assigning service', this.selectedService)
        console.log(this.registerForm.value)

        this.submitted = true;
        let today = new Date().toDateString();
        this.registerForm.get('captureDate').setValue(today)
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            this.api.openSnackBar('Please complete all fields');
            return;
        }

        this.api.addPerson(this.f).then(res => {
            sessionStorage.setItem('info',JSON.stringify(this.f))
            let data = {
                message: 'Your details have being saved. Click Ok To Download Your Ticket',
                icon: 'check_circle',
                id: this.registerForm.get('id').value,
                returnData: true
            }
            this.displayRegisterForm = false
            // this.showMessage(data)
            this.api.openSnackBar('Seat Reserved');
            this.router.navigate(['ticket/'+data.id])

            this.onReset(formDirective);

        }, err => {

            let data = {
                message: 'There was a server error, please try again',
                icon: 'error',
                error: err,
                returnData: true
            }
            this.showMessage(data)

        })
    }

    onReset(formDirective?) {
        this.emailNumber = ''
        this.submitted = false;
        if (formDirective) {
            formDirective.resetForm();
        }
        this.registerForm.reset()
    }

    validateNumber(event) {
        const pattern = /^[0-9]*$/;

        if (this.emailNumber.length == 1) {
            this.alreadyRegistered = false
            this.data = null;
            this.displayRegisterForm = false
        }
        if (!pattern.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^0-9+]/g, "");
            this.showNumberHint = true
        } else {
            this.showNumberHint = false
        }
    }

    reloadPage() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
