var $ = require('jquery');
var _ = require('underscore');
var React = require('react');

var that,
GroupName = React.createClass({
	initialize: function(){
		that = this;
	},
	render: function() {
		return (
			<div>
				<main className="default-layout">
					<div className="content">
						<div className="container">
							<div className="profile-image">
								<img src={this.props.user.attributes.user.facebook_image} />
							</div>
							<input type="text" placeholder="Enter a group name" ref="groupName" className="noborder focus" />
						</div>
					</div>
					<footer className="footer">
						<input type="submit" value="Let's DINE Together" className="btn btn--white btn--large" onClick={this.validateGroupName} />
					</footer>
				</main>
			</div>
		); 
	},
	componentDidMount: function() {
		that = this;
	},
	validateGroupName: function(e){

		e.preventDefault();

		var groupName = that.refs.groupName.getDOMNode().value;
		var self = this;
		if(groupName!=''){
			that.props.group.save({ name: groupName, created_by:that.props.user.attributes.user.id  }, {success: function(data){
				that.props.responses.set({group_id: that.props.group.attributes.group.id });
				that.groupSelect(data);
			}});
		}

	},
	groupSelect: function(data){
		EventBus.trigger('router:navigate', 'groupLocation');
	},
	goBack: function(){
		window.history.back();
	}
});

module.exports = GroupName;