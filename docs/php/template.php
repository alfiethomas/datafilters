<?php
ob_start("ob_gzhandler");

function showPageStart($selectedItem,$title) {
echo 
'<!DOCTYPE html PUBliC "-//W3C//DTD html 4.01 Transitional//EN" "http://www.w3c.org/TR/1999/REC-html401-19991224/loose.dtd">
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="ROBOTS" content="INDEX, FOLLOW" />
    <meta http-equiv=Content-Type content=text/html;charset=UTF-8>
    <meta name="description" content="DataFilters - a jQuery pluging for lists and tables of data. Makes filtering structured data a breeze." /> 
    <meta name="keywords" content="Data, Filter, jQuery, Plugin, List, Table, Checkboxes, Sliders, Dropdowns, Dynamic" /> 
    <link type="text/css" href="static/css/styles.css" rel=stylesheet media="all">
    <title>DataFilters | ', $title, '</title>
  </head>
<body>
  <div id=container>
    <div id=header>
      <h1>DataFilters JQuery Plugin</h1>
  
   <!-- header div ends -->
    </div>

    <div id="navbar">
      <ul>',buildNav($selectedItem),'
      </ul>
    
    <!-- navbar div ends -->
    
    </div>

    <div id="',$selectedItem,'" class="main">
<!-- main content starts -->
';
}

function showPageEnd() {
echo 
'<!-- main content ends -->
    </div>
    
    <div id="footer">
      <ul>',buildNav($selectedItem),'</ul>
      <span class="tiny">
      e:&nbsp;<a href="mailto:alfie_thomas@hotmail.com">alfie_thomas@hotmail.com</a>
      </span>
    <!-- footer div ends -->
    </div>

  <!-- container div ends -->
  </div>
<script type="text/javascript" src="static/js/respond.src.js"></script>
</body>
</html>';	
}

function buildNav($selectedItem) {
    if ($selectedItem == "project") {
        $selectedItem = "gallery";
    }
	$items = array(
        array('link'=>'index.php', 'label' => 'Home', 'id' => 'home', 'class' => 'navMedium'),
        array('link'=>'download.php', 'label' => 'Download', 'id' => 'download', 'class' => 'navMedium'), 
        array('link'=>'documentation.php', 'label' => 'Documentation', 'id' => 'documentation', 'class' => 'navMedium'), 
        array('link'=>'examples.php', 'label' => 'Examples', 'id' => 'examples', 'class' => 'navMedium'), 
        array('link'=>'support.php', 'label'=>'Support', 'id' => 'support', 'class' => 'navMedium'),
        array('link'=>'credits.php', 'label'=>'Credits', 'id' => 'credits', 'class' => 'navMedium')
	);

	$myNav = "";
	foreach ($items as $val) {
		if($selectedItem == $val['id']){
				$selected=' class="selected"';
		} else {
			$selected="";
		}
		$myNav .= sprintf('
        <li class="%s"><a href="%s"%s>%s</a></li>',$val['class'],$val['link'],$selected,$val['label']);
	}
	return $myNav;
}

function preventIosTextSizeAdjustment() {

	//Instantiate the object to do our testing with.
    $uagent_obj = new uagent_info();

	// stop IOS adjusting size
	if ($uagent_obj->DetectIos() == $uagent_obj->true) {
		return
'    <style>
      html, body, form, fieldset, p, div, h1, h2, h3, h4, h5, h6 {  
        -webkit-text-size-adjust: none;  
      }
    </style>
    <script src="/static/js/ios-orientationchange-fix.js"></script>
    ';
	}
	return '';
}

function crapBerryHacks() {
    
    //Instantiate the object to do our testing with.
    $uagent_obj = new uagent_info();
    
    if ($uagent_obj->DetectBlackBerryLow() == $uagent_obj->true) {
        return '    <link href="static/css/crapberryhacks2.css" type=text/css rel=stylesheet>
';        
    } else {
        return '';
    }
}
?>