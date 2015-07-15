var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var ResponsesModel = Backbone.Model.extend({
	url: function(){
		return '/api/responses';
	}
});

module.exports = ResponsesModel;