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
    .prepend($(document.createElement('p')).attr({"class": "refresh"}) 
    .append($(document.createElement('a')).text("clear filters").prepend($(document.createElement('img')).prop("src", "static/css/refresh.jpg")).click(function(){ 
      initFilters(); 
    })))
    .prepend($(document.createElement('p')).attr({"class": "openAll"})
    .append($(document.createElement('a')).text("open all").prepend($(document.createElement('img')).prop("src", "static/css/open.jpg")).click(function(){ 
      filterGroups(-1, true); 
      $('.openAll').hide();
      $('.closeAll').show();
    })))
    .prepend($(document.createElement('p')).attr({"class": "closeAll"})
    .append($(document.createElement('a')).text("close all").prepend($(document.createElement('img')).prop("src", "static/css/close.gif")).click(function(){ 
      filterGroups(0, true); 
      $('.openAll').show();
      $('.closeAll').hide();              
    }))); 
} 