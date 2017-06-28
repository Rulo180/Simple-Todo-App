import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks'); //Exporto la nueva coleccion de Tasks

if (Meteor.isServer) {
    // This code only runs on the server

    // Only publish tasks that are public or belon to the current user
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({ 
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

//Definimos un metodo por cada operacion a la BD
Meteor.methods({
    'tasks.insert' (text) {
        check(text, String);

        //Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),                //current time
            owner: Meteor.userId(),               //devuelve el _id del usuario actual
            username: Meteor.user().username,     //devuelve el documento user completo
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },
    'tasks.setChecked' (taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }
        
        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
 
        const task = Tasks.findOne(taskId);
    
        // Make sure only the task owner can make a task private
        if (task.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
        }
    
        Tasks.update(taskId, { $set: { private: setToPrivate } });
    },
});