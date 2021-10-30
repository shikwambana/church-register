/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { NBaseComponent } from '../../../../../app/baseClasses/nBase.component';
import { apiService } from '../../services/api/api.service';
import { createfilesService } from '../../services/createfiles/createfiles.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
    selector: 'bh-attendance_dashboard',
    templateUrl: './attendance_dashboard.template.html'
})

export class attendance_dashboardComponent extends NBaseComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource;
    pastors = ["Arch & Busi", "Zinhle and Thoko", "Pearson and Blessing", "Fumani and Mogau", "Sfiso", "Michael and Lineo", "Thlalefo and Masego", "Jan and Abrie", "Marius and Lourindi", "Khutso and Lydia", "Jaco and Sylvi", "Justus and Mandy", "Lebo and Ntombi", "Bert and Charné", "Don't Know", "Other Church",]
    pastorsAttendance = []
    options = [
        {
            name: 'Service Stats',
            icon: 'assessment'
        },
        {
            name: 'Attendance Register',
            icon: 'people'
        }]
    view = 'Service Stats'
    newPeople: number = 0;
    demographic = {
        male: 0,
        female: 0
    }
    services: any[];
    activeService = {
        location: '',
        time: '',
        pastors: ''
    }
    selectedService: any;
    listOfDates;
    dateOfService: Date = new Date();
    serviceDate;
    timeOfService;
    location;

    doughnutChartLabels: Label[] = ['Female', 'Male'];
    doughnutChartData: MultiDataSet = [
        []
    ];
    doughnutChartType: ChartType = 'doughnut';
    chartOptions: ChartOptions = {
        tooltips: {
            enabled: true
        },
        plugins: {
            datalabels: {
                // formatter: (value, ctx) => {

                //     let sum = 0;
                //     let dataArr = ctx.chart.data.datasets[0].data;
                //     dataArr.map(data => {
                //         sum += data;
                //     });
                //     let percentage = (value * 100 / sum).toFixed(2) + "%";
                //     return percentage;


                // },
                anchor: 'center',
                backgroundColor: null,
                borderWidth: 0,
                color: '#FFCE56',
            }
        }
    };


    constructor(private api: apiService, private createfilesService: createfilesService) {
        super();
    }

    ngOnInit() {
        this.fetchAllServices()
    }

    resetVariables() {
        this.dataSource = [];
        this.newPeople = 0;
        this.pastorsAttendance = [];
        this.demographic = {
            male: 0,
            female: 0
        };
        this.activeService = {
            location: '',
            time: '',
            pastors: ''
        };
    }


    getServiceDetails() {

        if (this.dateOfService) {
            this.serviceDate = this.dateOfService.toDateString()
        }

        if (this.location && this.timeOfService && this.serviceDate) {
            let body = {
                captureDate: this.serviceDate,
                serviceTime: this.timeOfService,
                serviceLocation: this.location
            }
            this.api.getServiceAttendance(body).then(res => {

                this.resetVariables()

                this.dataSource = res;
                this.activeService = {
                    location: this.location,
                    pastors: '',
                    time: this.timeOfService,
                }

                this.dataSource.forEach(element => {
                    let answer = ''
                    if (element['firstTimeVisitor']) {
                        answer = 'Yes'
                    } else {
                        answer = 'No'
                    }

                    element['firstTime'] = answer
                });
                this.categoriseData()

            })
        } else {

        }
    }

    categoriseData() {

        let newPeople = this.dataSource.filter(elem => {
            return elem['firstTime'] == 'Yes'
        })

        this.newPeople = newPeople.length

        let demographic = newPeople.filter(elem => {
            return elem['gender'] == 'Female'
        })

        this.demographic['newFemale'] = demographic.length

        demographic = newPeople.filter(elem => {
            return elem['gender'] == 'Male'
        })

        this.demographic['newMale'] = demographic.length

        newPeople = this.dataSource.filter(elem => {
            return elem['gender'] == 'Female'
        })

        this.demographic['female'] = newPeople.length

        newPeople = this.dataSource.filter(elem => {
            return elem['gender'] == 'Male'
        })

        this.demographic['male'] = newPeople.length

        this.doughnutChartData = [
            [this.demographic['female'], this.demographic['male']]
        ]

        this.pastors.forEach(elem => {

            let register = this.dataSource.filter(person => {
                return person['tribe'] == elem
            })

            this.pastorsAttendance.push(register.length)
        })


    }

    changeView(name) {
        this.view = name
    }

    returnView() {
        return this.view
    }

    exportExcel() {

        this.createfilesService.
            exportAsExcelFile(this.dataSource, `${this.activeService['location']} ${this.activeService['time']}`)
    }


    fetchAllServices() {
        this.api.getServices().then(res => {
            this.services = res
            let service = sessionStorage.getItem('serviceID')
            if (service) {

                this.selectedService = this.services.find(element => {
                    return element['uid'] == service
                })
                this.assignService()

            }
        })
    }

    assignService() {
        sessionStorage.setItem('serviceID', this.selectedService.uid)
    }

    fetchAllPeople() {

        return this.api.getEveryone().then(res => {
            console.log(res)
            this.dataSource = res
            this.dataSource.paginator = this.paginator;
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
