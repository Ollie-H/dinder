var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var Cookies = require('js-cookie');

var Login = React.createClass({
	getInitialState: function() { 
		return {
			login: true,
			error: '',
			user: {
				email: '',
				name: '',
				password: '',
				facebook_access_token: ''
			},
			password_message: 'Enter your password'
		};
	},
	isTouch: function() {

	 	return ('ontouchstart' in document.documentElement);

	},
	componentDidMount: function(){

		var self = this;
		
		if(this.isTouch()){
			FB.getLoginStatus(function(response) {
	   			if (!response.authResponse) {
	   				window.top.location = 'https://www.facebook.com/dialog/oauth?client_id=491663097662786&redirect_uri=http://dinder-app.com/login&scope=public_profile,email,user_friends';
	   			}
	   			else{
	   				fb_user_id = response.authResponse.userID;
	   				fb_user_token = response.authResponse.accessToken;
	   				self.fbApiRequests(fb_user_id, fb_user_token);
	   			}
	   		});
	   	}

	},
	loginBtn: function(){
 
		if(this.isTouch()){
			return (<div></div>);
		}

		return (
			<div className="signup__login">
				<a className="btn btn--full-width btn--fb" onClick={this.login}>Login with facebook</a>
			</div>
		);
	},
	render: function() {
		return (
			<div>
				<main className="login login--signup">
					<div className="content">
						<div className="container">
						</div>
					</div>
					<footer className={((this.state.user.name!=='')? 'signup__form-show' : '') + ' footer'}>
						<div className="container">
							<div>
								{this.loginBtn()}
							</div>
							<div className="signup__confirm">
								<p className="login__signup">{this.state.password_message}</p>
								<span className="error">{this.state.error}</span>
								<input type="password" ref="password" value={this.state.password} onChange={this.handlePassword} />
								<input type="submit" onClick={this.authenticate} /> 
							</div>
						</div> 
					</footer>
				</main>
			</div>
		);
	},
	login: function(e){
   
		var self = this;

		e.preventDefault();

		FB.login(function(response) {

		   	if (response.status === 'connected') {

		   		self.setState({'user': _.extend(self.state.user, {'facebook_access_token': response.authResponse.accessToken }) });

		   		self.fbApiRequests();

		   	}

		 }, {scope: 'public_profile,email,user_friends', redirect_uri: 'http://dinder-app.com', display : 'touch'});
	
	},
	fbApiRequests: function(fb_user_id, fb_user_token){

		var self = this;

		var user = (typeof fb_user_id !== 'undefined') ? window.fb_user_id : "me";
		var tokenObj = (typeof fb_user_token !== 'undefined') ? { access_token: window.fb_user_token } : {};

		var user = $.Deferred();
   		var profile = $.Deferred();  
   		var friends = $.Deferred();  

		FB.api(
		    "/me",
		    tokenObj,
		    function (response) {
		    	user.resolve(response);
		    }
		);

		FB.api(
		    "/me/friends",
		    tokenObj,
		    function (response) {
		    	friends.resolve(response);
		    }
		);

		FB.api(
		    "/me/picture",
		    tokenObj,
		    function (response) {
		    	console.log(response);
		     	profile.resolve(response);
		    }
		);

		$.when(user, profile, friends).done(function(user, profile, friends){
			self.fbCallback.call(self, user, profile, friends); 
		});

	},
	fbCallback: function(user, profile, friends){

		var self = this;
		var authed = $.Deferred();

		$.ajax({
			url: '/api/users/facebook/'+user.id,
			success: function(data){
				if(data.users.length === 0){
					self.setState({'login': false, 'password_message' : 'Please enter a new password'});
				}
				authed.resolve();
			}
		})

		$.when(authed).done(function(){

			var _friends = [];

			self.setState({'user': _.extend(self.state.user, {
				'facebook_id' : user.id,
				'name' : user.name,
				'facebook_image': profile.data.url,
				'email': (user.email || 'noemail@'+ new Date().getTime() +'.com')
			})});

			_.each(friends.data, function(friend){
				_friends.push(friend.id);
			});

			self.props.friends.set({ friends: ' ', id: _friends.join(',') });
			self.props.friends.fetch();

		});

	},
	authenticate: function(e){
 
		e.preventDefault();

		if(!this.state.login){
			this.saveUser();
			return;
		}

		var auth = {
			email: this.state.user.email,
			password: this.refs.password.getDOMNode().value
		};

		// Auth email and error
		var self = this;
		this.props.model.auth(auth, function(error){ 
			self.setState({'error':error});
		});

	},
	handlePassword: function(e){

		this.setState({'user': _.extend(this.state.user, {
			'password': e.target.value
		}) });

	},	
	saveUser: function(){

		this.props.model.save(this.state.user, {success: function(response){

			if(!response.attributes.success){
				alert('Duplicate user - there is also an account with this user.');
				return;
			}

			Cookies.set('_user', JSON.stringify(response.attributes.user));
			EventBus.trigger('router:navigate', 'home');

		}});

	}
});

module.exports = Login;