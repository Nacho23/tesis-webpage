import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { UserDetailsService } from '../../services/userDetails/user-details.service';
import { QuestionService } from '../../services/question/question.service';
import * as Chart from 'chart.js';
import { user } from '../../../environments/environment';

declare var $: any;

@Component({
    templateUrl: 'details-user.component.html'
})
export class DetailsUserComponent implements OnInit {

    public userProfile: any;
    public profilePicture: any;
    public historyList: any;

    public categoryList: Array<any>;
    public categoryList_aux: Array<any>;
    public questionList: Array<any>;
    public answerList: Array<any>;

    public godfathersList: Array<any> = [];
    public godfather: string = '0';

    public question: string;
    public questionName: string;
    public category: string;

    public showAnswer: boolean = true;
    public showChart: boolean = true;

    public countAnswer: number = 0;
    public countHistories: number = 0;

    public dateFrom: string;
    public dateTo: string;

    public viewDetail: boolean = false;

    // ------------------ GRAFICOS --------------------
    // lineChart
    public chart: any;
    public chart2: any;

    // RadarChart
    public radarChartLabels: string[] = [];

    public radarChartOptions = {
        scale: {
            ticks: {
                beginAtZero: true
            }
        }
    }

    public radarChartData: any = [
        {
            data: [],
            label: 'Categorías'
        }
    ];
    public radarChartType = 'radar';


    constructor(private route: ActivatedRoute, private profileService: ProfileService,
        private userDetailsService: UserDetailsService, private questionService: QuestionService) {
        this.route.params.subscribe(params => {
            const _id = params['id'];
            this.profileService.getUserProfileByUid(_id).on('value', user => {
                this.userProfile = user.val();
                this.userProfile.uid = user.key;
                if (user.val().godfatherId != undefined) {
                    this.profileService.getUserProfileByUid(user.val().godfatherId).on('value', snap => {
                        this.userProfile.nameGodfather = snap.val().firstName + ' ' + snap.val().lastName;
                        this.godfather = this.userProfile.godfatherId;
                    })
                }
                this.getPhotoURL(this.userProfile.uid);
                this.getHistories(this.userProfile.uid);
                this.getCategory();
                this.getQuestions();
                this.viewGraphics();
            })
        })
    }

    ngOnInit(): void {
        this.getGodfathers();
    }

    getPhotoURL(uid) {
        this.profileService.getPhotoURL(uid)
            .then(snap => {
                this.profilePicture = snap;
            })
    }

    getGodfathers() {
        this.userDetailsService.getGodfathers(user.departmentUid.toString()).on('child_added', snap => {
            if (snap.val().type == 'padrino') {
                let godfatherObj = snap.val();
                godfatherObj.uid = snap.key;
                this.godfathersList.push(godfatherObj);
            }
        })
    }

    getHistories(uid) {
        this.userDetailsService.getHistories(uid).on('value', snap => {
            this.historyList = [];
            snap.forEach(snapHistory => {
                let historyObject = snapHistory.val();
                historyObject.id = snapHistory.key;
                this.historyList.push(historyObject);
                this.countHistories = this.historyList.length;
                return false;
            });
        });
    }


    getCategory() {
        this.category = "0";
        this.categoryList_aux = [];
        for (let i = 0; i < this.historyList.length; i++) {
            this.categoryList_aux.push(this.historyList[i].category)
        }
        this.categoryList = this.deleteRepeatElements(this.categoryList_aux);
    }

    getQuestions() {
        this.question = "0";
        this.questionService.getQuestions().on('value', snapChild => {
            this.questionList = [];
            snapChild.forEach(snap => {
                let questionObj = snap.val();
                questionObj.uid = snap.key;
                this.questionService.getQuestionByUid(snap.val().title).on('value', snap => {
                    if (snap.val() == null) {
                        questionObj.titleQuestion = "No existe encargado asignado";
                        this.questionList.push(questionObj);
                    } else {
                        questionObj.titleQuestion = snap.val().title;
                        this.questionList.push(questionObj);
                    }
                })
                return false;
            })
        })
    }

    changeCategory(category) {
        this.countHistories = 0;
        if (category != "0") {
            this.userDetailsService.getHistories(this.userProfile.uid).orderByChild('category').equalTo(category).on('value', snap => {
                this.historyList = [];
                snap.forEach(snapChild => {
                    let historyObj = snapChild.val();
                    historyObj.uid = snapChild.key;
                    this.historyList.push(historyObj);
                    this.countHistories = this.historyList.length;
                })
            })
        } else {
            this.userDetailsService.getHistories(this.userProfile.uid).on('value', snap => {
                this.historyList = [];
                snap.forEach(snapChild => {
                    let historyObj = snapChild.val();
                    historyObj.uid = snapChild.key;
                    this.historyList.push(historyObj);
                    this.countHistories = this.historyList.length;
                })
            })
        }
    }

    changeGodfather(uid) {
        this.userDetailsService.updateGodfther(this.userProfile.uid, uid);
    }

    changeFirstName(firstName) {
        this.userDetailsService.changeFirstName(this.userProfile.uid, firstName);
    }

    changeLastName(lastName) {
        this.userDetailsService.changeLastName(this.userProfile.uid, lastName);
    }

    changeBirthDate(birthDate) {
        this.userDetailsService.changeBirthDate(this.userProfile.uid, birthDate);
    }

    changePhone(phone) {
        this.userDetailsService.changePhone(this.userProfile.uid, phone);
    }

    changeRut(rut) {
        this.userDetailsService.changeRut(this.userProfile.uid, rut);
    }

    changeQuestion(uid) {
        this.countAnswer = 0;
        this.questionService.getAnswerByUserUid(this.userProfile.uid).then(snapChild => {
            this.answerList = [];
            for (let k in snapChild) {
                let answerObj = snapChild[k];
                answerObj.uid = k
                if (answerObj.questionUid == uid) {
                    this.questionService.getQuestionByUid(answerObj.questionUid).on('value', snapQuestion => {
                        if (snapQuestion.val().type == 'short' || snapQuestion.val().type == 'long') {
                            this.chart = [];
                            this.showAnswer = true;
                            this.answerList.push(answerObj);
                            this.countAnswer = this.answerList.length;
                            this.questionName = snapQuestion.val().title;
                        } else if (snapQuestion.val().type == 'list') {
                            this.showAnswer = false;
                            this.answerList.push(answerObj);
                            this.countAnswer = this.answerList.length;
                            this.questionName = snapQuestion.val().title;
                            let dataLabels = this.generateDataLabels(this.answerList);
                            let data = this.generateData(dataLabels, this.answerList);
                            let canvas = document.getElementById("AnswersChart");
                            let polarChartOptions = {
                                title: {
                                    display: true,
                                    text: this.questionName
                                },
                                events: ['click'],
                                scale: {
                                    ticks: {
                                        beginAtZero: true,
                                        max: Math.max(...data) + 1
                                    }
                                }
                            }
                            this.chart = new Chart(canvas, {
                                type: 'polarArea',
                                data: {
                                    datasets: [{
                                        data: data,
                                        backgroundColor: ["rgba(62, 149, 205, 0.5)", "rgba(142, 94, 162, 0.5)", "rgba(60, 186, 159, 0.5)", "rgba(232, 195, 185, 0.5)", "rgba(196, 88, 80, 0.5)"],
                                        label: snapQuestion.val().title
                                    }],
                                    labels: dataLabels
                                },
                                options: polarChartOptions
                            })
                            let dateAnswer = this.createDateAnswerList(this.answerList);
                            let axisY = this.generateAxisY(this.answerList);
                            let answer = this.generateAnswer(axisY, this.answerList);
                            let canvas2 = document.getElementById("AnswersChart2");
                            this.chart2 = new Chart(canvas2, {
                                type: 'line',
                                data: {
                                    datasets: [{
                                        data: answer,
                                        label: snapQuestion.val().title
                                    }],
                                    labels: dateAnswer
                                },
                                options: {
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                                callback: function (value, index, values) {
                                                    return axisY[value]
                                                }
                                            }
                                        }]
                                    }
                                }
                            })
                        }
                        else if (snapQuestion.val().type == 'multiple') {
                            this.showAnswer = false;
                            this.answerList.push(answerObj);
                            this.countAnswer = this.answerList.length;
                            this.questionName = snapQuestion.val().title;
                            let dataLabels = this.generateDataLabels(this.answerList);
                            let data = this.generateData(dataLabels, this.answerList);
                            let canvas = document.getElementById("AnswersChart");
                            let polarChartOptions = {
                                title: {
                                    display: true,
                                    text: this.questionName
                                },
                                events: ['click'],
                                scale: {
                                    ticks: {
                                        beginAtZero: true,
                                        max: Math.max(...data) + 1
                                    }
                                }
                            }
                            this.chart = new Chart(canvas, {
                                type: 'polarArea',
                                data: {
                                    datasets: [{
                                        data: data,
                                        backgroundColor: ["rgba(62, 149, 205, 0.5)", "rgba(142, 94, 162, 0.5)", "rgba(60, 186, 159, 0.5)", "rgba(232, 195, 185, 0.5)", "rgba(196, 88, 80, 0.5)"],
                                        label: snapQuestion.val().title
                                    }],
                                    labels: dataLabels
                                },
                                options: polarChartOptions
                            })
                            let dateAnswer = this.createDateAnswerList(this.answerList);
                            let axisY = this.generateAxisY(this.answerList);
                            let answer = this.generateAnswer(axisY, this.answerList);
                            let canvas2 = document.getElementById("AnswersChart2");
                            this.chart2 = new Chart(canvas2, {
                                type: 'line',
                                data: {
                                    datasets: [{
                                        data: answer,
                                        label: snapQuestion.val().title
                                    }],
                                    labels: dateAnswer
                                },
                                options: {
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true,
                                                callback: function (value, index, values) {
                                                    return axisY[value]
                                                }
                                            }
                                        }]
                                    }
                                }
                            })
                        }
                        else if (snapQuestion.val().type == 'scale') {
                            this.showAnswer = false;
                            this.answerList.push(answerObj);
                            this.countAnswer = this.answerList.length;
                            this.questionName = snapQuestion.val().title;
                            let dateAnswer = this.createDateAnswerList(this.answerList);
                            let answer = this.generateDataScale(this.answerList);
                            let canvas = document.getElementById("AnswersChart");
                            let lineChartOptions = {
                                responsive: true,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            max: snapQuestion.val().max,
                                            min: snapQuestion.val().min,
                                            stepSize: 1
                                        }
                                    }]
                                }
                            }
                            this.chart = new Chart(canvas, {
                                type: 'line',
                                data: {
                                    datasets: [{
                                        data: answer,
                                        label: snapQuestion.val().title,
                                        borderColor: "#CD5C5C",
                                        backgroundColor: 'rgba(255, 160, 122, 0.5)',
                                        pointBackgroundColor: '#FA8072',
                                        pointBorderColor: '#fff',
                                        pointHoverBackgroundColor: '#fff',
                                        pointHoverBorderColor: '#E9967A'
                                    }],
                                    labels: dateAnswer
                                },
                                options: lineChartOptions
                            })
                        }
                    })
                }
            }
        })
    }

    viewGraphics() {
        this.radarChartLabels = this.categoryList;
        let categoryCount = [];
        for (let i = 0; i < this.categoryList.length; i++) {
            categoryCount[i] = 0;
            for (let j = 0; j < this.categoryList_aux.length; j++) {
                if (this.categoryList_aux[j] == this.categoryList[i]) {
                    categoryCount[i] += 1;
                }
            }
        }
        this.radarChartData[0].data = categoryCount;
    }

    viewDetails(checked) {
        this.viewDetail = checked;
    }

    deleteRepeatElements(array) {
        let array_aux = [];
        for (let i = 0; i < array.length; i++) {
            if (i == 0) array_aux.push(array[i]);
            else {
                for (let j = i; j < array.length; j++) {
                    if (array_aux.includes(array[j])) {
                        console.log("lo incluye");
                    } else {
                        array_aux.push(array[j]);
                    }
                }
            }
        }
        return array_aux;
    }

    createDateAnswerList(answerList) {
        let dateAnswer = [];
        for (let i = 0; i < answerList.length; i++) {
            dateAnswer.push(answerList[i].date);
        }
        return dateAnswer;
    }

    generateAxisY(answerList) {
        let axisObj = {};
        let array_aux = []
        for (let i = 0; i < answerList.length; i++) {
            array_aux.push(answerList[i].answer);
        }
        let array = this.deleteRepeatElements(array_aux);
        for (let j = 0; j < array.length; j++) {
            axisObj[j] = array[j];
        }
        return axisObj;
    }

    generateDataScale(answerList) {
        let array_aux = [];
        for (let i = 0; i < answerList.length; i++) {
            array_aux[i] = answerList[i].answer;
        }
        return array_aux;
    }

    generateDataLabels(array) {
        let array_result = []
        for (let i = 0; i < array.length; i++) {
            array_result[i] = array[i].answer;
        }
        let array_aux = this.deleteRepeatElements(array_result)
        return array_aux;
    }

    generateData(dataLabels, array) {
        let array_aux = [];
        for (let i = 0; i < dataLabels.length; i++) {
            array_aux[i] = 0;
            for (let j = 0; j < array.length; j++) {
                if (dataLabels[i] == array[j].answer) {
                    array_aux[i] += 1;
                }
            }
        }
        return array_aux;
    }

    generateAnswer(obj, array) {
        let array_aux = [];
        for (let i = 0; i < array.length; i++) {
            for (let k in obj) {
                if (array[i].answer == obj[k])
                    array_aux[i] = k;
            }
        }
        return array_aux;
    }
}
