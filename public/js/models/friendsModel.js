var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Cookies = require('js-cookie');
  
var that, 
FriendsModel = Backbone.Model.extend({
	initialize: function(){
		that = this;
		that.on('change', this.store, this);
	},
	urlRoot: function(){
		if(this.attributes.friends){
			return '/api/users/facebook';
		}
		return '/api/users';
	},
	store: function(){
		Cookies.set('friends', JSON.stringify(this.attributes));
	}
});

module.exports = FriendsModel;