$(document).ready(function() {
  var profile = getParameterByName('profile');
  var profileInfo = profileResources[profile] || profileResources.jazzyJeff;
  fillInProfileInfo(profileInfo);

  if (!profile || profile == 'jazzyJeff') {
    displayEditButton();
    displayQRButton();
  }
  
  // Give all media a 4:3 ratio
  setMediaHeight();
  $(window).resize(function() {setMediaHeight()});

  $('#follow-btn').click(function() {
    var text = $('#follow-btn').text();
    $('#follow-btn').text(text === 'Follow' ? 'Following' : 'Follow');
  });

  $('#add-performance-btn').click(function() {
    var i = $('#upcoming-performances-list').children().length;
    var date = $('<span>').addClass('editable hidden').attr('id', 'performance-date-' + i);
    var divider = $('<span>').addClass('editable hidden').text(' -- ');
    var location = $('<span>').addClass('editable hidden').attr('id', 'performance-location-' + i);

    dateInput = $('<div>').addClass('form-group').html($('<input>').addClass('form-control').attr('type', 'text').attr('placeholder', 'Date').attr('id', 'performance-date-' + i + '-input'));
    locationInput = $('<div>').addClass('form-group').html($('<input>').addClass('form-control').attr('type', 'text').attr('placeholder', 'Date').attr('id', 'performance-location-' + i + '-input'));
    var dateLocInputs = $('<span>').addClass('form-inline').append(dateInput).append(locationInput);

    var dateLoc = $('<li>').append(date).append(divider).append(location).append(dateLocInputs);

    var details = $('<span>').addClass('editable hidden').attr('id', 'performance-details-' + i);

    var detailsInput = $('<div>').addClass('form-group').html($('<textarea>').addClass('form-control').attr('rows', '3').attr('placeholder', 'Description').attr('id', 'performance-details-' + i + '-input'));

    $('#upcoming-performances-list').append($('<span>').append(dateLoc).append(details).append(detailsInput));
  });

  var media = $('.gallery .thumbnail').children('img, iframe').clone();
  console.log(media);
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
  saveButton.click(function() { toggleEditMode(true) });
  var cancelButton = $('<button>').addClass('btn btn-default edit-control').attr('id', 'cancel-profile-btn').text('Cancel');
  cancelButton.click(function() { toggleEditMode(false) });
  $('#userinfo').prepend(saveButton);
  $('#userinfo').prepend(cancelButton);
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
    $('.edit-control').remove();
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
    if (media.type === 'video') {
      var iframe = $('<iframe>').attr('src', media.src + '?controls=0').attr('frameborder', '0').attr('allowfullscreen', '');
      mediaCollection.push(anchor.append(iframe).append(removeButton));
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
    slides.push($('<div>').addClass('item').addClass(i == 0 ? 'active' : '').addClass($(m).prop('tagName') == 'IFRAME' ? 'video' : '').attr('data-index', i).html(m));
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
