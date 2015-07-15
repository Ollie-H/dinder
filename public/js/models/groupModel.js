var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

var GroupModel = Backbone.Model.extend({
	urlRoot: function(){
		if(this.get('completed')){
			return '/api/groups/'+this.attributes.group.id+'/results';
		}
		else if(this.get('user_ids')){
			return '/api/groups/'+this.attributes.group.id+'/invites';
		}
		else if(this.get('lng')){
			return 'api/groups/'+this.attributes.group.id+'/update';
		}
		return '/api/groups';
	},
	userJoined: function(uid){
		// if(this.attributes.group.created_by === uid){
		// 	return;
		// }
		$.ajax({
			'url': '/api/groups/'+ this.attributes.group.id + '/joined/' + uid
		})
	}
});

module.exports = GroupModel;