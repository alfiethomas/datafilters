/*
=========
ACCORDION
=========
*/
function filterGroups(numberToShow, updating) {
    numberToShow = parseInt(numberToShow);
    if(isNaN(numberToShow)) numberToShow = 2;
    if(numberToShow < 0) numberToShow = Number.MAX_VALUE;

    $('.filterContent').live('each', function() {
        $(this).css('height', $(this).height());
    });
  
    $(".filterContent").each(function(index) { 
        if(index < numberToShow) {
            $(this).show();
            $(this).siblings(".filterSelect").addClass("opened");
        } else {
            $(this).hide();
            $(this).siblings(".filterSelect").removeClass("opened");
        }
    });
    
    $(".filterSet").last().css('background-image', 'none');

    if (!updating) {
        $(".filterSelect").click(function () {
            $(this).next(".filterContent").slideToggle(300);
            $(this).toggleClass("opened");
            $(this).siblings(".filterSelect").removeClass("opened");
            return false;
        });
    }
}

function showFilters() {
  $("#filters").show();
  $('html, body').animate({
       scrollTop: $("#filters").offset().top
  }, 1000);

}

function hideFilters() {
  $("#filters").hide(); 
}

function onSuccessFn(){
  $('#filters')
    .prepend($(document.createElement('p')).attr({"class": "openAll"})
    .append($(document.createElement('a')).text("open all").prepend($(document.createElement('img')).prop("src", "styles/open.jpg")).click(function(){ 
      filterGroups(-1, true); 
      $('.openAll').hide();
      $('.closeAll').show();
    })))  
    .prepend($(document.createElement('p')).attr({"class": "closeAll"})
    .append($(document.createElement('a')).text("close all").prepend($(document.createElement('img')).prop("src", "styles/close.jpg")).click(function(){ 
      filterGroups(0, true); 
      $('.openAll').show();
      $('.closeAll').hide();              
    })))
    .prepend($(document.createElement('p')).attr({"class": "refresh"}) 
    .append($(document.createElement('a')).text("clear filters").prepend($(document.createElement('img')).prop("src", "styles/refresh.jpg")).click(function(){ 
      initFilters(); 
    }))); 
} 

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
*/
(function(w){
  
  // This fix addresses an iOS bug, so return early if the UA claims it's something else.
  if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ){
    return;
  }
  
    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
    x, y, z, aig;

    if( !meta ){ return; }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }
  
    function checkTilt( e ){
    aig = e.accelerationIncludingGravity;
    x = Math.abs( aig.x );
    y = Math.abs( aig.y );
    z = Math.abs( aig.z );
        
    // If portrait orientation and in one of the danger zones
        if( !w.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
      if( enabled ){
        disableZoom();
      }         
        }
    else if( !enabled ){
      restoreZoom();
        }
    }
  
  w.addEventListener( "orientationchange", restoreZoom, false );
  w.addEventListener( "devicemotion", checkTilt, false );

})( this );