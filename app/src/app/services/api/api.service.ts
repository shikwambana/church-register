/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class apiService {

    constructor(public snackbar: MatSnackBar, private http: HttpClient, private db: AngularFirestore){
        const things = db.collection('things').valueChanges();
      things.subscribe(console.log);
    }

    addPerson(document){
        let uuid = this.create_UUID();

        return this.db.collection('people').doc(uuid).set(document)
        .then(res =>{
            console.log(res)
            return true
        }, err =>{
            console.log(err)
            return false
        })
    }

    searchUser(type,document){
        
        return this.db.collection('people').ref.where(type,'==',document)
        .get().then( query =>{
            if (!query.empty) {
                const snapshot = query.docs[0];
                const data = snapshot.data();
                this.openSnackBar('We found your details')
                return data
              } else {
                this.openSnackBar('Please enter your details')
                // not found
              }
        })
        .catch( error =>{
            console.log("Error getting documents: ", error);
        })
       
    }

    openSnackBar(message){
        this.snackbar.open(message,'close',{
            duration: 2000
        })
    }

    create_UUID(){
    var dt = new Date().getTime();
    return 'xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
}
}
