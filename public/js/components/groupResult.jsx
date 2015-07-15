var $ = require('jquery');
var _ = require('underscore');    
var React = require('react');
var GroupOnline = require('../components/groupOnline.jsx');

var that,
GroupSelect = React.createClass({
	initialize: function(){
	},
	componentDidMount: function() {
		that = this;
		$('body').css({'position': 'relative'});
	},
	pricingTier: function(tier){
		var str='';
		for (var i = 0; i <= tier; i++) {
			str += '£';
		};
		return str;
	},
	render: function() {
		return (
			<div>
				<main className="default-layout">
					<div className="content">
						<GroupOnline friends={this.props.friends} user={this.props.user} group={this.props.group}  />
						<div className="venue-info">
							<h1 className="txt txt--large">{this.props.venue.name}</h1>
							<p>{this.props.venue.location.address}, {this.props.venue.location.city} | {this.pricingTier(this.props.venue.price.tier)}</p>
						</div>
						<div className="plate-map">
							<img src={'https://maps.googleapis.com/maps/api/staticmap?center='+this.props.venue.location.lat+','+this.props.venue.location.lng+'&zoom=15&size=250x250&markers=color:red%7Clabel:D%7C'+this.props.venue.location.lat+','+this.props.venue.location.lng} />
						</div>
						<a className="btn btn--dark btn--full-width venue-link" href={'https://www.google.com/maps?q='+this.props.venue.location.lat+','+this.props.venue.location.lng +'&ll='+this.props.venue.location.lat+','+this.props.venue.location.lng +'&z=17'} target="_blank">Take me there!</a>
						<div className="alternatives">
							<p>A few more places you might like...</p>
							<ul>
								{
									this.props.others.map(function(venue){
										return <li><a href={'https://www.google.com/maps?q='+venue.location.lat+','+this.props.venue.location.lng +'&ll='+venue.location.lat+','+venue.location.lng +'&z=17'} target="_blank">{venue.name} <span className="other-price">{this.pricingTier(venue.price.tier)}</span></a></li>
									},this)
								}
							</ul>
						</div>
					</div>
					<footer className="footer">
						<a className="btn btn--white btn--large" onClick={this.startAgain}>Start Again</a>
					</footer>
				</main>
			</div>
		); 
	},
	startAgain: function(){

		EventBus.trigger('router:navigate', 'startOver');
	}
});

module.exports = GroupSelect;