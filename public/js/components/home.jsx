var $ = require('jquery');
var _ = require('underscore');
var React = require('react');

var Home = React.createClass({ 
	getInitialState: function(){
		return {
			'showHomeScreen': true
		}
	},
	componentDidMount: function() {         
		that = this;
		$('body').css({'position': 'fixed'}).on('click touchstart', that._closeHomeScreen);

	},    
	render: function() {
		return (
			<div onClick={this._closeHomeScreen}>
				<main className="home">
					<div className="content">
						<div className="container">
						</div>
					</div>
					<footer className="footer">
						<a className="btn btn--full-width" onClick={this.handleSolo}>Table for one</a>
						<a className="btn btn--full-width" onClick={this.handleGroup}>I’m not a loner</a>
					</footer>
					<div>
						{this._addToHomeScreen()}
					</div>
				</main>
			</div> 
		); 
	},
	_addToHomeScreen: function(){

		if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) && this.state.showHomeScreen) {

			return (
				<div className="ios-home-screen">
					Add Dinder to homescreen below
					<small>Click anywhere to close</small>
				</div>
			);
		}
		else{
			return (
				<div></div>
			);
		}

	},
	_closeHomeScreen: function(){

		this.setState({'showHomeScreen': false});

	},
	handleGroup: function(e){

		e.preventDefault();
		EventBus.trigger('router:navigate', 'group');

	},
	handleSolo: function(e){

		e.preventDefault();
		EventBus.trigger('router:navigate', 'solo');

	}
});

module.exports = Home;