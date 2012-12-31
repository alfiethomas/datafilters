<?php include("php/template.php"); ?>
<?php showPageStart("configuration", "A jQuery plugin for lists and tables of data"); ?>

<div id="content">

  <p>
    To configure the filters, first select the element to be filtered and then call the DataFilter() method on it passing in the 'init' 
    parameter along with a set of named options. The only required option is the 'filters' option that contains a list of named filters and 
    their options using standard javascript object notation.
  </p>

  <p>
    Currently the plugin supports html '&lt;table&gt;' and '&lt;ul&gt;' elements.
  </p>

  <h3>&lt;table&gt;</h2>
  <p>
    To configure filters for a &lt;table&gt;, use the format below. The 'id' attribute is the column index and uses a 1 based index - i.e. column 1 has
    an index of 1.
  </p>

<pre class="prettyprint"> 
<?php include("php/configExampleTable.php"); ?></pre>

<div>
  <div id="filters"></div>

  <table id="exampleTable" border="0" cellpadding="0" cellspacing="0">
    <thead>
      <th>Make</th>
      <th>Model</th>
      <th>Cost</th>
    </thead>
    <tbody>
      <tr>
        <td>Canon</td>
        <td>EOS 5</td>
        <td>£2000</td>
      </tr>
      <tr>
        <td>Canon</td>
        <td>EOS 500</td>
        <td>£500</td>
      </tr>      
      <tr>
        <td>Nikon</td>
        <td>X1</td>
        <td>£900</td>
      </tr> 
      <tr>
        <td>Nikon</td>
        <td>V45</td>
        <td>£200</td>
      </tr>                    
      <tr>
        <td>Minolta</td>
        <td>M7</td>
        <td>£400</td>
      </tr>                    
      <tr>
        <td>Minolta</td>
        <td>M65</td>
        <td>£250</td>
      </tr>                                
    </tbody>
  </table>
</div>

  <script type="text/javascript">
<?php include("php/configExampleTable.php"); ?>  
  </script>  

  <h3>&lt;ul&gt;</h2>
  <p>
    To configure filters for a &lt;ul&gt;, use the format below. The 'id' attribute is a class name that needs to be present in the elements that hold the 
    text to be used for that particular filter.
    an index of 1.
  </p>

<pre class="prettyprint"> 
  $('#exampleList').DataFilter('init', { 
    filters: [
      { "heading": "Filter 1", "id": "class1", "dataType": "default",  "filterType": "checkboxes"     },
      { "heading": "Filter 2", "id": "class2", "dataType": "currency", "filterType": "maxWithBanding" }
    ]      
  });</pre>  

<?php include("php/extractJsDoc.php"); ?>
<?php
echo $tables["Filters-Properties"];
echo $tables["Filters-FilterTypes"];

echo ' 
<a name="banding"></a>
<h2>Banding</h2>
Currently only works for currency. For example, £1, £3, £22, £33, £35, £45, £56 would be banded to £10, £20, £30, £40, £50, £60';

echo $tables["Filters-DataTypes"];
echo $tables["Settings"];
echo $tables["CustomFunctions"];
?>

<h2>Sort Config - TO DO</h2>

<h2>Styling - TO DO</h2>

</div>
<?php showPageEnd(); ?>