<?php
$tables = array();
$extractingSection = false;
$extractingProperty = false;
$nextLineIsProp = false;
$headingId = "";
$comment = "";
$property = "";
$handle = @fopen("../scripts/jquery.datafilters.js", "r");

$table = "";

if ($handle) {
    while (($buffer = fgets($handle, 4096)) !== false) {

        if (strpos($buffer,'/* START')) {
          $extractingSection = true;
          $heading = str_replace("/* START", "", $buffer);
          $heading = str_replace("*/", "", $heading);
          $heading = trim($heading);
          $headingId = str_replace(" ", "", $heading);
          $tableId = $headingId . "Table";
          
          $table = '

<a id="' . $headingId . '"></a>         
<h2>' . $heading . '</h2>
<table id="' . $tableId . '" border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th class="name">Name</th>
        <th class="default">Default</th>
        <th class="description">Description</th>
    </tr>
    </thead>  
    <tbody>';          

        } else if (strpos($buffer,'/* END')) {
          $extractingSection = false;
          $table = $table . '
  </tbody>
</table>';
          $tables[$headingId] = $table;
          //echo $tables[$headingId];

        } else if ($extractingSection) {

          if (strpos($buffer,'/*')) {
            $extractingProperty = true;  
          }  
          
          if ($extractingProperty) {
            $comment = $comment . $buffer;
          
          } else if ($nextLineIsProp) {
            $comment = str_replace("/*", "", $comment);
            $comment = str_replace("*/", "", $comment);
            $comment = trim($comment);
            
            $property = trim($buffer);

            if (strpos($property, "=")) {
              $propertyVar = explode("=", trim($property));
              $property = $propertyVar[0];
              $property = str_replace("var ", "", $property);
            }
            
            $propertyValues = explode(":", trim($property));
            $propertyName = trim(str_replace("\"", "", $propertyValues[0]));
            $propertyDefault = trim(htmlspecialchars($propertyValues[1]));

            $table = $table . '
      <tr>
        <td class="name"><a id="' . $propertyName . '"></a>' . $propertyName . '</td>
        <td class="default">' . str_replace(",", "", $propertyDefault) . '</td>
        <td class="description">
          ' . trim($comment) . '
        </td>
      </tr>';

            $nextLineIsProp = false;
            $property = "";
            $comment = "";
          }
          
          if (strpos($buffer,'*/')) {
            $extractingProperty = false;  
            $nextLineIsProp = true;
          }            
        } 
    }
    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($handle);
}
?>