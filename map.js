//-----------------------------------------Google Maps------------------------------------------//
// TODO: Trying out Google API here. map doesn't show up. Fix this!

//function initialize() {
//    var mapCanvas = document.getElementById('map-canvas');
//    var mapOptions = {
//      center: new google.maps.LatLng(-34.397, 150.644),
//      zoom: 8
//    };
//    var map = new google.maps.Map(mapCanvas,
//        mapOptions);
//
//  }
//
//google.maps.event.addDomListener(window, 'load', initialize);



//----------------------------------Map Searchbar Autocomplete----------------------------------//
$(document).ready(function(){
	var users = [];
	var keys = Object.keys(profileResources);
	var perfLocsToUser = {};
    var allPerformanceLocations = [];
	for(var i = 0; i < keys.length; i++){
		var currentUser = profileResources[keys[i]];
        users.push(currentUser["profileName"]);
        var perfs = currentUser["upcomingPerformances"];
        var perfLocs = [];
        for(var j = 0; j < perfs.length; j++) {
            var currentPerf = perfs[j];
            var currentPerfLoc = currentPerf["location"];
            perfLocs.push(currentPerfLoc);
            allPerformanceLocations.push(currentPerfLoc);
        }
        perfLocsToUser[currentUser["profileName"]] = perfLocs;
	}
    
    // TO DO: make place markers hide
	//set up autocomplete
	$("#map-search-input").autocomplete({
		source : allPerformanceLocations,
		select : function(event, ui){
//			window.location.href = "profile.html?profile="+profNameToUser[ui.item.value];
            console.log(event, ui)
		}
	});
    
//        .data("ui-autocomplete")._renderItem = function(ul, item){
//		var boldedText = String(item.value).toLowerCase().replace(this.term, "<span class='bold'>"+this.term+"</span>");
//		return $("<li>").data("ui-autocomplete-item", item).append("<a href='profile.html?profile="+profNameToUser[item.value]+"'>" + boldedText + "</a>").appendTo(ul);
});	