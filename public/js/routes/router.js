var $ = require('jquery');
var Backbone = require('../helpers/backboneBeforeAfter');
var _ = require('underscore');
var Cookies = require('js-cookie');
var React = require('react');
var UserModel = require('../models/userModel');
var FriendsModel = require('../models/friendsModel');
var GroupModel = require('../models/groupModel');
var ResponsesModel = require('../models/responsesModel');

var userModel = new UserModel();
var friendsModel = new FriendsModel();
var groupModel = new GroupModel();
var responsesModel = new ResponsesModel();

// Components
var TopNav = require('../components/topNav.jsx');
var Login = require('../components/login.jsx');
var Signup = require('../components/signup.jsx');
var Home = require('../components/home.jsx');
var GroupName = require('../components/groupName.jsx');
var GroupSelect = require('../components/groupSelect.jsx');
var GroupLocation = require('../components/groupLocation.jsx');
var CuisineQuestions = require('../components/cuisineQuestions.jsx');
var Price = require('../components/price.jsx');
var Distance = require('../components/distance.jsx');
var GroupResult = require('../components/groupResult.jsx');

var PUSHER_APP_ID='116502';
var PUSHER_AUTH_KEY='7049c66b48f949cfa7c5';
var PUSHER_SECRET='8ab4e30c94824a5d3516';

var cuisine = _.shuffle(['Italian', 'American', 'Spanish', 'Fast Food', 'Indian', 'Sandwich Place', 'Thai', 'Chinese', 'Cafe', 'Sea Food', 'Bakery', 'Japanese', 'Mexican']);
var pricing = ['I\'m Skint', 'How long till pay day?', 'F--k it, it\'s friday', 'I\'m a hustler'];
var distance = ['Bring it to me', 'I know a good place', 'The best in town'];
var prefix = ['Do you fancy #?', 'How about #?', '#?', 'How does # sound?'];

var friends;

var that,
Router = Backbone.Router.extend({
	initialize: function(){ 

		that = this;

		window.pusher = new Pusher(PUSHER_AUTH_KEY);
		window.channel = pusher.subscribe('dinder');

		window.EventBus = _.extend({}, Backbone.Events); 
		EventBus.on('router:navigate', this._navigate);

		that.pusherEvents();

	},
	routes: {
		'': 'login',
		'home': 'home',
		'signup': 'signup',
		'solo': 'solo',
		'group': 'groupName',
		'groupLocation': 'groupLocation',
		'groupSelect': 'groupSelect',
		'startQuestions/:id': 'startQuestions',
		'startQuestions/join/:id': 'joinQuestions',
		'distance': 'distance',
		'price': 'price',
		'results': 'showResults',
		'startOver': 'startOver',
		'*path': 'login'
	},

	before: function(route, promise){

		// return true;
		if(!userModel.attributes.user && route !=='login' && route !=='signup'){
			
			var user = Cookies.get('_user');
			var friends = Cookies.get('_friends');
			var _route = route.split('/');

			if(user){

				userModel.set({user: JSON.parse(user)});
				friendsModel.set(JSON.parse(friends));

				if(_.indexOf(_route, 'startQuestions') > -1){
					var id = _route[_route.length-1];
					that.joinQuestions(id);
					return;
				}
				that._navigate('home');
			}
			else{
				that._navigate('login');
			}

			return false;
		}
		return true; 

		window.setTimeout(function(){
			$(window).trigger('resize');
		}, 100);
	},

	pusherEvents: function(){

		channel.bind('invite_created', function(data) {

			if(groupModel.attributes.group && groupModel.attributes.group.created_by === userModel.attributes.user.id){
				return false;
			}

			if(data.invite.user_id === userModel.attributes.user.id){
				if(window.confirm('You have been invited to a group, go there now?')){
					that.navigate('/startQuestions/join/'+data.invite.group_id, {trigger: true});
				}
			}
		});

		channel.bind('group_completed', function(data){
			that.showResults();
		});

	},

	'login' : function(){
		
		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text='Login' />
				<Login model={userModel} friends={friendsModel} responses={responsesModel} />
			</div>,
			document.querySelector('.application')
		);

	},

	'signup' : function(){
		
		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text='Signup' />
				<Signup model={userModel} friends={friendsModel} responses={responsesModel} />
			</div>,
			document.querySelector('.application')
		);

	},

	'home': function(){

		responsesModel.set({user_id: parseInt(userModel.attributes.user.id) || 1});

		React.render(
			<div>
				<TopNav show={true} image={true} back={false} text='' />
				<Home user={userModel} />
			</div>,
			document.querySelector('.application')
		);
	},

	'solo': function(){

		groupModel.save({ name: '', created_by: userModel.attributes.user.id  }, { success: function(data){
			responsesModel.set({group_id: groupModel.attributes.group.id });
			groupModel.set({ user_ids : [], solo: true });
			groupModel.save({}, { success: function(){
				that._navigate('/groupLocation');
			}});
		}});

	},

	'groupName': function(){

		React.render(
			<div>
				<TopNav show={true} image={false} back={true} text='Name your party' />
				<GroupName user={userModel} group={groupModel} responses={responsesModel} />
			</div>,
			document.querySelector('.application')
		);
	},

	'groupLocation': function(){

		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text='Choose your area' />
				<GroupLocation user={userModel} group={groupModel} responses={responsesModel} />
			</div>,
			document.querySelector('.application')
		);	
	},

	'groupSelect': function(){

		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text='Invite some friends' />
				<GroupSelect user={userModel} friends={friendsModel.attributes.users} group={groupModel} />
			</div>,
			document.querySelector('.application')
		);
	},

	groupSet: function(){

	},

	joinQuestions: function(groupId){

		groupModel.set({id: groupId});
		responsesModel.set({group_id: groupId});
		groupModel.fetch({
			success: function(){
				that.startQuestions();
			}
		});

	},

	startQuestions: function(groupId){

		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text={groupModel.attributes.group.name} />
				<CuisineQuestions cuisine={cuisine} prefix={prefix} user={userModel} responses={responsesModel} group={groupModel} />
			</div>,
			document.querySelector('.application')
		);

	},

	price: function(){

		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text='Price' />
				<Price user={userModel} friends={friendsModel.attributes.users} responses={responsesModel} group={groupModel} pricing={pricing} />
			</div>,
			document.querySelector('.application')
		);

	},

	distance: function(){

		React.render(
			<div>
				<TopNav show={true} image={false} back={false} text='Distance' />
				<Distance user={userModel} friends={friendsModel.attributes.users} responses={responsesModel} group={groupModel} distance={distance} />
			</div>,
			document.querySelector('.application')
		);

	},

	showResults: function(){

		groupModel.set({'completed': true});
		groupModel.fetch({
			success: function(data){

				var venues = _.toArray(groupModel.attributes.results);
				var first = _.first(venues);
				var others = _.rest(venues);

				React.render(
					<div>
						<TopNav show={true} image={false} back={false} text='Results' />
						<GroupResult venue={first} others={others} user={userModel} friends={friendsModel.attributes.users} responses={responsesModel} group={groupModel} />
					</div>,
					document.querySelector('.application')
				);

			}	
		});

	},

	startOver: function(){

		// Restore models to default and redirect to home
		friendsModel = new FriendsModel();
		groupModel = new GroupModel();
		responsesModel = new ResponsesModel();

		that._navigate('home');

	},

	'_navigate': function(page, resp){

		if (Backbone.history.fragment === page) {
		    Backbone.history.loadUrl(Backbone.history.fragment);
		} else {
		    that.navigate(page, {'trigger': true});
		}
		
	} 
});

module.exports = Router; 

