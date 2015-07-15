var $ = require('jquery');
var _ = require('underscore');    
var React = require('react');

var that,
invites = [],
GroupSelect = React.createClass({
	getInitialState: function(){
		return {
			friends: this.props.friends
		}
	},
	componentDidMount: function() {
		that = this;
		invites.push(this.props.user.attributes.user.id);
	}, 
	render: function() {
		return ( 
			<div>
				<main className="default-layout">
					<div className="content">
						<div className="container">
							<h2 className="txt txt--large">{(this.state.friends.length == 0) ? 'None of your friends seem to have joined yet' : ''}</h2>
						</div>
						<ul className="relative" onClick={this.handleAdd}>
							{
								this.state.friends.map(function(friend, i, arr){
									return <li data-index={i} className={"btn btn--pinkwhite btn--light "+((friend.is_selected)?'tick': '')}>
										<div className="profile-image profile-image--row">
											<img src={this.props.user.attributes.user.facebook_image} />
										</div>
										<span className="center">{friend.name}</span>
									</li>
								}, this) 
							}
						</ul>
					</div>
					<footer className="footer">
						<a onClick={this.handleStart} className="btn btn--white btn--large">Ready to eat</a>
					</footer>
				</main>
			</div>
		); 
	},
	goBack: function(){
		window.history.back();
	},
	handleAdd: function(e){

		var index = $(e.target).attr('data-index');
		var _friends = this.props.friends;

		_friends[index].is_selected = !_friends[index].is_selected;
		this.setState({friends: _friends});

		if(invites.indexOf(_friends[index].id) === -1){
			invites.push(_friends[index].id);
		}
		else{
			invites = _.without(invites, _friends[index].id);
		}

	},	
	handleStart: function(e){

		e.preventDefault();

		that.props.group.set({ user_ids : invites });
		that.props.group.save({}, { success: function(){
			EventBus.trigger('router:navigate', 'startQuestions/'+that.props.group.attributes.group.id);
		}});

	}
});

module.exports = GroupSelect;