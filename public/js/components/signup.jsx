var $ = require('jquery');
var _ = require('underscore');
var Cookies = require('js-cookie');
var React = require('react');

var Login = React.createClass({
	getInitialState: function() { 
		return {
			error: '',
			user: {
				email: '',
				name: '',
				password: ''
			}
		};
	},
	componentDidMount: function() { 
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
							<div className="signup__login">
								<a className="btn btn--full-width btn--fb" onClick={this.signup}>Signup with facebook</a>
								<a href="#" onClick={this.login} className="login__signup">&lt; Back to login</a>
							</div>
							<div className="signup__confirm">
								<form onSubmit={this.saveUser} autoComplete="off">
									<p className="login__signup">Please enter a password.</p>
									<input type="password" name="password" ref="password" placeholder="password" value={this.state.user.password} onChange={this.handlePassword} autoComplete="off" />
									<input type="submit" />
								</form>
							</div>
						</div> 
					</footer>
				</main>
			</div>
		);
	},
	login: function(e){
		EventBus.trigger('router:navigate', 'login');
		e.preventDefault(); 
	},
	signup: function(e){ 
   
		var self = this;

		e.preventDefault();
		 FB.login(function(response) {
		   	if (response.status === 'connected') {
		   		
		   		self.setState({'user': _.extend(self.state.user, {'facebook_access_token': response.authResponse.accessToken }) });

		   		var user = $.Deferred();
		   		var profile = $.Deferred();  
		   		var friends = $.Deferred();  

	   			FB.api(
				    "/me",
				    function (response) {
				      user.resolve(response);
				    }
				);

				FB.api(
				    "/me/picture",
				    function (response) {
				      profile.resolve(response);
				    }
				);

				FB.api(
				    "/me/picture",
				    function (response) {
				      profile.resolve(response);
				    }
				);

				$.when(user, profile, friends).done(self.fbCallback);

		   	}
		 }, {scope: 'public_profile,email,user_friends'});
	},

	fbCallback: function(user, profile, friends){

   		this.setState({'user': _.extend(this.state.user, {
			'facebook_id' : user.id,
			'name' : user.name,
			'email': user.email
		}) });

		var _friends = [];

		_.each(response.data, function(friend){
			_friends.push(friend.id);
		});

		that.props.friends.set({ friends: ' ', id: _friends.join(',') });
		that.props.friends.fetch({ success: function(){
			friends.resolve();
		}});

	},

	handlePassword: function(e){

		this.setState({'user': _.extend(this.state.user, {
			'password': e.target.value
		})});

	},	
	saveUser: function(e){

		e.preventDefault();

		this.props.model.save(this.state.user, {success: function(response){

			if(response.attributes.success){
				Cookies.set('_user', this.state.user.id, { expires: 7 });
				EventBus.trigger('router:navigate', 'home');
			}
			else{
				alert('Duplicate user - there is also an account with this user.');
			}
		}});

	}
});

module.exports = Login;