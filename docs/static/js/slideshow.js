var isSlideshow = false;

var loading = new Image();
loading.src = "images/photo_loading.gif";

var play = new Image();
play.src = "images/play.png";

var pause = new Image();
pause.src = "images/pause.gif";

var dimages = new Array();
var curImage;

function previousImageClicked() {
	disableSlideshow();
    curImageNum = curImageNum - 1;
    showImage(curImageNum);
}

function nextImageClicked() {
    disableSlideshow();
	isSlideshow = false;
    nextImage();
}

function nextImageSlideshow() {
    if (isSlideshow) {
        nextImage();
    }
}

function showImageClicked(num) {
	disableSlideshow();
	isSlideshow = false;
	showImage(num);
}

function nextImage() {
    curImageNum = curImageNum + 1;
    showImage(curImageNum);    
}

function showImage(num) {
    curImageNum = num;
    
    if (curImageNum > numImages-1) {
        curImageNum = 0;
    }
    
    if (curImageNum < 0) {
        curImageNum = numImages - 1;
    }        
    
    curImage = new Image();
    swapPicture();    
}

function swapPicture() {
    if (document.images && getTarget()) {
        curImage.src=dimages[curImageNum];
        fadeOut(100);
    }
}

function getTarget() {
    var target=0;

    if (document.images.mainGalleryImage) {
        target=document.images.mainGalleryImage;
    }
    
    if (document.all && document.getElementById("mainGalleryImage")) {
        target=document.getElementById("mainGalleryImage");
    }
    
    return target;
}

function setOpacity(obj, opacity) {
    opacity = (opacity == 100)?99.999:opacity;
  
    // IE/Win
    obj.style.filter = "alpha(opacity:"+opacity+")";
  
    // Safari<1.2, Konqueror
    obj.style.KHTMLOpacity = opacity/100;
  
    // Older Mozilla and Firefox
    obj.style.MozOpacity = opacity/100;
  
    // Safari 1.2, newer Firefox and Mozilla, CSS3
    obj.style.opacity = opacity/100;
}

function fadeIn(opacity) {
    if (document.getElementById) {
        obj = document.getElementById("mainGalleryImage");
        if (opacity <= 100) {
            setOpacity(obj, opacity);
            opacity += 10;
            window.setTimeout("fadeIn("+opacity+")", 50);
        }
    }
}

function fadeOut(opacity) {
    if (document.getElementById) {
        obj = document.getElementById("mainGalleryImage");
        if (opacity > 0) {
            setOpacity(obj, opacity);
            opacity -= 10;
            window.setTimeout("fadeOut("+opacity+")", 50);
        } else {
            if (isSlideshow) {
                showNewImage();
            } else {
                showLoadingThenNewImage();
            }
        }
    }
}

function showLoadingThenNewImage() {
    getTarget().src = loading.src;
    setOpacity(document.getElementById("mainGalleryImage"), 100);
    if (debugLoading) {
        setTimeout("showNewImage()", 1000);
    } else {
        showNewImage();
    }
}

function showNewImage() {
    if (curImage && curImage.complete) {
        getTarget().src=curImage.src;
        fadeIn(0); 
        if (isSlideshow) {
            slideShow();
        }
    } else {
        setTimeout("showNewImage()", 200);
    }
    
}

function toggleSlideshow() {
	if (isSlideshow) {
		disableSlideshow();
	} else {
		enableSlideshow();
		setTimeout("nextImageSlideshow()", 1000);
	}
}

function disableSlideshow() {
	document.getElementById("control").innerHTML = "[ play ]";
	isSlideshow = false;
}

function enableSlideshow() {
	document.getElementById("control").innerHTML = "[ pause ]";
    isSlideshow = true;	
}

function startSlideShow() {
	getControlImage().src = pause.src;
    isSlideshow = true;
    slideShow();
}

function slideShow() {
    setTimeout("nextImageSlideshow()", 3000);
}