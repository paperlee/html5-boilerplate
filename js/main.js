var prefix = [];

var IMG_SCALE = 1.4; //140% of dev width

var IMG_CENTER = -(IMG_SCALE-1)*100/2; // -20%
var IMG_LEFT_EDGE = 0; // 0%
var IMG_RIGHT_EDGE = -(IMG_SCALE-1)*100; // -40%
var TILT_LEFT_EDGE = 8;
var TILT_RIGHT_EDGE = -8;

//navbar height control
var NAVBAR_MIN_HEIGHT = 44;
var NAVBAR_MAX_HEIGHT = 180;

//TODO: use device width
var IMG_WIDTH = 320;

//TODO: mutiple cases
var current_img = [0];

//TODO: mutiple cases
var max_imgs = [3];

var speed = 500;

//TODO: mutiple cases
var pics = [];

var swipeOptions=
{
	triggerOnTouchEnd : true,	
	swipeStatus : swipeStatus,
	allowPageScroll:"vertical",
	threshold:75			
}

prefix.push($('#doSupport').html());
prefix.push($('#doTiltLR').html());
prefix.push($('#doTiltFB').html());
prefix.push($('#doDirection').html());

if (window.DeviceOrientationEvent){
	$('#doSupport').html(prefix[0]+'YES');
	window.addEventListener('deviceorientation',devOrientHandler,false);
	
} else {
	$('#doSupport').html(prefix[0]+'NO');
}

function devOrientHandler(evt){
	var tiltLR = evt.gamma;
	
	var tiltFB = evt.beta;
	
	var dir = evt.alpha;
	
	$('#doTiltLR').html(prefix[1]+tiltLR);
	$('#doTiltFB').html(prefix[2]+tiltFB);
	$('#doTiltDirection').html(prefix[3]+dir);
	
	var angle;
	//alert("go");
	//cal tilt angle
		//angle = IMG_RIGHT_EDGE + (IMG_LEFT_EDGE-IMG_RIGHT_EDGE)*(tiltLR-(TILT_RIGHT_EDGE))/(IMG_LEFT_EDGE-IMG_RIGHT_EDGE);
		angle = IMG_LEFT_EDGE + (IMG_RIGHT_EDGE-IMG_LEFT_EDGE)*(tiltLR-TILT_LEFT_EDGE)/(TILT_RIGHT_EDGE-TILT_LEFT_EDGE);
		if (angle > IMG_LEFT_EDGE){
			angle = 0;
		} else if (angle < IMG_RIGHT_EDGE) {
			angle = IMG_RIGHT_EDGE;
		} else {
			angle = angle;
		}
		//angle = 10;
		//alert(angle);
		$('#doSupport').html(prefix[0]+'YES '+angle);
		$('img#post').css('left',angle+'%');
	
}

$(document).ready(function(){
	//init
	//$('#navbar').hide();
	$(document).on('touchmove',function(e){
		//console.log($(document).scrollTop());
		if ($(document).scrollTop() >= NAVBAR_MAX_HEIGHT-NAVBAR_MIN_HEIGHT){
			$('#navbar').height(NAVBAR_MIN_HEIGHT);
		} else if ($(document).scrollTop() <= 0){
			$('#navbar').height(NAVBAR_MAX_HEIGHT)
		} else {
			$('#navbar').height(NAVBAR_MAX_HEIGHT-$(document).scrollTop());
		}
	});
	
	$(document).on('touchend',function(e){
		// To prevent in-smooth scroll evt 
		if ($(document).scrollTop() >= NAVBAR_MAX_HEIGHT-NAVBAR_MIN_HEIGHT){
			$('#navbar').height(NAVBAR_MIN_HEIGHT);
		} else if ($(document).scrollTop() <= 0){
			$('#navbar').height(NAVBAR_MAX_HEIGHT)
		} else {
			$('#navbar').height(NAVBAR_MAX_HEIGHT-$(document).scrollTop());
		}
	});
	
	$('#floor1_box>.case_description_box').click(function(e){
		$(this).children().animate({
			top:'+=60px'
		},'fast');
		$(this).fadeOut('fast');
		$('#floor1_detail_box').delay(100).slideDown('slow');
	});
	
	$('#floor1_detail_box>a.close_button').click(function(e){
		$(this).parent().slideUp('fast');
		$('#floor1_box>.case_description_box').delay(100).fadeIn('slow');
		$('#floor1_box>.case_description_box').children().animate({
			top:'-=60px'
		},'slow');
	});
	
	pics[0] = $('#floor1_box>.pics_box');
	pics[0].swipe( swipeOptions );
	
	
});

/**
* Catch each phase of the swipe.
* move : we drag the div.
* cancel : we animate back to where we were
* end : we animate to the next image
*/			
function swipeStatus(event, phase, direction, distance)
{
	//If we are moving before swipe, and we are going Lor R in X mode, or U or D in Y mode then drag.
	if( phase=="move" && (direction=="left" || direction=="right") )
	{
		var duration=0;
		
		if (direction == "left")
			scrollImages((IMG_WIDTH * current_img[0]) + distance, duration);
		
		else if (direction == "right")
			scrollImages((IMG_WIDTH * current_img[0]) - distance, duration);
		
	}
	
	else if ( phase == "cancel")
	{
		scrollImages(IMG_WIDTH * current_img[0], speed);
	}
	
	else if ( phase =="end" )
	{
		if (direction == "right")
			previousImage();
		else if (direction == "left")			
			nextImage();
	}
}

function previousImage()
{
	current_img[0] = Math.max(current_img[0]-1, 0);
	scrollImages( IMG_WIDTH * current_img[0], speed);
}

function nextImage()
{
	current_img[0] = Math.min(current_img[0]+1, max_imgs[0] - 1);
	scrollImages( IMG_WIDTH * current_img[0], speed);
}

/**
* Manuallt update the position of the imgs on drag
*/
function scrollImages(distance, duration)
{
	pics[0].css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
	
	//inverse the number we set in the css
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	
	pics[0].css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
}