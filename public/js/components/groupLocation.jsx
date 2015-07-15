var $ = require('jquery');
var _ = require('underscore');
var React = require('react/addons');

var that,
GroupName = React.createClass({
	map: null,
	marker: null,
	initialize: function(){
		that = this;

		GoogleMapsLoader.load(function(google) {
		    new google.maps.Map(el, options);
		});
	},
	getInitialState: function(){
		return {
			loadingText: '',
			lat: '',
			lng: '',
			center: ''
	    };
	},
	componentDidMount: function() {
		that = this;
		this.getUserLocation();
	},
    
	getUserLocation: function(){

		that.setState({'loadingText': 'Locating you...'});

		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};

		var success = function(pos){

			var crd = pos.coords;

			that.setState({
				lat: crd.latitude,
				lng: crd.longitude,
				center: new google.maps.LatLng(crd.latitude, crd.longitude)
			});

			that.setState({'loadingText': 'Loading map...'});

			that.map = that.createMap();
			that.marker = that.createMarker();
			that.mapEvents();

		};

		var error = function(){
			alert('An error occured...');
		}

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(success, error, options);
		}

	},
	createMap: function(){

		var mapOptions = {
			minZoom: 15,
			zoom: 15,
			center: that.state.center,
			disableDefaultUI: true
		};

		return new google.maps.Map(this.refs.map_canvas.getDOMNode(), mapOptions);
		
	},
	createMarker: function(centerMap){

		var center = new google.maps.LatLng(that.state.lat, that.state.lng);

		if(centerMap){
			that.map.setCenter(center, 15);
		}

		return new google.maps.Marker({
			position: center,
			map: that.map
		});
	},
	mapEvents: function(){

		google.maps.event.addListener(that.map, 'tilesloaded', that.handleLoaded);
		google.maps.event.addListener(that.map, 'click', that.handleClick);
		google.maps.event.addListener(that.map, 'dragend', that.handleDragEnd);

	},
	handleLoaded: function(){
		that.setState({'loadingText': ''});
	},
	handleClick: function(data){
		that.marker.setMap(null);
		that.setState({
			'lat': data.latLng.A,
			'lng': data.latLng.F,
		}, function(){
			that.marker = that.createMarker();
		});
	},
	handleDragEnd: function(){},
	render: function() {
		return (
			<div>
				<main className="default-layout">
					<div className="GMap">
						<div ref="map_canvas"></div>
					</div>
					<div className="loading">
						{this.state.loadingText}
					</div>
					<footer className="footer">
						<div className="btn-half">
							<input type="text" ref="search" name="search" />
							<input type="submit" value="Search" className="btn btn--large" onClick={this.searchLoaction} />
						</div>
						<input type="submit" value="Find places here" className="btn btn--white btn--large" onClick={this.saveLocation} />
					</footer>
				</main>
			</div>
		); 
	},
	searchLoaction: function(e){

		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+ this.refs.search.getDOMNode().value.replace(' ', '+') +'&key=AIzaSyC5SPcPmxHyHsM31hoBa4D-aSuZrfq-CiE',
			success: function(data){
				
				if(data.results.length == 0){
					return;
				}

				that.marker.setMap(null);
				that.setState({
					'lat': data.results[0].geometry.location.lat,
					'lng': data.results[0].geometry.location.lng,
				}, function(){
					that.marker = that.createMarker(true);
				});


			}
		})
		// 

	},
	saveLocation: function(e){

		e.preventDefault();

		if(this.state.loadingText!==""){
			return;
		}

		this.props.group.save({ lat: this.state.lat, lng: this.state.lng  }, { success: function(data){

			if(that.props.group.get('solo')){
				EventBus.trigger('router:navigate', 'startQuestions/' + that.props.group.attributes.group.id);
				return false;
			}

			EventBus.trigger('router:navigate', 'groupSelect');

		}});

	}
});

module.exports = GroupName;