import { Component } from '@angular/core';
import { QuestionService } from '../../services/question/question.service';


@Component({
  templateUrl: 'question.component.html'
})
export class QuestionComponent {

  public shortList = [];
  public longList = [];
  public boxList = [];
  public multipleList = [];
  public listList = [];
  public scaleList = [];

  public listOptions = [];
  public listDates = [];

  public scaleQuestionsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  public min = 1;
  public max = 1;

  public optionSelected: any;

  public positionOption: string;

  constructor(private questionService: QuestionService) {
    this.initComponents();

  }

  initComponents() {
    this.createList("short", this.shortList);
    this.createList("long", this.longList);
    this.createList("box", this.boxList);
    this.createList("multiple", this.multipleList);
    this.createList("list", this.listList);
    this.createList("scale", this.scaleList);
  }

  addOption(uid, optionDescription) {
    if(optionDescription != undefined){
      let isRepeat = false;
      this.questionService.getQuestionByUid(uid).orderByChild('type').on('value', snap => {
        if (snap.val().type == 'multiple') {
          let i = 0;
          while (i < this.multipleList.length) {
            if (this.multipleList[i].uid == uid) {
              if (this.multipleList[i].options == undefined) {
                this.multipleList[i].options = [optionDescription];
              } else {
                let j = 0;
                while (j < this.multipleList[i].options.length) {
                  if (optionDescription == this.multipleList[i].options[j]) {
                    console.log("No puede tener dos opciones iguales");
                    isRepeat = true;
                    j = this.multipleList[i].options.length + 1;
                  }
                  j++;
                }
                if (!isRepeat) {
                  this.multipleList[i].options.push(optionDescription);
                }
              }
              this.listOptions = this.multipleList[i].options;
              i = this.multipleList.length + 1;
            }
            i++;
          }
        } else if (snap.val().type == 'box') {
          for (let i = 0; i < this.boxList.length; i++) {
            if (this.boxList[i].uid == uid) {
              if (this.boxList[i].options == undefined) {
                this.boxList[i].options = [optionDescription];
              } else {
                for (let j = 0; j < this.boxList[i].options.length; j++) {
                  if (optionDescription == this.boxList[i].options[j]) {
                    console.log("No puede tener dos opciones iguales");
                    isRepeat = true;
                  }
                }
                if (!isRepeat) {
                  this.boxList[i].options.push(optionDescription);
                }
              }
              this.listOptions = this.boxList[i].options;
            }
          }
        } else if (snap.val().type == 'list') {
          for (let i = 0; i < this.listList.length; i++) {
            if (this.listList[i].uid == uid) {
              if (this.listList[i].options == undefined) {
                this.listList[i].options = [optionDescription];
              } else {
                for (let j = 0; j < this.listList[i].options.length; j++) {
                  if (optionDescription == this.listList[i].options[j]) {
                    console.log("No puede tener dos opciones iguales");
                    isRepeat = true;
                  }
                }
                if (!isRepeat) {
                  this.listList[i].options.push(optionDescription);
                }
              }
              this.listOptions = this.listList[i].options;
            }
          }
        }
      })
      this.questionService.addOption(uid, this.listOptions);
    } else { 
      alert("Ingrese una opción válida");
    }
  }

  addDate(uid) {
    this.questionService.addDate(uid, "dd-mm-aaaa");
  }

  createList(type, list) {
    list.length = 0;
    this.questionService.getQuestions().orderByChild("type").equalTo(type).on("child_added", snapChild => {
      let questionObject = snapChild.val();
      //questionObject.options = [];
      questionObject.dates = [];
      questionObject.uid = snapChild.key;
      //questionObject.options = snapChild.val().options
      /*snapChild.child("options").forEach(snapOptions => {
        let optionObject = snapOptions.val();
        optionObject.uid = snapOptions.key;
        questionObject.options.push(optionObject);
      });*/
      snapChild.child("dates").forEach(snapDates => {
        let datesObject = snapDates.val();
        datesObject.uid = snapDates.key;
        questionObject.dates.push(datesObject);
      })
      list.push(questionObject);
    });
    this.questionService.getQuestions().orderByChild("type").equalTo(type).on("child_changed", snapChild => {
      let questionObject = snapChild.val();
      //questionObject.options = [];
      questionObject.dates = [];
      questionObject.uid = snapChild.key;
      /*snapChild.child("options").forEach(snapOptions => {
        let optionObject = snapOptions.val();
        optionObject.uid = snapOptions.key;
        questionObject.options.push(optionObject);
      });*/
      snapChild.child("dates").forEach(snapDates => {
        let datesObject = snapDates.val();
        datesObject.uid = snapDates.key;
        questionObject.dates.push(datesObject);
      })
      for (let i = 0; i < list.length; i++) {
        if (list[i].uid == questionObject.uid) list[i] = questionObject;
      }
    });
  }

  addQuestion(type) {
    this.questionService.addQuestion(type);
  }

  changeTitle(uid, title) {
    if (title == undefined) {
      console.log("PREGUNTA TITULO VACIA");
    } else {
      this.questionService.changeTitle(uid, title);
    }
  }

  deleteQuestion(uid) {
    var result = confirm("Seguro desea eliminar la pregunta?");
    if (result) {
      this.questionService.deleteQuestion(uid);
    }
    else {
      console.log("Cancelar");
    }
  }

  deleteOption(questionUid) {
    this.questionService.getQuestionByUid(questionUid).orderByChild('type').once('value', snap => {
      if (snap.val().type == 'multiple') {
        let i = 0;
        while (i < this.multipleList.length) {
          if (this.multipleList[i].uid == questionUid) {
            if(this.multipleList[i].options != undefined){
              let lengthArrayOptions = (this.multipleList[i].options.length) - 1;
              this.questionService.deleteOptions(questionUid, lengthArrayOptions);
              i = this.multipleList.length + 1;              
            } else {
              console.log("HOLA");
            }
          }
          i++;
        }
      } else if (snap.val().type == 'box') {
        let i = 0;
        while (i < this.boxList.length) {
          if (this.boxList[i].uid == questionUid) {
            let lengthArrayOptions = (this.boxList[i].options.length) - 1;
            console.log(lengthArrayOptions);
            this.questionService.deleteOptions(questionUid, lengthArrayOptions);
            i = this.boxList.length + 1;
          }
          i++;
        }
      } else if (snap.val().type == 'list') {
        let i = 0;
        while (i < this.listList.length) {
          if (this.listList[i].uid == questionUid) {
            let lengthArrayOptions = (this.listList[i].options.length) - 1;
            console.log(lengthArrayOptions);
            this.questionService.deleteOptions(questionUid, lengthArrayOptions);
            i = this.listList.length + 1;
          }
          i++;
        }
      }
    });
    //this.questionService.deleteOption(optionUid, questionUid);
  }

  /*changeDescriptionOption(questionUid, option) {
    this.questionService.getQuestionByUid(questionUid).orderByChild('type').on('value', snap => {
      if (snap.val().type == 'multiple') {
        let sigue = true;
        while (sigue) {
          for (let i = 0; i < this.multipleList.length; i++) {
            if (this.multipleList[i].uid == questionUid) {
              for (let j = 0; j < this.multipleList[i].options.length; j++) {
                if (this.multipleList[i].options[j] == option) {
                  let position = this.multipleList[i].options.indexOf(option);
                  console.log(this.multipleList[i].options);
                  this.questionService.updateOptions(questionUid, position, option);
                }
              }
              sigue = false;
            }
          }
        }
      } else if (snap.val().type == 'box') {
        console.log('box');
      } else if (snap.val().type == 'list') {
        console.log('list');
      } else if (snap.val().type == 'scale') {
        console.log('scale');
      }
    });
  }*/

  deleteDate(questionUid, dateUid) {
    var result = confirm("Seguro desea eliminar la fecha?");
    if (result) {
      this.questionService.deleteDate(questionUid, dateUid);
    }
    else {
      console.log("Cancelar");
    }
  }

  changeDate(questionUid, dateUid, date) {
    this.questionService.changeDate(questionUid, dateUid, date);
  }


  changeMin(questionUid, min) {
    this.min = min;
    console.log(questionUid + "-" + this.min);
    this.questionService.changeMin(questionUid, this.min);
  }

  changeMax(questionUid, max) {
    this.max = max;
    console.log(questionUid + "-" + this.max);
    this.questionService.changeMax(questionUid, this.max);
  }

  changeLabelMin(questionUid, labelMin) {
    this.questionService.changeLabelMin(questionUid, labelMin);
  }

  changeLabelMax(questionUid, labelMax) {
    this.questionService.changeLabelMax(questionUid, labelMax);
  }
}
