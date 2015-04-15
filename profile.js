$(document).ready(function() {
  var profile = getParameterByName('profile');
  var profileInfo = profileResources[profile] || profileResources.jazzyJeff;
  fillInProfileInfo(profileInfo);

  if (!profile || profile == 'jazzyJeff') {
    displayEditButton();
  }
  
  // Give all media a 4:3 ratio
  setMediaHeight();
  $(window).resize(function() {setMediaHeight()});

  $('#follow-btn').click(function() {
    var text = $('#follow-btn').text();
    $('#follow-btn').text(text === 'Follow' ? 'Following' : 'Follow');
  });

  var media = $('.gallery .thumbnail').children().clone();
  populateCarousel(media);
  $('#gallery-modal').on('show.bs.modal', function(event) {
    var invoker = $(event.relatedTarget); // Media that triggered the modal
    var activeIndex = invoker.data('index');
    setCarouselActiveIndex(activeIndex);
  });
});

var displayEditButton = function() {
  var editButton = $('<button>').addClass('btn btn-default edit-control').attr('id', 'edit-profile-btn').text('Edit Profile');
  editButton.click(function() { toggleEditMode() });
  $('#userinfo a').remove();
  $('#userinfo').prepend(editButton);
};

var displaySaveCancelButtons = function() {
  var saveButton = $('<button>').addClass('btn btn-primary edit-control').attr('id', 'save-profile-btn').text('Save Profile');
  saveButton.click(function() { toggleEditMode() });
  var cancelButton = $('<button>').addClass('btn btn-default edit-control').attr('id', 'cancel-profile-btn').text('Cancel');
  cancelButton.click(function() { toggleEditMode() });
  $('#userinfo').prepend(saveButton);
  $('#userinfo').prepend(cancelButton);
}
  

var toggleEditMode = (function() {
  var editMode = false;
  return (function() {
    editMode = !editMode;
    $('.edit-control').remove();
    if (editMode) {
      displaySaveCancelButtons();
    } else {
      displayEditButton();
    }
  });
})();

var setMediaHeight = function(ratio) {
  // Default ratio is 4:3
  if (!ratio) ratio = 0.75;
  $('.media').each(function(i, media) {
    $(media).height($(media).width() * ratio);
  });
}

var fillInProfileInfo = function(profileInfo) {
  $('#profile-name').text(profileInfo.profileName);
  $('#location').text(profileInfo.location);
  $('#genre').text(profileInfo.genre);
  $('#quote').text(profileInfo.quote);
  $('#about-me-details').text(profileInfo.aboutMe);

  $('.about-me .thumbnail').append($('<img class="img-responsive" src="' + profileInfo.profilePic.src + '">'));

  var performances = [];
  profileInfo.upcomingPerformances.forEach(function(performance) {
    performances.push($('<li>').text(performance.date + ' -- ' + performance.location));
    performances.push(performance.details);
  });
  $('#upcoming-performances-list').append(performances);

  mediaCollection = [];
  profileInfo.media.forEach(function(media, i) {
    if (media.type === 'video') {
      mediaCollection.push($('<a class="thumbnail media" data-toggle="modal" data-target="#gallery-modal" data-index="' + i + '"><iframe src="' + media.src + '" frameborder="0" allowfullscreen>'));
      //mediaCollection.push($('<div class="thumbnail media" data-index="' + i + '"><iframe src="' + media.src + '" frameborder="0" allowfullscreen>'));
    } else {
      mediaCollection.push($('<a class="thumbnail media" data-toggle="modal" data-target="#gallery-modal" data-index="' + i + '"><img class="img-responsive" src="' + media.src + '">'));
    }
  });
  mediaCollection.forEach(function(media, i) {
    if (i == 0) {
      // Put into the big frame
      $('#media-container').append($('<div class="row">').html($('<div class="col-md-8">').html(media)));
    } else if (i == 1) {
      // Put into side frame
      $('#media-container .row').append($('<div class="col-md-4">').html(media));
    } else if (i == 2) {
      // Put into side fram
      $('#media-container .col-md-4').append(media);
    } else if (i % 3 == 0) {
      // Add a new row and append
      $('#media-container').append($('<div class="row">').html($('<div class="col-md-4">').html(media)));
    } else {
      // Append to last row
      $('#media-container .row').last().append($('<div class="col-md-4">').html(media));
    }
  });
};

var populateCarousel = function(media) {
  // Populate Indicators
  var indicators = [];
  media.each(function(i, m) {
    indicators.push($('<li data-target="#gallery-carousel" data-slide-to="' + i + (i == 0 ? '" class="active' : '') + '">'));
  });
  $('.carousel-indicators').html(indicators);

  // Populate Slides
  var slides = [];
  media.each(function(i, m) {
    slides.push($('<div class="item' + (i == 0 ? ' active' : '') + ($(m).prop('tagName') == 'IFRAME' ? ' video' : '') + '">').html(m));
  });
  $('.carousel-inner').html(slides);
};

var setCarouselActiveIndex = function(activeIndex) {
  $('.carousel-indicators .active').removeClass('active');
  $('.carousel-indicators li').eq(activeIndex).addClass('active');

  $('.carousel-inner .active').removeClass('active');
  $('.carousel-inner .item').eq(activeIndex).addClass('active');
};

// CODE PROVIDED FROM:
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
