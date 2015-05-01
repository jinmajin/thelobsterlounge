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

  // Initialize all tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Set up followed users
  setUpFollowedUsers();

  // Set up inbox
  setUpInbox();

  $('.alert').hide();
});	

var showAlert = function(message) {
  $('.alert').text(message).fadeIn();
  setTimeout(function() {
    $('.alert').fadeOut();
  }, 5000);
};

var setUpFollowedUsers = function() {
  var followedUsersList = $('<div>').addClass('list-group');
  profileResources['jazzyJeff'].following.forEach(function(user) {
    followedUsersList.append($('<a>').addClass('list-group-item').text(user).attr('href', 'profile.html?profile=' + user));
  });
  $('#show-followed-btn').popover({
    content: followedUsersList,
    html: true,
  });
  $('#show-followed-btn').data('bs.popover').options.content = followedUsersList;
}

var setUpInbox = function() {
  var messagesList = $('<div>').addClass('list-group');
  profileResources['jazzyJeff'].messages.forEach(function(message) {
    var from = $('<div>').append($('<a>').text(message.from).attr('href', 'profile.html?profile=' + message.from));
    var body = $('<p>').text(message.body);
    messagesList.append($('<div>').addClass('list-group-item').append(from).append(body));
  });
  $('#show-inbox-btn').popover({
    content: messagesList,
    html: true,
  });
}
