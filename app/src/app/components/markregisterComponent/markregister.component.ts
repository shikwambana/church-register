/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { apiService } from '../../services/api/api.service';

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
    selectATribe = ["Zinhle and Thoko", "Pearson and Blessing", "Fumani and Mogau", "Arch and Busi", "Sfiso", "Michael and Lineo", "Thlalefo and Masego", "Jan and Abrie", "Marius and Lourindi", "Khutso and Lydia", "Jaco and Sylvi", "Justus and Mandy", "Lebo and Ntombi", "Bert and Charné", "Don't Know", "Other Church",]
    selectSymptoms = ["Fever/Chills", "Cough", "Shortness of breath", "Fatigue", "Muscle or body aches", "Headache", "Loss of taste/Smell", "Sore throat", "Nausea/Vomiting", "Diarrhea", "Congestion/Running","None of the above"]
    selectSymptomsBackup = ["Fever/Chills", "Cough", "Shortness of breath", "Fatigue", "Muscle or body aches", "Headache", "Loss of taste/Smell", "Sore throat", "Nausea/Vomiting", "Diarrhea", "Congestion/Running","None of the above"]
    NoSymptoms = ["None of the above"]
    registerForm: FormGroup;
    submitted = false;
    searchForNumber: boolean = true;
    displayRegisterForm: boolean = false;
    emailNumber: string = '';
    enterData : boolean = false;
    message : string = ''
    symptoms = []
    constructor(private formBuilder: FormBuilder, private api: apiService) {
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
            symptoms: [[]],
            temperature: ['', Validators.required],
            date: [new Date(), Validators.required]
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
            console.log(res)
            if (!res) {
                if (queryType == 'email') {
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
                this.displayRegisterForm = true
            }
        })
    }

    removeData(){
        this.emailNumber = ''
        this.registerForm.reset()
        this.displayRegisterForm = false
    }

    get f() { return this.registerForm.value; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
           this.api.openSnackBar('Please complete all fields');
            return;
        }

        // display form values on success
        // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        this.api.addPerson(this.f).then(res =>{
           this.api.openSnackBar('Your Details have being saved');
           this.onReset();
        }, err =>{
            console.log(err)
        })
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset()
    }


    addSymptom(event) {
        return
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

        if(value == "None of the above" && this.registerForm.controls['symptoms'].value.length == 0){
            this.selectSymptoms = this.selectSymptomsBackup
        }else if(value == "None of the above" && this.registerForm.controls['symptoms'].value.length == 1){
            this.selectSymptoms = this.NoSymptoms
        }
    }

}
