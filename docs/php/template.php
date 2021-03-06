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
    
    <link rel="shortcut icon" href="favicon.ico" />

    <link href="../styles/nouislider.css" rel="stylesheet" type="text/css">
    <link href="styles/sunburst.css" rel="stylesheet" type="text/css"/>
    <link href="styles/styles.css" rel=stylesheet type="text/css">

    <script src="scripts/prettify.js" type="text/javascript"></script>
    <script src="../scripts/jquery-1.7.2.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="../scripts/jquery.datafilters.js" type="text/javascript" charset="utf-8"></script>
    <script src="../scripts/jquery.nouislider.js" type="text/javascript" ></script>
    <script src="scripts/base.js" type="text/javascript" ></script>    
    
    <title>DataFilters | ', $title, '</title>
  </head>
<body onload="prettyPrint()">
  <div id=container>
    <div id=header>
      <h1>DataFilters jQuery Plugin</h1>
      <img src="styles/filter_data_small.png" />
  
   <!-- header div ends -->
    </div>

    <div id="navbar">
      <ul>',buildNav($selectedItem, 'navMedium'),'
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
      <ul>',buildNav($selectedItem, 'navFooter'),'</ul>
      <span class="tiny">
      e:&nbsp;<a href="mailto:alfie_thomas@hotmail.com">alfie_thomas@hotmail.com</a>
      </span>
    <!-- footer div ends -->
    </div>

  <!-- container div ends -->
<script type="text/javascript" src="scripts/respond.src.js"></script>
</body>
</html>';	
}

function buildNav($selectedItem, $className) {
    if ($selectedItem == "project") {
        $selectedItem = "gallery";
    }
	$items = array(
        array('link'=>'index.php',    'label' => 'Home',          'id' => 'home',          'class' => $className),
        array('link'=>'examples.php', 'label' => 'Examples',      'id' => 'examples',      'class' => $className), 
        array('link'=>'config.php',   'label' => 'Configuration', 'id' => 'configuration', 'class' => $className), 
        array('link'=>'download.php', 'label' => 'Download',      'id' => 'download',      'class' => $className), 
        array('link'=>'support.php',  'label' =>'Support',        'id' => 'support',       'class' => $className),
        array('link'=>'credits.php',  'label' =>'Credits',        'id' => 'credits',       'class' => $className)
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
    <script src="scripts/ios-orientationchange-fix.js"></script>
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