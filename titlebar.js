function login(){
	$("#userinfo").html('<a class="proflink" href="profile.html">Jazzy Jeff</a><input type="button" class="btn" onclick="logout()" value="Logout">');
}
function logout(){
	$("#userinfo").html('<input type="button" class="btn" onclick="login()" value="Login">');
}

$(document).ready(function(){
	var users = [];
	var keys = Object.keys(profileResources);
	var profNameToUser = {};
	for(var i = 0; i < keys.length; i++){
		users.push(profileResources[keys[i]]["profileName"]);
		profNameToUser[profileResources[keys[i]]["profileName"]] = keys[i];
	}

	//set up autocomplete
	$("#titlebar-search").autocomplete({
		source : users,
		select : function(event, ui){
			window.location.href = "profile.html?profile="+profNameToUser[ui.item.value];
		}
	}).data("ui-autocomplete")._renderItem = function(ul, item){
		var boldedText = String(item.value).toLowerCase().replace(this.term, "<span class='bold'>"+this.term+"</span>");
		return $("<li>").data("ui-autocomplete-item", item).append("<a href='profile.html?profile="+profNameToUser[item.value]+"'>" + boldedText + "</a>").appendTo(ul);
	};
});	