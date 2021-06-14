/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { apiService } from '../../services/api/api.service';
import { ViewportScroller } from "@angular/common";
/*
Client Service import Example:
import { servicename } from 'app/sd-services/servicename';
*/

/*
Legacy Service import Example :
import { HeroService } from '../../services/hero/hero.service';
*/

@Component({
    selector: 'bh-markregister',
    templateUrl: './markregister.template.html'
})

export class markregisterComponent extends NBaseComponent implements OnInit {
    selectATribe = ["Zinhle & Thoko", "Pearson & Blessing", "Fumani & Mogau", "Arch & Busi", "Sfiso", "Michael & Lineo", "Thlalefo & Masego", "Jan & Abrie", "Marius & Lourindi", "Khutso & Lydia", "Jaco & Sylvi", "Justus & Mandy", "Lebo & Ntombi", "Ps Bert & Ps Charné", "Don't Know", "Other Church",]
    selectSymptoms = ["Fever/Chills", "Cough", "Shortness of breath", "Fatigue", "Muscle or body aches", "Headache", "Loss of taste/Smell", "Sore throat", "Nausea/Vomiting", "Diarrhea", "Congestion/Running", "None of the above",]
    registerForm: FormGroup;
    submitted = false;
    searchForNumber: boolean = true;
    displayRegisterForm: boolean = false;
    emailNumber: string = '';
    enterData: boolean = false;
    message: string = ''
    constructor(private formBuilder: FormBuilder, private api: apiService, private scroller: ViewportScroller) {
        super();
    }

    ngOnInit() {

        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            contactNumber: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            firstTimeVisitor: [true, Validators.required],
            whoInvitedYou: ['', Validators.required],
            tribe: ['', Validators.required],
            symptoms: [[], Validators.required],
            temperature: ['', Validators.required],
            date: [new Date(), Validators.required]
        })
    }


    findMe() {
        let queryType = ''
        const phoneRegex = /[0-9]$/
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (emailRegex.test(this.emailNumber)) {
            queryType = 'Email Address'
        } else {
            queryType = 'Phone Number'
        }

        this.displayRegisterForm = true

        this.api.searchUser(queryType, this.emailNumber).then(res => {
            console.log(res)
            this.registerForm.reset()

            if (!res) {
                this.scroller.scrollToAnchor("theForm");
                if (queryType == 'Email Address') {
                    this.registerForm.patchValue({
                        email: this.emailNumber
                    })
                } else {
                    this.registerForm.patchValue({
                        contactNumber: this.emailNumber
                    })
                }
                this.enterData = true;
                this.displayRegisterForm = true
            } else {
                this.registerForm.patchValue({
                    firstName: res['Name'],
                    lastName: res['Surname'],
                    contactNumber: res["Phone Number"],
                    email: res["Email Address"],
                    gender: res['Gender'],
                    address: res["Where do you live? Building Name or Area"],
                    firstTimeVisitor: false,
                    whoInvitedYou: res["Invited by? (Name and Surname)"],
                    tribe: res["What Tribe are you in?"],
                    date: new Date()
                })
            }
        })
    }

    removeData() {
        this.emailNumber = ''
        this.registerForm.reset()
    }

    get f() { return this.registerForm.value; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        // display form values on success
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        this.api.addPerson(this.f).then(res => {
            this.api.openSnackBar('Your Details have being saved');
            this.onReset();
        }, err => {
            console.log(err)
        })
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }


    addSymptom(event) {

        let array = this.registerForm.controls['symptoms'].value
        let value = event['source']['value']
        let present = array.findIndex(symptom => {
            return symptom == value
        })

        if (present !== -1) {
            array.splice(present, 1)
        } else {
            array.push(value)
        }

        this.registerForm.patchValue({
            symptoms: array
        })
    }

}
