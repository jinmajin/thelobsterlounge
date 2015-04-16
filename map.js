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
    var allPerformanceLocations = ["Harvard Square", "Kendall Square", "MIT's Kresge Field"];
/*	for(var i = 0; i < keys.length; i++){
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
	} */
    
    // TO DO: make place markers hide
	//set up autocomplete
	$("#map-search-input").autocomplete({
		source : allPerformanceLocations,
		select : function(event, ui){
            if(ui.item.value === "Harvard Square") {
                $('#marker-info-harvard-square').removeClass('hide').addClass('show');
            } if(ui.item.value === "Kendall Square" || ui.item.value === "Kendall Station") {
                $('#marker-info-kendall').removeClass('hide').addClass('show');
            } if(ui.item.value === "MIT's Kresge Field") {
                $('#marker-info-kresge').removeClass('hide').addClass('show');
            }
            
		}
	});
    
    
    // clicking on markers will show info box for that marker
    $('#marker-harvard-square').click(function() {
        $('#marker-info-harvard-square').toggleClass('show');
    });
    
    $('#marker-kendall').click(function() {
        $('#marker-info-kendall').toggleClass('show');
    });
    
    $('#marker-kresge').click(function() {
        $('#marker-info-kresge').toggleClass('show');
    });

});	


// left sidebar toggle checkboxes
function filter(){
	$('#marker-info-harvard-square').removeClass('show');
	$('#marker-info-kendall').removeClass('show');
	$('#marker-info-kresge').removeClass('show');
	$("input:checkbox:checked").each(function(){
		// add $(this).val() to your array
		if(this.id == "checkbox_music" || this.id == "checkbox_late"){
			$('#marker-info-harvard-square').addClass('show');
		}
		if(this.id == "checkbox_jugg"|| this.id == "checkbox_pm"){
			$('#marker-info-kresge').addClass('show');		
		}
		if(this.id == "checkbox_jugg" || this.id == "checkbox_am"){
			$('#marker-info-kendall').addClass('show');
		}
		
	});
}

// right sidebar "View As List" button
var showPerformanceList = function() {
    console.log("showing performance list")
//    $('#view_performance_list').click(function() {
        $('.performance_list').toggleClass('show');
//    })
};