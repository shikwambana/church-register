/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { apiService } from '../../services/api/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'bh-attendance_dashboard',
    templateUrl: './attendance_dashboard.template.html'
})

export class attendance_dashboardComponent extends NBaseComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource;
    newPeople: number = 0;
    demographic = {
        male: 0,
        female: 0
    }

    constructor(private api: apiService) {
        super();
    }

    ngOnInit() {
        this.fetchAllPeople()
    }

    fetchAllPeople() {

        return this.api.getEveryone().then(res => {
            console.log(res)
            this.dataSource = res
            this.dataSource.paginator = this.paginator;

            let newPeople = this.dataSource.filter(elem => {
                return elem['firstTime'] == 'Yes'
            })

            this.newPeople = newPeople.length

            newPeople = this.dataSource.filter(elem => {
                return elem['gender'] == 'Female'
            })

            this.demographic['female'] = newPeople.length

            newPeople = this.dataSource.filter(elem => {
                return elem['gender'] == 'Male'
            })

            this.demographic['male'] = newPeople.length


        })

        let todaysDate = new Date();
        let type = 'date'
        console.log(todaysDate, type)
        this.api.searchUser(type, todaysDate).then(res => {
            console.log(res)
        })
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
                if (obj['contactNumber'][0] !== '0') {
                    obj['contactNumber'] = '0' + obj['contactNumber']
                }

                // console.log(obj)
                // result.push(obj);

                this.api.addPerson(obj).then(res => {
                    console.log(num++)
                })
            }

        }

        return this.getUniqueListBy(result); //JSON
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    getUniqueListBy(arr: Array<object>) {
        return arr.filter((v, i, a) => a.findIndex(t => (t['Phone Number'] === v['Phone Number'])) === i)
    }
}
