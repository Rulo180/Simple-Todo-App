import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';    //Importo la coleccion de Tasks

import './body.html';
import './task.js';

Template.body.helpers({       //Definimos un helper en el template body
  tasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });    //devuelvo el resultado del metodo find de Tasks
  },
});                           //Este helper devuelve un array de tasks

Template.body.events({
  'submit .new-task'(event) {         //Listener de evento submit de cualquier elemento que coincida con el selector CSS .new-task
    //Prevent defaul browser form submit
    event.preventDefault();

    //Get value from form elemnent
    const target = event.target;
    const text = target.text.value;   //Almacena el valor del input en text

    //Insert a taks into the Collection
    Tasks.insert({
      text,
      createdAt: new Date(),  //current time
    });

    //Clear form
    target.text.value = '';
  },
});
