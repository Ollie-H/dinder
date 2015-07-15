var React = require('react');
var _ = require('underscore');

var App = React.createClass({
	getInitialState: function() {
		console.log(this.props.group.attributes);
		return {
			friends: this.props.group.attributes.group.invites,
		};
	},
	componentDidMount: function() {

		that = this;

		this.props.group.userJoined(this.props.user.attributes.user.id);

		channel.bind('invite_joined', function(data) {
			that.setState({'friends': 
				_.map(that.state.friends, function(friend){
					if(friend.id === data.user_id){
						friend.is_live = true;
					}
					return friend;
				})
			});
		});

		channel.bind('response_created', function(data){

			var arr = _.map(that.state.friends, function(friend){
				if(friend.user.id === data.response.user_id){
					friend.user.is_completed = true;
				}
				return friend;
			});

			that.setState({'friends': arr});
		});

	},
	isFriendOnline: function(friend){

		var arr = [];

		arr.push((
			friend.is_live ||
			friend.has_joined ||
			friend.id === this.props.user.attributes.user.id ||
			friend.id === this.props.group.attributes.group.created_by
		) ? 'show': '');

		arr.push((
			friend.is_completed
		) ? 'complete' : '');

		return arr.join(' ');

	},
	render: function() {

		if(this.props.group.attributes.group.name === ''){
			return (
				<div></div>
			);
		}

		return (
			<div className="friendList">
				<ul>
					{
						this.state.friends.map(function(invite){
							return <li className={this.isFriendOnline.call(this, invite.user)}>
								<img src={invite.user.facebook_image} />
								<span>{invite.user.initials}</span>
							</li>
						},this)
					}
				</ul>
			</div>
		);
	}
});

module.exports = App;