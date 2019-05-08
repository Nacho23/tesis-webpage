import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor() { }

  addQuestion(type:string) {
    firebase.database().ref('/questions/').push({type: type});
  }

  getQuestions() {
    return firebase.database().ref('questions');
  }

  getQuestionByUid(uid: string) {
    return firebase.database().ref('/questions/' + uid); 
  }

  getOptions(uid: string) {
    return firebase.database().ref('questions/'+uid+'/options/');
  }

  changeTitle(uid: string, title: string) {
    return firebase.database().ref('/questions/' + uid + '/').update({'title': title});
  }

  addOption(uid: string, options: Array<any>) {
    return firebase.database().ref('/questions/' + uid + '/options/').update(options);
  }

  addDate(uid: string, date: string) {
    return firebase.database().ref('/questions/' + uid + '/dates/').push({'date':date})
  }

  deleteQuestion(uid: string) {
    return firebase.database().ref('/questions/' + uid + '/').remove();
  }

  /*deleteOption(optionUid: string, questionUid: string) {
    return firebase.database().ref('/questions/' + questionUid + '/options/' + optionUid).remove()
    .then(res => {
      console.log("Borrado Exitosamente");
    })
    .catch(err => {
      console.log("Error: " + err.message);
    });
  } */

  deleteOptions(questionUid: string, lengthArrayOptions: number){
    return firebase.database().ref('/questions/' + questionUid +'/options/' + lengthArrayOptions).remove();
  }

  updateOptions(questionUid: string, position: string, options: string){
    console.log(options);
    return firebase.database().ref('/questions/' + questionUid + '/options/' + position).update(options);
  }

  deleteDate(questionUid: string, dateUid: string) {
    return firebase.database().ref('/questions/' + questionUid + '/dates/' + dateUid).remove()
    .then(res => {
      console.log("Borrado Exitosamente");
    })
    .catch(err => {
      console.log("Error: " + err.message);
    });
  }

  changeDescriptionOption(optionUid: string, questionUid: string, questionOptionDescription: string) {
    return firebase.database().ref('/questions/' + questionUid + '/options/' + optionUid + '/').update({'desc': questionOptionDescription});
  }

  changeMin(questionUid: string, min: number) {
    return firebase.database().ref('/questions/' + questionUid).update({'min': min});
  }

  changeMax(questionUid: string, max: number) {
    return firebase.database().ref('/questions/' + questionUid).update({'max': max});
  }

  changeLabelMin(questionUid: string, labelMin: string) {
    return firebase.database().ref('/questions/' + questionUid).update({'labelMin': labelMin});
  }

  changeLabelMax(questionUid: string, labelMax: string) {
    return firebase.database().ref('/questions/' + questionUid).update({'labelMax': labelMax});
  }

  changeDate(questionUid: string, dateUid: string, date: string) {
    //console.log(questionUid + '-' + dateUid + '-' + date);
    return firebase.database().ref('/questions/' + questionUid + '/dates/' + dateUid + '/').update({'date': date});
  }


  // ANSWER
  getAnswer() {
    return firebase.database().ref('/answer/');
  }

  getAnswerByUserUid(uid) {
    return new Promise(resolve => {
      firebase.database().ref('/answer/').orderByChild('userUid').equalTo(uid).on('value', snap => {
        resolve(snap.val());
      })
    })
  }
}
