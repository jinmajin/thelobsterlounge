// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.

var map;
var geocoder;
var users = [];
var genres = [];
var dates = [];
var markers = [];
var bostonCenter = new google.maps.LatLng(42.360091, -71.09416);
var nyCenter = new google.maps.LatLng(40.740083, -73.990349);


function initialize() {
	$("#map-canvas").height($(window).height() - 100);
	$("#gmap_view").height($(window).height() - 100);
	var mapOptions = {
		zoom: 13,
		disableDefaultUI: true
	};	

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	console.log(map);
	google.maps.event.addListenerOnce(map, 'idle', function() {
   		google.maps.event.trigger(map, 'resize');
	});
	geocoder = new google.maps.Geocoder();
	
	goToCity();
	var profNameToUser = {};
	var keys = Object.keys(profileResources);
	for(var i = 0; i < keys.length; i++){
		users.push(profileResources[keys[i]]);
		if(genres.indexOf(profileResources[keys[i]]["genre"]) < 0)
			genres.push(profileResources[keys[i]]["genre"]);
		profNameToUser[profileResources[keys[i]]["profileName"]] = keys[i];
	}

	for(var i = 0; i < genres.length; i++){
		$("#genres").append('<li><input type="checkbox" onchange="filter()" class="genrebox" value="'+genres[i]+'"id="checkbox_'+genres[i]+'"><label for="checkbox_'+genres[i]+'">'+genres[i]+'</label></li>');
	}
	
	function datestr(date){
		return date.month + "/" + date.day + "/" + date.year;
	}


	function createEventFor(i,j, users, perfs) {
		return function(results, status){
			if(status == "OK"){
				var loc = results[0]["geometry"]["location"];
				var datestr = perfs[j]["date"].month+"/"+perfs[j]["date"].day+"/"+perfs[j]["date"].year;

				var contentMString = '<div class="contentM">'+
				'<h4 class="heading"><a href="profile.html?profile='+profNameToUser[users[i]["profileName"]]+'">'+users[i]["profileName"]+'</a></h4>'+
				'<div class="bodycontentM">'+
				'<div class="locationAndDate">'+datestr+" -- "+perfs[j]["location"]+'</div>'+
				'<div class="details">'+perfs[j]["details"]+'</div>'+
				'</div>'+
				'</div>';
				
				var infowindow = new google.maps.InfoWindowZ({
					content: contentMString,
					maxWidth: 250
				});

				var marker = new google.maps.Marker({
					position: loc,
					map: map,
					title: users[i]["profileName"],
					genre: users[i]["genre"],
					date: datestr,
					contentMstr : contentMString
				});

				markers.push(marker);
				
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});

				generateList();
			}
		}
	}
	for(var i = 0; i < users.length; i++){
		perfs = users[i]["upcomingPerformances"];
		for(var j = 0; j < perfs.length; j++){
			if(dates.indexOf(datestr(perfs[j]["date"])) < 0)
				dates.push(datestr(perfs[j]["date"]));
			geocoder.geocode({address : perfs[j]["location"] +" " + users[i]["location"].split(",")[1]}, createEventFor(i,j,users, perfs));	
		}
	}

	dates.sort();
	for(var i = 0; i < dates.length; i++){
		$("#dates").append('<li ><input type="checkbox" onchange="filter()" class="datebox" value="'+dates[i]+'" id="checkbox_'+dates[i]+'" ><label for="checkbox_'+dates[i]+'">'+dates[i]+'</label></li>');	
	}

	google.maps.event.addListener(map, 'bounds_changed', generateList);

	$("#performance_list").height($("#map-canvas").height() - 100);
}
function generateList(){
	$("#performance_list").html("");
	var none = true;
	for(var i = 0; i < markers.length; i++){
		if(map.getBounds().contains(markers[i].getPosition()) && markers[i].map == map){
			$("#performance_list").append("<div class='performance' onclick='zoomInOn(markers["+i+"])' onmouseenter='setBounce("+i+")'>"+markers[i].contentMstr + "</div>");
			none = false;
		}
	}
	if(none){
		$("#performance_list").append("<div class='topSpace italic'>No events within map bounds</div>");
	}
}

function setBounce(index){
	for(var i = 0; i < markers.length; i++){
		if(i == index){
			markers[i].setAnimation(google.maps.Animation.BOUNCE);
			addStopAnimationTimeout(markers[i]);
		}
		else
			markers[i].setAnimation(null);
	}
	return false;
}

function zoomInOn(marker){
	map.setCenter(marker.position);
	map.setZoom(Math.max(map.zoom+1,15));
}

function addStopAnimationTimeout(marker){
	setTimeout(function(){
		marker.setAnimation(null);
	}, 700);
}

function filter(){
	var checkedgenres = [];
	var checkeddates = [];

	$(".genrebox:checkbox:checked").each(function(){
		checkedgenres.push(this.value);
	});

	$(".datebox:checkbox:checked").each(function(){
		checkeddates.push(this.value);
	});
	for(var i = 0; i < markers.length; i++){
		if((checkedgenres.indexOf(markers[i].genre) > -1 || checkedgenres.length == 0) && (checkeddates.indexOf(markers[i].date) > -1 || checkeddates.length == 0)) {
			if(markers[i].map != map)
				markers[i].setMap(map);
		}
		else{
			markers[i].setMap(null);
		}
	}
	generateList();
}
	
function goToCity() {
	var position = ((CITY == 'boston') ? bostonCenter: nyCenter);
	map.setCenter(position);
	map.setZoom(13);
}

function showPerformanceList(){
    $('#performance_list').toggleClass('show');
}

function toggle(thing){
	$("#"+thing+"_list").toggleClass('show');
	$("#"+thing+"click").toggleClass('glyphicon-plus');
	$("#"+thing+"click").toggleClass('glyphicon-minus');
}

google.maps.event.addDomListener(window, 'load', initialize);


