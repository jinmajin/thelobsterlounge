var CITY = 'boston';
var VIEWSTATE = 'videos';

<!-- videos -->
$(document).ready(function(){
    var keys = Object.keys(profileResources);

      //reset window.localStorage when click back to main page
  // $('#mainLogo').click(function(e){
  //   e.preventDefault();
  //   console.log("HELLO");
  //   window.localStorage.clear();
  //   console.log(window.localStorage);
  // });

    document.body.onload = function(){
        if (window.localStorage['VIEWSTATE'] === 'videos'){
            $('#videoOption').click();
        }else if (window.localStorage['VIEWSTATE'] === 'events'){
            $('#events').click();
        }
        if (window.localStorage['CITY'] === 'boston'){
            $('#boston').click();
        }else if (window.localStorage['CITY'] === 'newYork'){
            $('#newyork').click();
        }
    }


    //Dropdowns
    $(".dropdown-menu li a").click(function(){
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
    });

    $('#videoOption').click(function(){
        VIEWSTATE = 'videos';
        console.log(CITY);
        window.localStorage.setItem('VIEWSTATE', VIEWSTATE);
        $("#videos_view").addClass("show");
        $("#gmap_view").removeClass("show");
    });

    $('#events').click(function(){
        VIEWSTATE = 'events';
        window.localStorage.setItem('VIEWSTATE', VIEWSTATE);
        $("#videos_view").removeClass("show");
        $("#gmap_view").addClass("show");
        google.maps.event.trigger(map, "resize");
        goToCity();
    });

    $('#boston').click(function(e){
        // console.log("clicked boston", $('#selectedFirst'));
        $('.selectedFirst').button('toggle');
        var visibleVids = document.getElementsByClassName('videoThumb');
        for (var i=0; visibleVids.length > 0; i++){
            console.log('remove!');
            $(visibleVids[0]).remove();
        }
        if ($('#empty')!=null){
            $('#empty').remove();
        }
        addAllVideos(profileResources, keys, 'boston');
        CITY = 'boston';
        window.localStorage.setItem('CITY', CITY);
        goToCity();
    });

    $('#newyork').click(function(e){
        $(".selectedFirst").button("toggle");
        if ($('#empty')!=null){
            $('#empty').remove();
        }
        var visibleVids = document.getElementsByClassName('videoThumb');
        for (var i=0; visibleVids.length > 0; i++){
            console.log('remove!');
            $(visibleVids[0]).remove();
        }
        addAllVideos(profileResources,keys, 'newYork');
        CITY = 'newYork';
        window.localStorage.setItem('CITY', CITY);
        goToCity();
    });

    // Filter buttons
    $('#all').on('click', function(e){
        switchFilter('all');
    });
    $('#music').on('click', function(e){
        switchFilter('music');
    });
    $('#juggling').on('click', function(e){
        switchFilter('juggling');
    });
    $('#acrobatics').on('click', function(e){
        switchFilter('acrobatics');
    });
    $('#other').on('click', function(e){
        switchFilter('other');

    });

    // Modal 
    $('.vidModal').on('hide.bs.modal', function () {
        // console.log($('.videoInModal')[0]);
        $('.videoInModal')[0].pause();
    });

    //empty
    function noVids(){
        var empty = document.createElement('h1');
        empty.innerHTML = 'Sorry, no videos in this city of this genre yet!';
        empty.id = 'empty';
        empty.style.textAlign = 'center';
        $(empty).insertAfter($('.videoRow'));
    }


    //Video
    function hoverPlay(name, handle){
        $('.hover').mouseover(function(){
            this.play();
        })
        $('.hover').mouseout(function(){
            this.pause();
        });

        $('.hover').on('click', function(){
            var source= $(this)[0].firstElementChild;
            if (source != null){
                makeModal(source, name, handle);
            };

    });
    }
    function switchFilter(genre){
        var visibleVids = document.getElementsByClassName('videoThumb');
        for (var i=0; visibleVids.length > 0; i++){
            console.log('remove!');
            $(visibleVids[0]).remove();
        }

        if ($('#empty')!=null){
            $('#empty').remove();
        }

        if (genre === 'all'){
                addAllVideos(profileResources,keys, CITY);

        }else{
            for(var i = 0; i < keys.length; i++){
                console.log(keys[i]);
                if (genre === 'music' && profileResources[keys[i]]['genre'] === 'Music'){
                    if (CITY === profileResources[keys[i]]['area']){
                     var shortVids = profileResources[keys[i]]['shortVids'];
                        for (j =0; j < shortVids.length; j++){
                                addVideo(shortVids[j]['src'], 'profile.html?profile='+ keys[i], profileResources[keys[i]]['profileName']);
                                hoverPlay(profileResources[keys[i]]['profileName'], keys[i]);
                        }
                    }
                }else if(genre === 'juggling'&& profileResources[keys[i]]['genre'] === 'Juggling'){
                    if (CITY === profileResources[keys[i]]['area']){
                        var shortVids = profileResources[keys[i]]['shortVids'];
                        for (j =0; j < shortVids.length; j++){
                                addVideo(shortVids[j]['src'], 'profile.html?profile='+ keys[i], profileResources[keys[i]]['profileName']);
                                hoverPlay(profileResources[keys[i]]['profileName'], keys[i]);
                        }
                    }
                }else if(genre === 'acrobatics' && profileResources[keys[i]]['genre'] === 'Acrobatics'){
                    if (CITY === profileResources[keys[i]]['area']){
                        var shortVids = profileResources[keys[i]]['shortVids'];
                        for (j =0; j < shortVids.length; j++){
                            addVideo(shortVids[j]['src'], 'profile.html?profile='+ keys[i], profileResources[keys[i]]['profileName']);
                            hoverPlay(profileResources[keys[i]]['profileName'], keys[i]);
                        }
                    }
                }
            }
            if (document.getElementsByClassName('videoThumb').length == 0){
                noVids();
            }
        }

    }

    function addVideo(src, profileLink, name){ //add name parameter
        //create div
        var div = document.createElement('div');
        div.className = 'col-md-4 videoThumb';
        div.style.textAlign = 'center';
        // div.style.backgroundColor = '#FFEAD5';
        $('.videoRow').append(div);

        //link to modal
        var a = document.createElement('a');
        a.className = 'vidClick';
        a.href = '';
        a.setAttribute('data-toggle', 'modal');
        a.setAttribute('data-target', '.vidModal');

        //video thumbnail
        var video = document.createElement('video');
        video.style.marginTop = '10px';
        video.width = '700'; video.height = '400'; //video.type = "video/mp4";
        video.className = 'img-responsive hover';
        video.loop = true;
        var source = document.createElement('source');
        source.src = src;

        //append these new elements
        video.appendChild(source);
        a.appendChild(video);
        div.appendChild(a);

        //name of artist
        var header  = document.createElement('a');
        header.innerHTML = name;
        header.href = profileLink;
        header.style.fontSize = '20px';
        header.style.color = '#2b1704';
        div.appendChild(header);

    }


    //add Modal
    function makeModal(src, name, handle){
        removeModalVideo();

        var performerName = document.createElement('h4');
        performerName.className = 'lobster';
        document.getElementById('modalHeader').href = 'profile.html?profile=' + handle;
        document.getElementById('modalHeader').style.textDecoration = 'none';
        performerName.style.textAlign = 'center';
        performerName.innerHTML = name;
        performerName.id = 'myModalLabel';
        console.log($('#modalHeader'));
        $('#modalHeader').append(performerName);
        var video = document.createElement('video');
        video.width = '700'; video.height = '400'; //video.type = "video/mp4";
        video.className = 'img-responsive videoInModal';
        video.controls = true;

        $('.modal-body').append(video);
        src.className = 'modalSource';
        $(video).append(src);
    }

    function removeModalVideo(){
        $('#myModalLabel').remove();
        var sources = document.getElementsByClassName('videoInModal');
        for (var i=0; sources.length > 0; i++){
            //remove all modal videos
            $(sources[0]).remove();
        }
    }

    //randomize
    //from stackoverflow: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function addAllVideos(profileResources,keys,city){
        var notShuffled = [];
        for(var i = 0; i < keys.length; i++){
            
            if (city === 'boston'){
                if (keys[i] === 'jazzyJeff' || keys[i] === 'jugglingGeorge'){
                    var shortVids = profileResources[keys[i]]['shortVids'];
                    for (j =0; j < shortVids.length; j++){
                        var profileLink = 'profile.html?profile='+ keys[i];
                        var videoLink = shortVids[j]['src'];
                        notShuffled.push([videoLink, profileLink, profileResources[keys[i]]['profileName'], keys[i]]);
                    }
                }
            }else if (city === 'newYork'){
                if (keys[i] === 'acrobaticAdam' || keys[i] === 'usTheDuo'){
                    var shortVids = profileResources[keys[i]]['shortVids'];
                    for (j =0; j < shortVids.length; j++){
                        var profileLink = 'profile.html?profile='+ keys[i];
                        var videoLink = shortVids[j]['src'];
                        notShuffled.push([videoLink, profileLink, profileResources[keys[i]]['profileName'], keys[i]]);
                    }
                }
            }
        }
        var shuffled = shuffleArray(notShuffled);
        for (var j = 0; j < shuffled.length; j++){
            var vid = shuffled[j][0];
            var profile = shuffled[j][1];
            var realName = shuffled[j][2];
            var handle = shuffled[j][3];
            addVideo(vid, profile, realName);
            hoverPlay(realName,handle);
        }

    }

    //When first load page
    $(".selectedFirst").button("toggle");
    addAllVideos(profileResources, keys, 'boston');
   
});