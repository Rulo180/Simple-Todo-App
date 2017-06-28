//Imports de modulos
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';    //Importo la coleccion de Tasks

//Imports de templates
import './body.html';
import './task.js';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({       //Definimos un helper en el template body
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      //if hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } })
    }
    //Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });    //devuelvo el resultado del metodo find de Tasks
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  }
});                           //Este helper devuelve un array de tasks

Template.body.events({
  'submit .new-task'(event) {         //Listener de evento submit de cualquier elemento que coincida con el selector CSS .new-task
    //Prevent defaul browser form submit
    event.preventDefault();

    //Get value from form elemnent
    const target = event.target;
    const text = target.text.value;   //Almacena el valor del input en text

    //Insert a taks into the Collection
    Meteor.call('tasks.insert', text);

    //Clear form
    target.text.value = '';
  },
  'click .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }
});
