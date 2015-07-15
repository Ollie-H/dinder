var $ = require('jquery');
var _ = require('underscore');
var React = require('react');

var that,
TopNav = React.createClass({
	initialize: function(){
		that = this;
	},
	componentDidMount: function() {
		that = this;
	},
	getInitialState: function(){
		return {
			showInfo: false,
			text: this.props.text
		}
	},
	render: function() {
		return (
			<div>
				<nav className="topNav">
					<a href="#" className="topNav__btn topNav__btn--left" onClick={this.goBack}>
						<i className={(this.props.back) ? "fa fa-angle-left": ""}></i>
					</a>
					<h2>{this.state.text}</h2>
					<a className="topNav__btn topNav__btn--right" onClick={this.alert}>
						<i className={(!(this.state.showInfo) ? "fa-question-circle" : "fa-times-circle") + " fa"}></i>
					</a>
				</nav>
				<div className={((this.state.showInfo) ? "show" : "") + " info-box"} ref="info">
					<h1>Welcome to dinder</h1>
					<p>Dinder is designed to help you to discover restaurants in your area, based on the what you and your connected group fancy eating.</p>
					<p>Dinder is a Saatchi & Saatchi Hack day 2015 project and not a fully working app, any questions contact olliehusband@me.com</p>
					<p><br /><br />CREDITS:</p>
					<p>Front End by <a href="http://olliehusband.com" target="_blank">Ollie Husband</a></p>
					<p>Back End by Craig Cartmell</p>
					<p>Design by Nathan Crawford</p>
					<p>UX By Joe Brisley</p>
				</div>
			</div>
		); 
	},
	goBack: function(){
		window.history.back();
	},
	alert: function(e){

		e.preventDefault();

		var toggle = !this.state.showInfo;

		this.setState({
			showInfo: toggle,
			text: toggle ? 'Info': this.props.text
		})

	}
});

module.exports = TopNav;