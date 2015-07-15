var $ = require('jquery');
var Backbone = require('backbone');
var Cookies = require('js-cookie');
var _ = require('underscore');

var that, 
UserModel = Backbone.Model.extend({
	initialize: function(){
		that = this;
	},
	urlRoot: function(){
		return '/api/users';
	},	
	auth: function(data, callback){

		$.ajax({
			type: 'POST',
			datatype : "json", 
    		contentType: 'application/json; charset=utf-8',
			url: this.urlRoot() + '/login',
			data: JSON.stringify(data),
			success: function(resp){

				if(!resp.success){
					callback(resp.errors);
					return;
				}
				that.set({id: resp.user.id});
				that.fetch({
					success: function(){
						Cookies.set('user', JSON.stringify(resp.user));
						EventBus.trigger('router:navigate', 'home');
					}
				});
			}
		});	

	}
});

module.exports = UserModel;