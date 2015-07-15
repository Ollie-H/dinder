var $ = jQuery = require('jquery');
var _ = require('underscore');
var React = require('react');
var HammerMixin = require('../mixins/hammerMixin');
var GroupOnline = require('../components/groupOnline.jsx');
var options = {};

var that,
currCuisine = 0,
flag = false,
answers = [],
GroupName = React.createClass({
	mixins: [HammerMixin],
	hammer: {
		div: 'swipe',
		div: 'pan'
	},
	initialize: function(){
		that = this;
		this.props.group.userJoined(this.props.user.attributes.id);
	},
	getInitialState: function() {
		return {
			animate: '',
			drag: 190,
			cuisine: this.props.cuisine[currCuisine]
		};
	},
	componentDidMount: function() {
		that = this;
		flag = false;
	},
	render: function() {

		return (
			<div>
				<main className={'default-layout cuisine ' + this.state.cuisine.toLowerCase().replace(' ', '')}>
					<div className="content">
						<GroupOnline friends={this.props.friends} user={this.props.user} group={this.props.group}  />
						<h1 className="txt txt--large">{this.state.cuisine}?</h1>
						<div className={"cuisine__bg "+ this.state.animate} ref="div"></div>
					</div>
					<footer className="footer">
						<div className="cuisineAnswers">
							<span className="vote vote--no" onClick={this.handleNo}>No</span>
							<span className="vote vote--yes" onClick={this.handleYes}>Yes</span>
						</div>
					</footer>
				</main>
			</div>
		); 
	},
	handleNo: function(){

		if(flag){
			return;
		}

		flag = true;
		this.nextQuestion();

	},
	handleYes: function(){

		if(flag){
			return;
		}

		flag = true;
		this.handleClick();
	},
	handleClick: function(){

		this.animateCuisine('right');
		answers.push(this.state.cuisine);
		this.nextQuestion(false);
	},
	handlePan: function(e){
		that.handleSwipe(e);
	},
	handleSwipe: function(e){

		if(
			(flag) ||
			(e.type!=='swipe'&&e.type!=='pan')
		){
			return;
		}

		if(e.type==='pan'&&e.distance <= 100){

			if(e.direction==4){	
				flag = true;
				that.handleClick.call(that);
			}
			else if(e.direction===2){
				console.log('swipe');
				flag = true;
				this.animateCuisine('right');
				that.nextQuestion.call(that);
			}
		}
	},
	animateCuisine: function(dir){

		that.setState({ 'animate': 'animate--'+dir });

	},
	nextQuestion: function(animate){

		if(typeof animate !== 'boolean'){
			that.animateCuisine('left');
		}

		channel.unbind('response_created');
		window.setTimeout(function(){
			currCuisine++;
			if(currCuisine>=that.props.cuisine.length){
				currCuisine = 0;
				that.props.responses.set({ cuisines: answers });
				EventBus.trigger('router:navigate', 'price');
				return;
			}
			flag = false;
			that.setState({cuisine: that.props.cuisine[currCuisine]});
			that.setState({'animate': ''});
		}, 600);
	}
});

module.exports = GroupName;