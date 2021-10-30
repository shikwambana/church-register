/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { generic_dialogueComponent } from 'app/components/generic_dialogueComponent/generic_dialogue.component'
import { apiService } from '../../services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'bh-markregister',
    templateUrl: './markregister.template.html'
})

export class markregisterComponent extends NBaseComponent implements OnInit {
    selectATribe = ["Arch & Busi", "Zinhle and Thoko", "Pearson and Blessing", "Fumani and Mogau", "Sfiso", "Michael and Lineo", "Thlalefo and Masego", "Jan and Abrie", "Marius and Lourindi", "Khutso and Lydia", "Jaco and Sylvi", "Justus and Mandy", "Lebo and Ntombi", "Bert and Charné", "Don't Know", "Other Church",]
    selectSymptoms = ["Fever/Chills", "Cough", "Shortness of breath", "Fatigue", "Muscle or body aches", "Headache", "Loss of taste/Smell", "Sore throat", "Nausea/Vomiting", "Diarrhea", "Congestion/Running", "None of the above"]
    selectSymptomsBackup = ["Fever/Chills", "Cough", "Shortness of breath", "Fatigue", "Muscle or body aches", "Headache", "Loss of taste/Smell", "Sore throat", "Nausea/Vomiting", "Diarrhea", "Congestion/Running", "None of the above"]
    NoSymptoms = ["None of the above"]
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
    constructor(private router: Router, private dialog: MatDialog, private formBuilder: FormBuilder, private api: apiService) {
        super();
    }

    ngOnInit() {
        this.getServices()
        this.buildForm()
    }

    buildForm() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            contactNumber: ['', Validators.required],
            email: ['', [Validators.email]],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            firstTimeVisitor: [true, Validators.required],
            whoInvitedYou: ['', Validators.required],
            tribe: ['', Validators.required],
            serviceDetails: ['', Validators.required],
            serviceTime: ['', Validators.required],
            serviceLocation: ['', Validators.required],
            symptoms: [[]],
            temperature: ['', Validators.required],
            date: [new Date(), Validators.required],
            captureDate: ['']
        })
    }


    findMe() {
        let queryType = ''
        const phoneRegex = /[0-9]$/
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (emailRegex.test(this.emailNumber)) {
            queryType = 'email'
        } else {
            queryType = 'contactNumber'
        }

        this.api.searchUser(queryType, this.emailNumber).then(res => {

            if (!res) {
                this.buildForm()
                this.displayRegisterForm = true
                this.alreadyRegistered = false
                if (queryType == 'email') {
                    this.registerForm.patchValue({
                        email: this.emailNumber
                    })
                } else {
                    this.registerForm.patchValue({
                        contactNumber: this.emailNumber
                    })
                }
                this.newUser = true;

            } else {

                this.data = res
                if (res['registered']) {
                    this.data['date'] = this.data['date'].toDate().toLocaleTimeString('en-US')
                    this.alreadyRegistered = true
                    this.displayRegisterForm = false
                    this.emailNumber = ''

                } else {

                    this.newUser = false;
                    this.displayRegisterForm = true
                    this.alreadyRegistered = false
                    this.registerForm.patchValue({
                        firstName: res['firstName'],
                        lastName: res['lastName'],
                        contactNumber: res["contactNumber"],
                        email: res["email"],
                        gender: res['gender'],
                        address: res["address"],
                        firstTimeVisitor: false,
                        whoInvitedYou: res["whoInvitedYou"],
                        tribe: res["tribe"],
                        date: new Date()
                    })
                }

            }
        })
    }

    getServices() {

        this.api.getServices().then(res => {
            this.services = res
            let service = sessionStorage.getItem('serviceID')
            if (service) {
                this.registerForm.get('serviceDetails').setValue(service)

                this.selectedService = this.services.find(element => {
                    return element['uid'] == service
                })
                this.assignService()

            }
        })
    }

    assignService() {
        this.registerForm.get('serviceDetails').setValue(this.selectedService.uid)
        this.registerForm.get('serviceLocation').setValue(this.selectedService.location)
        this.registerForm.get('serviceTime').setValue(this.selectedService.time)
        sessionStorage.setItem('serviceID', this.selectedService.uid)
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
            this.reloadPage()
            return res
        })
    }

    get f() { return this.registerForm.value; }

    onSubmit(formDirective: FormGroupDirective) {
        this.submitted = true;
        let today = new Date().toDateString();
        this.registerForm.get('captureDate').setValue(today)
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            this.api.openSnackBar('Please complete all fields');
            return;
        }

        this.api.addPerson(this.f).then(res => {

            let data = {
                message: 'Your details have being saved. You can proceed',
                icon: 'check_circle',
                returnData: true
            }
            this.displayRegisterForm = false
            this.showMessage(data)
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


    addSymptom(event) {

        let array = this.symptoms
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

        if (value == "None of the above" && this.registerForm.controls['symptoms'].value.length == 0) {
            this.selectSymptoms = this.selectSymptomsBackup
        } else if (value == "None of the above" && this.registerForm.controls['symptoms'].value.length == 1) {
            this.selectSymptoms = this.NoSymptoms
        }
    }

    reloadPage() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }
}
