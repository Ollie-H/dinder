var $ = require('jquery');
var _ = require('underscore');
var React = require('react');
var GroupOnline = require('../components/groupOnline.jsx');

var Home = React.createClass({
	getInitialState: function() {
		return {
			currScale: 1,
			pricingScale: this.props.pricing[0],
		};
	},
	render: function() {
		return (
			<div>
				<main className="default-layout dark">
					<div className="content">
						<GroupOnline friends={this.props.friends} user={this.props.user} group={this.props.group}  />
						<div className="container">
							<h1 className="txt txt--large">How much you spending?</h1>
							<div className={'pricing pricing--'+this.state.currScale}>
								<h3>“{this.state.pricingScale}”</h3>
								<input className="slider" ref="slider" type="range" min="1" max="4" onChange={this.handleSlider} value={this.state.currScale} />
							</div>
							<h5 className="pricing-info">Slide to select price</h5>
						</div>
					</div>
					<footer className="footer">
						<a onClick={this.handleNext} className="btn btn--white btn--large">The price is right</a>
					</footer>
				</main>
			</div>
		); 
	},
	handleSlider: function(){
		this.setState({currScale : this.refs.slider.getDOMNode().value, pricingScale: this.props.pricing[this.refs.slider.getDOMNode().value-1] });
	},
	handleNext: function(){
		this.props.responses.set({price: parseInt(this.refs.slider.getDOMNode().value) });
		EventBus.trigger('router:navigate', 'distance');
	}
});

module.exports = Home;