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

$(window).resize(function() {
  $('[data-toggle="popover"]').popover('hide');
  $('.ui-autocomplete-input').autocomplete('close');
});

var showAlert = function(message) {
  $('.alert').text(message).fadeIn().css('margin-left', '-' + $('.alert').width()/2 + 'px');
  setTimeout(function() {
    $('.alert').fadeOut();
  }, 5000);
};

var setUpFollowedUsers = function() {
  var container = $('<div>');
  var followedUsersList = $('<div>').attr('id', 'followed-users-list').addClass('list-group');
  profileResources['jazzyJeff'].following.forEach(function(user) {
    var profileName = profileResources[user].profileName;
    followedUsersList.append($('<a>').addClass('list-group-item').text(profileName).attr('href', 'profile.html?profile=' + user).attr('data-user', user));
  });
  var filter = $('<div>').append($('<input>').addClass('form-control').attr('id', 'followed-users-filter').attr('placeholder', 'Enter User\'s Username')
  .on('input propertychange paste', function() {
    var value = $('#followed-users-filter').val().toLowerCase();
    followedUsersList.children().each(function(i, link) {
      var profileName = $(link).text().toLowerCase();
      var username = $(link).attr('data-user').toLowerCase();
      if (profileName.indexOf(value) == -1 && username.indexOf(value) == -1) {
        $(link).addClass('hidden');
      } else {
        $(link).removeClass('hidden');
      }
    })
  }));
  container.append(filter).append(followedUsersList);
  $('#show-followed-btn').popover({
    content: container,
    html: true,
  });
  $('#show-followed-btn').data('bs.popover').options.content = container;
}

$(document).on('click', function (e) {
  if ($(e.target).attr('id') == 'show-followed-btn') {
    $('#show-followed-btn').popover('toggle').find('#followed-users-filter');
    $('#show-inbox-btn').popover('hide');
  } else if ($(e.target).attr('id') == 'show-inbox-btn') {
    $('#show-inbox-btn').popover('toggle');
    $('#show-followed-btn').popover('hide');
  } else if (!($(e.target).hasClass('popover') || $(e.target).parents().hasClass('popover'))) {
    $('[data-toggle="popover"]').popover('hide');
  }
});

var setUpInbox = function() {
  var container = $('<div>');
  var messagesList = $('<div>').attr('id', 'inbox').addClass('list-group');
  profileResources['jazzyJeff'].messages.forEach(function(message) {
    var from = $('<div>').append($('<a>').text(profileResources[message.from].profileName).attr('href', 'profile.html?profile=' + message.from).attr('data-user', message.from));
    var body = $('<p>').text(message.body);
    messagesList.append($('<div>').addClass('list-group-item').append(from).append(body));
  });
  var filter = $('<div>').append($('<input>').addClass('form-control').attr('id', 'inbox-filter').attr('placeholder', 'Search')
  .on('input propertychange paste', function() {
    var value = $('#inbox-filter').val().toLowerCase();
    messagesList.children().each(function(i, message) {
      var from = $(message).find('a').text().toLowerCase();
      var fromUserName = $(message).find('a').attr('data-user').toLowerCase();
      var body = $(message).find('p').text().toLowerCase();
      console.log(from);
      console.log(body);
      if (from.indexOf(value) == -1 && fromUserName.indexOf(value) == -1 && body.indexOf(value) == -1) {
        $(message).addClass('hidden');
      } else {
        $(message).removeClass('hidden');
      }
    })
  }));
  container.append(filter).append(messagesList);
  $('#show-inbox-btn').popover({
    content: container,
    html: true,
  });
}
