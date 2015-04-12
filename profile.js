$(document).ready(function() {
  var profileInfo = profileJeff;
  fillInProfileInfo(profileInfo);
  
  // Give all media a 4:3 ratio
  setMediaHeight();
  $(window).resize(function() {setMediaHeight()});

  $('#follow-btn').click(function() {
    var text = $('#follow-btn').text();
    $('#follow-btn').text(text === 'Follow' ? 'Following' : 'Follow');
  });

  $('#gallery-modal').on('show.bs.modal', function(event) {
    var invoker = $(event.relatedTarget); // Media that triggered the modal
    var activeIndex = invoker.data('index');
    var media = $('.gallery .thumbnail').children().clone();
    populateCarousel(media, activeIndex);
  });
});

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
  $('#genre').text(profileInfo.genre).prepend($('<span class="dot">').text('\267'));
  $('#quote').text(profileInfo.quote).prepend($('<span class="dot">').text('\267'));
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
      mediaCollection.push($('<div class="thumbnail media" data-index="' + i + '"><iframe src="' + media.src + '" frameborder="0" allowfullscreen>'));
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

var populateCarousel = function(media, activeIndex) {
  // Populate Indicators
  var indicators = [];
  media.each(function(i, m) {
    indicators.push($('<li data-target="#gallery-carousel" data-slide-to="' + i + (activeIndex == i ? '" class="active' : '') + '">'));
  });
  //$('.carousel-indicators').children().remove();
  $('.carousel-indicators').html(indicators);

  // Populate Slides
  var slides = [];
  media.each(function(i, m) {
    slides.push($('<div class="item' + (activeIndex == i ? ' active' : '') + '">').html(m));
  });
  //$('.carousel-inner').children().remove();
  $('.carousel-inner').html(slides);
};

// Jeff Profile Info
var profileJeff = {
  profileName: "Jazzy Jeff's Jumpin' Jam",
  location: "Boston, MA",
  genre: "Music",
  quote: "To play is to live",
  aboutMe: "I've been playing jazz in the Boston area for about 7 years now. " +
    "Before that, I used to play in Central Park NYC for 12 years. I love playing the guitar and the piano.",
  upcomingPerformances: [
    {date: "March 5, 2015", location: "Harvard Square", details: "I'll be playing my piano in the middle of the square from 5:00pm to 9:00pm"},
    {date: "March 10, 2015", location: "Kendall Station", details: "I'll play my guitar on the inbound platform all day long"},
    {date: "April 1, 2015", location: "Boston Commons", details: "I'll be playing guitar by the green line station entrance"}
  ],
  media: [
    {type: 'video', src: "https://www.youtube.com/embed/EXOyjENFQMc"},
    {type: 'image', src: "http://www.conquerblog.com/wp-content/uploads/2013/01/street-performer.jpg"},
    {type: 'image', src: "http://diymusician.cdbaby.com/wp-content/uploads/2012/05/shutterstock_82623235.jpg"},
    {type: 'image', src: "https://lifeintheblueridges.files.wordpress.com/2012/07/img_3765.jpg"},
    {type: 'image', src: "http://quirkytravelguy.com/wp-content/uploads/2012/06/street-performer.jpg"},
    {type: 'image', src: "http://nyulocal.com/wp-content/uploads/2012/04/1054.jpg"},
  ],
  profilePic: {src: "http://doge2048.com/meta/doge-600.png"},
};
