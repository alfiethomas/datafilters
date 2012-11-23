function animateContent(width) {
	$(document).ready(function() {
	    if (isBigScreen()) {
			$('.textWrapper').css('padding', '1px 30px 1px 10px');
	        $('.text').jScrollPane({showArrows: true});
	        $("#content").css('marginRight', '-'+width+'px');
	        $("#content").delay(500).animate({marginRight:'0'});
	        setTimeout("switchBackground()", 2000);
	    }
	});
}

function isBigScreen() {
	return screen.width > 480 && screen.height > 480;
}

function isSmallScreen() {
	return !isBigScreen();
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
	for (var i=0; i<hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

var numImages = 4;
var currImage = 0;
var images = new Array();
images[0]="static/v5/images/background_1.jpg";
images[1]="static/v5/images/background_2.jpg";
images[2]="static/v5/images/background_3.jpg";
images[3]="static/v5/images/background_4.jpg";

function switchBackground() {
    currImage = currImage + 1;
    if (currImage >= numImages) {
        currImage = 0;
    }
    
    var img = new Image();
    $(img).load(function () {
        $(".main").css('background-image', 'url('+images[currImage]+')');  
    	setTimeout("switchBackground()", 5000);
    }).attr('src', images[currImage]);    
}

var deviceIphone = "iphone";
var deviceIpod = "ipod";

//Initialize our user agent string to lower case.
var uagent = navigator.userAgent.toLowerCase();

//**************************
// Detects if the current device is an iPhone.
function DetectIphone()
{
   if (uagent.search(deviceIphone) > -1)
      return true;
   else
      return false;
}

//**************************
// Detects if the current device is an iPod Touch.
function DetectIpod()
{
   if (uagent.search(deviceIpod) > -1)
      return true;
   else
      return false;
}

//**************************
// Detects if the current device is an iPhone or iPod Touch.
function DetectIphoneOrIpod()
{
    if (DetectIphone())
       return true;
    else if (DetectIpod())
       return true;
    else
       return false;
}