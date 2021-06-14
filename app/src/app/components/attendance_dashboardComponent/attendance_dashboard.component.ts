/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
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
    selector: 'bh-attendance_dashboard',
    templateUrl: './attendance_dashboard.template.html'
})

export class attendance_dashboardComponent extends NBaseComponent implements OnInit {


    constructor(private api: apiService) {
        super();
    }

    ngOnInit() {

    }

    handleFileInput(files: FileList) {

        console.log(files);
        if (files && files.length > 0) {
            let file: File = files.item(0);
            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                let csv: string = reader.result as string;
                console.log(this.csvToJSON(csv));
            }
        }
    }

    csvToJSON(csv) {

        let num = 1;
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");

        headers[headers.length - 1] = headers[headers.length - 1].replace(/[\n\r]+/g, '')

        for (var i = 1; i < lines.length; i++) {

            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                if (currentline[j]) {
                    obj[headers[j]] = currentline[j].trim();
                }
            }

            if (!this.isEmpty(obj)) {
                if(obj['Phone Number'][0] !== '0'){
                    obj['Phone Number'] = '0' + obj['Phone Number'] 
                }

                // console.log(obj)
                // result.push(obj);
                
                this.api.addPerson(obj).then(res =>{
                    console.log(num++)
                })
            }

        }

        return this.getUniqueListBy(result); //JSON
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    getUniqueListBy(arr : Array<object>) {
        return arr.filter((v,i,a)=>a.findIndex(t=>(t['Phone Number'] === v['Phone Number']))===i)
    }
}
