var minScrollPos = 0;
var prevScrollPos = 0;

//$(document).scroll(function(){
//    if ($(document).scrollTop() > prevScrollPos && $(document).scrollTop() > minScrollPos) {
//        console.log("greater than prevScrollPos");
//        if ($('#search_div').height() - $(document).scrollTop() > 200) {
//            $('#search_div').height($('#search_div').height() - $(document).scrollTop()); 
//        }
//        $('#search_div').width($('#search_div').width() - $(document).scrollTop()); 
//    } else if ($(document).scrollTop() < prevScrollPos) {
//        console.log("less than prevScrollPos");
//        $('#search_div').height($('#search_div').height() + $(document).scrollTop()); 
//        if ($('#search_div').width() + $(document).scrollTop() < 500) {
//            $('#search_div').width($('#search_div').width() + $(document).scrollTop()); 
//        }
//    }
//    prevScrollPos = $(document).scrollTop();
//});


$(window).scroll(function(){
   if($(window).scrollTop()  > 100 ){
        $("#search_div").stop().fadeTo(100, 0);
        $('#nav_bar').addClass('navbar-fixed-top').removeClass('hide').fadeTo("slow", 1);
   //     console.log("scrollTop is less than 10" + $(window).scrollTop());
  // 		$("#content").css("top", 100);
   } else {
        $("#search_div").stop().fadeTo("slow", 1);
        $('#nav_right').addClass("show");
        $('#nav_bar').removeClass('navbar-fixed-top').addClass('hide');
    //    console.log("scrollTop is greater than " + $(window).scrollTop());
   }
});


$(document).ready(function(){

	$('a[href^="#"]').on('click',function (e) {
	  // e.preventDefault();

	  var $target = $(this);

	  if(!$target.length) return;

	  $('html, body')
	    .stop()
	    .animate({
	      'scrollTop': $target.offset().top + 100
	    }, 900, 'swing', function(){
	      window.location.hash = 'content';
	    })
	//     e.preventDefault();

	//     var target = this.hash;
	//     var $target = $(target);

	//     $('html, body').stop().animate({
	//         'scrollTop': $target.offset().top
	//     }, 900, 'swing', function () {
	//         window.location.hash = target;
	//     });
	});
});


// after it goes past the break, detach and reappend to navbar?

