import {Template} from 'meteor/templating';
import {Accounts} from 'meteor/accounts-base';

/*
const todos = [
	{text: 'Pickup kids from school'},
	{text: 'Go grocery shopping'},
	{text: 'Meeting with boss'}
];
*/

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

//Added after removing autopublish
Template.main.onCreated(function mainOnCreated(){
	Meteor.subscribe('todos');
});

Template.main.helpers({
	title(){
		return 'Quick List';
	},

	todos(){
		const todos = Todos.find();
		return todos;
	}
});

Template.main.events({
	'submit.add-todo'(event){
		event.preventDefault();

		const text = event.target.text.value;
		const time = event.target.time.value;
		console.log(text);
		console.log(time);

		// Added After meteor remove insecure use server methods
		Meteor.call('todos.insert', text, time);

		/* // Insecure method to prototype
		Todos.insert({
			text,
			time,
			owner: Meteor.userId(),
			username: Meteor.user().username
		}) */

		event.target.text.value = '';
		event.target.time.value = '';
	}
});

Template.todo.events({
	'click .toggle-checked'(event){
		
		/* // Added After meteor remove insecure
		Todos.update(this._id, {
			$set:{checked: !this.checked}
		}); */
		
		Meteor.call('todos.setChecked', this._id, !this.checked);

	},
	'click .delete'(event){
		//Todos.remove(this._id);
		Meteor.call('todos.removeItem', this._id);

	},
	'click .toggle-private'(){
		Meteor.call('todos.setPrivate', this._id, !this.private);
	}
});

//Checking for owner for public or private
Template.todo.helpers({
	isOwner(){
		return this.owner === Meteor.userId();
	}
});




