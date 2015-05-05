$(document).ready(function() {
  var profile = getParameterByName('profile') || 'jazzyJeff';
  if (readProfileResources()) {
    profileResources.jazzyJeff = readProfileResources();
  } else {
    writeProfileResources(profileResources.jazzyJeff);
  }
  var profileInfo = profileResources[profile];
  fillInProfileInfo(profileInfo);
  populateGallery(profileInfo.media);

  if (!profile || profile == 'jazzyJeff') {
    displayEditAndQRButtons();
  }
  
  $(window).resize(function() {setMediaHeight()});

  $('#send-message-btn').click(function() { showAlert('Message sent!'); });
  $('#upload-media-btn').click(function() { showAlert(profile == 'jazzyJeff' ? 'Media uploaded!' : 'Media has been sent for approval!'); });

  // Check to see if following user and set up following button accordingly
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
    writeProfileResources(profileResources.jazzyJeff);
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

  // Configure the add performance button
  $('#add-performance-btn').click(function() {
    profileInfo.upcomingPerformances.push({date: "", location: "", details: ""});
    populatePerformances(profileInfo.upcomingPerformances, true);
  });

  // Configure the save/cancel buttons
  $('#edit-profile-btn').click(function() { toggleEditMode(); });
  $('#cancel-profile-btn').click(function() {
    toggleEditMode(false);
    for (var element = deletedElements.pop(); element !== undefined; element = deletedElements.pop()) {
      if (element.media !== undefined) {
        profileResources.jazzyJeff.media.splice(element.index, 0, element.media);
      } else if (element.performance !== undefined) {
        profileResources.jazzyJeff.upcomingPerformances.splice(element.index, 0, element.performance);
      }
    };
    populateGallery(profileResources.jazzyJeff.media);
    populatePerformances(profileResources.jazzyJeff.upcomingPerformances);
    writeProfileResources(profileResources.jazzyJeff);
  });
  $('#save-profile-btn').click(function() {
    if (isValidPerformanceFields()) {
      toggleEditMode(true);
      showAlert('Changes saved');
      deletedElements = [];
    } else {
      alert('Please fill all fields for each performance');
    }
  });

  $('#gallery-modal').on('show.bs.modal', function(event) {
    var invoker = $(event.relatedTarget); // Media that triggered the modal
    var activeIndex = invoker.data('index');
    setCarouselActiveIndex(activeIndex);
  });
  $('#gallery-modal').on('shown.bs.modal', function(event) {
    setMediaHeight();
  });
  $('#gallery-modal').on('hide.bs.modal', function(event) {
    $('video').each(function(i, video) { video.pause(); });
  });
  $('#gallery-carousel').on('slid.bs.carousel', function(event) {
    setMediaHeight();
  });
  $('.carousel-control').click(function() { $('video').each(function(i, video) { video.pause(); }); setMediaHeight(); });
  $('video').on('play', function(event) {
    var index = event.currentTarget.parentElement.getAttribute('data-index');
    $('.play-btn[data-index="' + index + '"]').removeClass('glyphicon-play').addClass('glyphicon-pause');
  });
  $('video').on('pause', function(event) {
    var index = event.currentTarget.parentElement.getAttribute('data-index');
    $('.play-btn[data-index="' + index + '"]').removeClass('glyphicon-pause').addClass('glyphicon-play');
  });
});

var deletedElements = [];

var displayEditAndQRButtons = function() {
  $('#edit-profile-btn').removeClass('hidden');
  $('#generate-qr-btn').removeClass('hidden').click(function() {
    window.location.href = 'qrcode.html?url=https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.href;
  });
  $('#save-profile-btn, #cancel-profile-btn, #follow-btn, #create-message-btn').addClass('hidden');
};

var displaySaveCancelButtons = function() {
  $('#generate-qr-btn, #edit-profile-btn').addClass('hidden');
  $('#save-profile-btn, #cancel-profile-btn').removeClass('hidden');
}

var isValidPerformanceFields = function() {
  return $('.performance-input').toArray().reduce(function(prev, input) { return prev && $(input).val(); }, true);
}

var toggleEditableFields = function(nowEditable, save) {
  $('.edit-hidden').toggleClass('hidden');
  $('.editable').each(function(i, element) {
    $(element).toggleClass('hidden');
    if ($(element).attr('id')) {
      var input = $('#' + $(element).attr('id') + '-input');
      if (nowEditable) {
        if (input.attr('type') == 'date') {
          input.val(toDateInputFormat($(element).text()));
        } else {
          input.val($(element).text());
        }
      } else {
        if (save) {
          if (input.attr('id').startsWith('performance')) {
            if (input.attr('type') == 'date') {
              profileResources.jazzyJeff.upcomingPerformances[input.attr('data-index')][input.attr('data-field')] = toDateObject(input.val());
            } else {
              profileResources.jazzyJeff.upcomingPerformances[input.attr('data-index')][input.attr('data-field')] = input.val();
            }
          } else {
            profileResources.jazzyJeff[input.attr('data-field')] = input.val();
          }
        }
        input.val('');
      }
    }
  });
  // Delete empty performances
  profileResources.jazzyJeff.upcomingPerformances = profileResources.jazzyJeff.upcomingPerformances.filter(function(performance) {
    return performance.date || performance.location || performance.details;
  });
  if (!nowEditable) fillInProfileInfo(profileResources.jazzyJeff);
  writeProfileResources(profileResources.jazzyJeff);
}

var toggleEditMode = (function() {
  var editMode = false;
  return (function(save) {
    editMode = !editMode;
    toggleEditableFields(editMode, save);
    if (editMode) {
      displaySaveCancelButtons();
      setMediaDraggable();
    } else {
      displayEditAndQRButtons();
      $('.media').draggable('destroy').droppable('destroy');
    }
  });
})();

var setMediaDraggable = function() {
  $('.media').draggable({
    zIndex: 100,
    revert: 'invalid',
  }).droppable({
    drop: function(event, ui) {
      var fromIndex = $(this).attr('data-index');
      var toIndex = $(ui.draggable).attr('data-index');
      var temp = profileResources.jazzyJeff.media[fromIndex];
      profileResources.jazzyJeff.media[fromIndex] = profileResources.jazzyJeff.media[toIndex];
      profileResources.jazzyJeff.media[toIndex] = temp;
      populateGallery(profileResources.jazzyJeff.media, true);
      setMediaDraggable();
      writeProfileResources(profileResources.jazzyJeff);
    }
  });
};

var setMediaHeight = function(ratio) {
  // Default ratio is 4:3
  if (!ratio) ratio = 0.75;
  $('.media').each(function(i, media) {
    $(media).height($(media).width() * ratio);
  });
  $('video').each(function(i, video) {
    var currentRatio = $(video).width() / $(video).height();
    var adjustmentRatio = ratio * currentRatio;
    $(video).css('-webkit-transform', 'scaleY(' + adjustmentRatio + ')');
  });
  $('video').on('loadedmetadata', function(event) {
    var video = $(event.target);
    var currentRatio = video.width() / video.height();
    var adjustmentRatio = ratio * currentRatio;
    video.css('-webkit-transform', 'scaleY(' + adjustmentRatio + ')');
  });
}

var fillInProfileInfo = function(profileInfo) {
  $('#profile-name').text(profileInfo.profileName);
  $('#location').text(profileInfo.location);
  $('#genre').text(profileInfo.genre);
  $('#quote').text(profileInfo.quote);
  $('#about-me-details').text(profileInfo.aboutMe);

  $('.about-me .thumbnail').html($('<img>').addClass('img-responsive').attr('src', profileInfo.profilePic.src));

  populatePerformances(profileInfo.upcomingPerformances);
};

var populatePerformances = function(upcomingPerformances, editable) {
  var performances = [];
  upcomingPerformances.forEach(function(performance, i) {
    // Grab any existing input changes
    var dateChanges = $('#performance-date-' + i + '-input').val();
    var locationChanges = $('#performance-location-' + i + '-input').val();
    var detailsChanges = $('#performance-details-' + i + '-input').val();

    var date = $('<span>').addClass('editable').attr('id', 'performance-date-' + i).text(performance.date.month + "/" + performance.date.day + "/" + performance.date.year);
    var divider = $('<span>').addClass('editable').text(' -- ');
    var location = $('<span>').addClass('editable').attr('id', 'performance-location-' + i).text(performance.location);
    dateInput = $('<div>').addClass('form-group').html(
      $('<input>').addClass('form-control hidden edit-hidden performance-input').attr('type', 'date').attr('placeholder', 'Date').attr('data-field', 'date').attr('data-index', i).attr('id', 'performance-date-' + i + '-input'));
    dateInput.find('input').val(dateChanges || toDateInputFormat(getFormattedPerformanceDate(performance)));
    locationInput = $('<div>').addClass('form-group').html(
      $('<input>').addClass('form-control hidden edit-hidden performance-input').attr('type', 'text').attr('placeholder', 'Location').attr('data-field', 'location').attr('data-index', i).attr('id', 'performance-location-' + i + '-input'));
    locationInput.find('input').val(locationChanges || performance.location);
    var dateLocInputs = $('<span>').addClass('form-inline').append(dateInput).append(locationInput);
    var dateLoc = $('<li>').append(date).append(divider).append(location).append(dateLocInputs);

    var details = $('<span>').addClass('editable').attr('id', 'performance-details-' + i).text(performance.details);
    var detailsInput = $('<span>').addClass('form-group').html($('<textarea>').addClass('form-control hidden edit-hidden performance-input').attr('rows', '3').attr('placeholder', 'Description').attr('data-field', 'details').attr('data-index', i).attr('id', 'performance-details-' + i + '-input'));
    detailsInput.find('textarea').val(detailsChanges || performance.details);

    var performanceListing = $('<span>').append(dateLoc).append(details).append(detailsInput);

    var removeButton = $('<div>').addClass('form-group').html($('<button>').addClass('form-control hidden edit-hidden btn btn-danger glyphicon glyphicon-remove'));
    removeButton.click(function() {
      deletedElements.push({index: i, performance: performance});
      upcomingPerformances.splice(i, 1);
      populatePerformances(upcomingPerformances, true);
    });
    performanceListing.append(removeButton);
    if (editable) {
      performanceListing.find('.editable, .edit-hidden').toggleClass('hidden');
    }
    performances.push(performanceListing);
  });
  $('#upcoming-performances-list').html(performances);
}

var populateGallery = function(profileMedia, editable) {
  mediaCollection = [];
  profileMedia.forEach(function(media, i) {
    var anchor = $('<a>').addClass('thumbnail media').attr('data-toggle', 'modal').attr('data-target', '#gallery-modal').attr('data-index', i);
    var removeButton = $('<button>').addClass('btn btn-danger edit-hidden media-remove-btn glyphicon glyphicon-remove');
    if (!editable) removeButton.addClass('hidden');
    removeButton.click(function(event) {
      event.stopPropagation();
      profileMedia.splice(i, 1);
      deletedElements.push({index: i, media: media});
      populateGallery(profileMedia, true);
      setMediaDraggable();
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
  $('#media-container').html('');
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
  populateCarousel();
  setMediaHeight();
}

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

var populateCarousel = function() {
  var media = $('.gallery .thumbnail').children('img, video').clone();
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

var getFormattedPerformanceDate = function(performance) {
  return performance.date.month + '/' + performance.date.day + '/' + performance.date.year;
}

var toDateInputFormat = function(mmddyyyyFormattedDate) {
  var splitString = mmddyyyyFormattedDate.split('/')
  var month = splitString[0];
  var day = splitString[1];
  var year = splitString[2];
  return (year && month && day) ? year + '-' + month + '-' + day : "";
}

var toFormattedDateFormat = function(yyyymmddFormattedDate) {
  var splitString = yyyymmddFormattedDate.split('-')
  var year = splitString[0];
  var month = splitString[1];
  var day = splitString[2];
  return (month && day && year) ? month + '/' + day + '/' + year : "";
} 

var toDateObject = function(yyyymmddFormattedDate) {
  var splitString = yyyymmddFormattedDate.split('-')
  var year = splitString[0];
  var month = splitString[1];
  var day = splitString[2];
  return (month && day && year) ? {month: month, day: day, year: year} : undefined;
}

var writeProfileResources = function(profileResources) {
  setCookie("profileResources", JSON.stringify(profileResources));
}

var readProfileResources = function() {
  var profileResources = getCookie('profileResources');
  return profileResources ? JSON.parse(profileResources) : undefined;
}

var setCookie = function(name, value) {
  document.cookie = name + '=' + value;
}

// CODE PROVIDED FROM:
// http://www.w3schools.com/js/js_cookies.asp
var getCookie = function(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

// CODE PROVIDED FROM:
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
