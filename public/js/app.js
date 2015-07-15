var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Router = require('./routes/router');
Backbone.$ = $;

$(document).ready(function(){

	$.getScript('//connect.facebook.net/en_US/sdk.js', function(){

		var router = new Router();
		var isTouch = ('ontouchstart' in window || 'onmsgesturechange' in window);

		FB.init({
		  appId: '491663097662786',
		  version: 'v2.3'
		});

   		Backbone.history.start({ pushState: true });
	});

	$(window).on('resize', function(){
		$('.application').css({ 'height': $(window).height() });
	}).resize();

});