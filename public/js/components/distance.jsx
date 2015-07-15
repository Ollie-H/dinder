var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var GroupOnline = require('../components/groupOnline.jsx');


var Home = React.createClass({
	getInitialState: function() {
		return {
			loadingText: '',
			currScale: 1,
			distanceScale: this.props.distance[0],
		};
	},
	componentDidMount: function(){
	},
	render: function() {
		return (
			<div>
				<main className="default-layout dark">
					<div className="content">
						<GroupOnline friends={this.props.friends} user={this.props.user} group={this.props.group}  />
						<div className="container">	
							<h1 className="txt txt--large">How far do you want to travel?</h1>
							<div className={'distance distance--'+this.state.currScale}>
								<h3>“{this.state.distanceScale}”</h3>
								<input className="slider" ref="slider" type="range" min="1" max="3" onChange={this.handleSlider} value={this.state.currScale} />
							</div>
							<h5 className="distance-info">Slide to select distance</h5>
						</div>
					</div>
					<div className="loading">
						{this.state.loadingText}
					</div>
					<footer className="footer">
						<a onClick={this.handleNext} className="btn btn--white btn--large">Get results!</a>
					</footer>
				</main>
			</div>
		); 
	},
	handleSlider: function(){
		this.setState({currScale : this.refs.slider.getDOMNode().value, distanceScale: this.props.distance[this.refs.slider.getDOMNode().value-1] });
	},
	handleNext: function(){
		var that = this;
		this.props.responses.set({radius: parseInt(this.refs.slider.getDOMNode().value) });
		this.props.responses.save({}, {success: function(){
			if(that.props.responses.attributes.response.group.is_complete){
				EventBus.trigger('router:navigate', 'results');
			}
			that.setState({'loadingText': 'Waiting for the others!'});
			setTimeout(function(){
				that.startCountdown();
			}, 5000);
		}});
	},
	startCountdown: function(){

		var that = this,
		secs = 20;

		var _int = setInterval(function(){
			that.setState({'loadingText': 'They\'ve got '+ secs +' seconds...' });
			secs--;
			if(secs<=0){
				clearInterval(_int);
				EventBus.trigger('router:navigate', 'results');
			}
		}, 1000);
	}
});

module.exports = Home;