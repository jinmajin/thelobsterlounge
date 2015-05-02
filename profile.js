$(document).ready(function() {
  var profile = getParameterByName('profile') || 'jazzyJeff';
  var profileInfo = profileResources[profile];
  fillInProfileInfo(profileInfo);

  if (!profile || profile == 'jazzyJeff') {
    displayEditButton();
    displayQRButton();
  }
  
  // Give all media a 4:3 ratio
  setMediaHeight();
  $(window).resize(function() {setMediaHeight()});

  $('#send-message-btn').click(function() { showAlert('Message sent!'); });
  $('#upload-media-btn').click(function() { showAlert(profile == 'jazzyJeff' ? 'Media uploaded!' : 'Media has been sent for approval!'); });

  if (profileResources['jazzyJeff'].following.indexOf(profile) > -1) {
    $('#follow-btn').text('Following').addClass('btn-default');
  } else {
    $('#follow-btn').text('Follow').addClass('btn-primary');
  }
  $('#follow-btn').click(function() {
    var index = profileResources['jazzyJeff'].following.indexOf(profile);
    if (index > -1) {
      $('#follow-btn').removeClass('btn-danger btn-default').addClass('btn-primary').text('Follow');
      profileResources['jazzyJeff'].following.splice(index, 1);
    } else {
      profileResources['jazzyJeff'].following.push(profile);
      $('#follow-btn').toggleClass('btn-primary btn-default').text('Following');
      showAlert('Now Following ' + profile);
    }
    setUpFollowedUsers();
  }).hover(function() {
    if ($('#follow-btn').hasClass('btn-default')) {
      $('#follow-btn').toggleClass('btn-default btn-danger').text('Unfollow');
    }
  }, function() {
    if ($('#follow-btn').hasClass('btn-danger')) {
      $('#follow-btn').toggleClass('btn-default btn-danger').text('Following');
    }
  });

  $('#add-performance-btn').click(function() {
    var i = $('#upcoming-performances-list').children().length;
    var date = $('<span>').addClass('editable hidden').attr('id', 'performance-date-' + i);
    var divider = $('<span>').addClass('editable hidden').text(' -- ');
    var location = $('<span>').addClass('editable hidden').attr('id', 'performance-location-' + i);

    dateInput = $('<div>').addClass('form-group').html($('<input>').addClass('form-control edit-hidden').attr('type', 'text').attr('placeholder', 'Date').attr('id', 'performance-date-' + i + '-input'));
    locationInput = $('<div>').addClass('form-group').html($('<input>').addClass('form-control edit-hidden').attr('type', 'text').attr('placeholder', 'Date').attr('id', 'performance-location-' + i + '-input'));
    var dateLocInputs = $('<span>').addClass('form-inline').append(dateInput).append(locationInput);

    var dateLoc = $('<li>').append(date).append(divider).append(location).append(dateLocInputs);

    var details = $('<span>').addClass('editable hidden').attr('id', 'performance-details-' + i);

    var detailsInput = $('<div>').addClass('form-group').html($('<textarea>').addClass('form-control edit-hidden').attr('rows', '3').attr('placeholder', 'Description').attr('id', 'performance-details-' + i + '-input'));

    $('#upcoming-performances-list').append($('<span>').append(dateLoc).append(details).append(detailsInput));
  });

  $('#edit-profile-btn').click(function() { toggleEditMode(); });
  $('#cancel-profile-btn').click(function() { toggleEditMode(false); });
  $('#save-profile-btn').click(function() { toggleEditMode(true); showAlert('Changes saved'); });

  var media = $('.gallery .thumbnail').children('img, video').clone();
  populateCarousel(media);
  $('#gallery-modal').on('show.bs.modal', function(event) {
    var invoker = $(event.relatedTarget); // Media that triggered the modal
    var activeIndex = invoker.data('index');
    setCarouselActiveIndex(activeIndex);
  });
  $('#gallery-modal').on('hide.bs.modal', function(event) {
    $('video').each(function(i, video) { video.pause(); });
  });
  $('.carousel-control').click(function() { $('video').each(function(i, video) { video.pause(); }); });
  $('video').on('play', function(event) {
    var index = event.currentTarget.parentElement.getAttribute('data-index');
    $('.play-btn[data-index="' + index + '"]').removeClass('glyphicon-play').addClass('glyphicon-pause');
  });
  $('video').on('pause', function(event) {
    var index = event.currentTarget.parentElement.getAttribute('data-index');
    $('.play-btn[data-index="' + index + '"]').removeClass('glyphicon-pause').addClass('glyphicon-play');
  });
});

var displayEditButton = function() {
  $('#edit-profile-btn').removeClass('hidden');
  $('#save-profile-btn').addClass('hidden');
  $('#cancel-profile-btn').addClass('hidden');
  $('#userinfo a').addClass('hidden');
};

var displaySaveCancelButtons = function() {
  $('#edit-profile-btn').addClass('hidden');
  $('#save-profile-btn').removeClass('hidden');
  $('#cancel-profile-btn').removeClass('hidden');
}

var displayQRButton = function() {
  var qrButton = $('<button>').addClass('btn btn-primary about-me-btn').attr('id', 'generate-qr-btn').text('Generate QR Code For This Page');
  qrButton.click(function() {
    window.location.href = 'https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.href + '&size=600x600';
  });
  var container = $('<div>').addClass('col-md-12').html(qrButton);
  $('.buttons').html(container);
}

var toggleEditableFields = function(nowEditable, save) {
  $('.edit-hidden').toggleClass('hidden');
  $('.editable').each(function(i, element) {
    $(element).toggleClass('hidden');
    var input = $('#' + $(element).attr('id') + '-input');
    if (nowEditable) {
      input.val($(element).text());
    } else if (save) {
      $(element).text(input.val());
    }
  });
}

var toggleEditMode = (function() {
  var editMode = false;
  return (function(save) {
    editMode = !editMode;
    toggleEditableFields(editMode, save);
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

  $('.about-me .thumbnail').html($('<img>').addClass('img-responsive').attr('src', profileInfo.profilePic.src));

  // Populate Performances List
  var performances = [];
  profileInfo.upcomingPerformances.forEach(function(performance, i) {
    var date = $('<span>').addClass('editable').attr('id', 'performance-date-' + i).text(performance.date);
    var divider = $('<span>').addClass('editable').text(' -- ');
    var location = $('<span>').addClass('editable').attr('id', 'performance-location-' + i).text(performance.location);
    dateInput = $('<div>').addClass('form-group').html($('<input>').addClass('form-control hidden edit-hidden').attr('type', 'text').attr('placeholder', 'Date').attr('id', 'performance-date-' + i + '-input'));
    locationInput = $('<div>').addClass('form-group').html($('<input>').addClass('form-control hidden edit-hidden').attr('type', 'text').attr('placeholder', 'Date').attr('id', 'performance-location-' + i + '-input'));
    var dateLocInputs = $('<span>').addClass('form-inline').append(dateInput).append(locationInput);
    var dateLoc = $('<li>').append(date).append(divider).append(location).append(dateLocInputs);

    var details = $('<span>').addClass('editable').attr('id', 'performance-details-' + i).text(performance.details);
    var detailsInput = $('<span>').addClass('form-group').html($('<textarea>').addClass('form-control hidden edit-hidden').attr('rows', '3').attr('placeholder', 'Description').attr('id', 'performance-details-' + i + '-input'));

    var performanceListing = $('<span>').append(dateLoc).append(details).append(detailsInput);

    var removeButton = $('<div>').addClass('form-group').html($('<button>').addClass('form-control hidden edit-hidden btn btn-danger glyphicon glyphicon-remove'));
    removeButton.click(function() {
      performanceListing.remove();
    });
    performanceListing.append(removeButton);
    performances.push(performanceListing);
  });
  $('#upcoming-performances-list').html(performances);

  // Populate Gallery With Media
  mediaCollection = [];
  profileInfo.media.forEach(function(media, i) {
    var anchor = $('<a>').addClass('thumbnail media').attr('data-toggle', 'modal').attr('data-target', '#gallery-modal').attr('data-index', i);
    var removeButton = $('<button>').addClass('btn btn-danger hidden edit-hidden media-remove-btn glyphicon glyphicon-remove');
    removeButton.click(function(event) {
      event.stopPropagation();
      $('[data-index="' + i + '"]').remove();
      $('#gallery-modal').modal('hide');
    });
    var playButton = createPlayButton(i);
    if (media.type === 'video') {
      var video = $('<video>').attr('src', media.src).attr('type', 'video/mp4');
      mediaCollection.push(anchor.append(video).append(removeButton).append(playButton));
    } else {
      var img = $('<img>').addClass('img-responsive').attr('src', media.src);
      mediaCollection.push(anchor.append(img).append(removeButton));
    }
  });
  mediaCollection.forEach(function(media, i) {
    if (i == 0) {
      // Put into the big frame
      $('#media-container').append($('<div>').addClass('row').html($('<div>').addClass('col-md-8').html(media)));
    } else if (i == 1) {
      // Put into side frame
      $('#media-container .row').append($('<div>').addClass('col-md-4').html(media));
    } else if (i == 2) {
      // Put into side fram
      $('#media-container .col-md-4').append(media);
    } else if (i % 3 == 0) {
      // Add a new row and append
      $('#media-container').append($('<div>').addClass('row').html($('<div>').addClass('col-md-4').html(media)));
    } else {
      // Append to last row
      $('#media-container .row').last().append($('<div>').addClass('col-md-4').html(media));
    }
  });
};

var createPlayButton = function(index) {
  var playButton = $('<button>').addClass('btn btn-default glyphicon glyphicon-play play-btn').attr('data-index', index);
  playButton.click(function() {
    var video = $('.item[data-index="' + index + '"] video').get(0);
    if (playButton.hasClass('glyphicon-play')) {
      video.play();
    } else {
      video.pause();
    }
  });
  return playButton;
} 

var populateCarousel = function(media) {
  // Populate Indicators
  var indicators = [];
  media.each(function(i, m) {
    indicators.push($('<li>').addClass(i == 0 ? 'active' : '').attr('data-target', '#gallery-carousel').attr('data-slide-to', i).attr('data-index', i));
  });
  $('.carousel-indicators').html(indicators);

  // Populate Slides
  var slides = [];
  media.each(function(i, m) {
    var div = $('<div>').addClass('item').addClass(i == 0 ? 'active' : '').attr('data-index', i).append(m);
    if ($(m).prop('tagName') == 'VIDEO') {
      div.addClass('video');
      div.append(createPlayButton(i));
    }
    slides.push(div);
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
