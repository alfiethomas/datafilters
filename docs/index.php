<?php include("php/template.php"); ?>
<?php showPageStart("home", "A jQuery plugin for lists and tables of data"); ?>

<script type="text/javascript">
  $(document).ready(function() {

    $('#source').hide();
    $('#hideSource').hide();
    $('#showSource').click(function() { $('#source').slideDown('slow', function() { $('#showSource').hide(); $('#hideSource').show(); }) });
    $('#hideSource').click(function() { $('#source').slideUp('slow',   function() { $('#showSource').show(); $('#hideSource').hide(); }) });
  


  });   
</script>

<script type="text/javascript">
<?php include("php/homepageExampleJavascript.php"); ?>
</script>

<div id="content">
  <p>
    DataFilters is a jQuery plugin that makes filtering and sorting tables and structured lists of data a breeze. Simply configure and apply to the
    containter that holds your data, ensure you have an element with an id of 'filters' and away you go!
  </p>  
  <p>
    DataFilters uses your existing data and respects the current styling. It has been designed to be unintrusive. If Javascript is disabled or there is an
    error whilst enchancing the data, then the original data is left untouched. For added confidence, DataFilters is covered by an extensive test suite  
    (see <a href="support.php">support page</a> for full details.)
  </p>              
  <p>
    DataFilters can be configured to dynamically create various filtering and sorting elements such as:
  </p>
  <div class="features">
    <ul class="col1">
      <li>Checkboxes</li>
      <li>Max or Min dropdowns</li>
      <li>Max or Min sliders</li>
      <li>Range dropdowns</li>
    </ul>
    <ul class="col2">
      <li>Range Sliders</li>
      <li>Paging</li>
      <li>Apply sorting to table columns</li>
      <li>Sorting dropdowns</li>            
    </ul>
    <ul class="col3">
      <li>Single Select Dropdowns</li>
      <li>Multi Select Dropdowns</li>
    </ul>   
  </div> 
  <div style="clear: both"></div>

  <h2>A Working Example <a id="showSource">(source)</a><a id="hideSource">(hide)</a></h2>

  <div id="source">

    <h3>HTML (abbreviated)</h3>
<div class="configWrapper">    
<pre class="prettyprint">      
&lt;div id="example"&gt;         
  
&lt;!-- Placeholder for generated filters - requires an id of "filters" --&gt;
  &lt;div id="filters"&gt;Filters&lt;/div&gt;
  &lt;div id="table"&gt;

    &lt;!-- Placeholder for page info - requires a class of "pagninationHolder" --&gt;
    &lt;span class="paginationHolder"&gt;&lt;/span&gt; 

    &lt;table id="tariffTable" border="0" cellpadding="0" cellspacing="0"&gt;

      &lt;!-- Make sure you use thead and tbody --&gt;
      &lt;thead&gt;
        &lt;tr&gt;
          &lt;th class="col1 sorting sorted-asc"&gt;Monthly&lt;br/&gt;cost&lt;/th&gt;
          ...
        &lt;/tr&gt;
      &lt;/thead&gt;

      &lt;!-- Make sure you use thead and tbody --&gt;
      &lt;tbody&gt;
        &lt;tr&gt;
          &lt;td class="monthlyCost"&gt;£13&lt;span&gt;.50&lt;/span&gt;&lt;/td&gt;
          ...
        &lt;/tr&gt;
        ...
        ...
      &lt;/tbody&gt;
    &lt;/table&gt;

    &lt;!-- Paging placeholder can be used more than once --&gt;
    &lt;span class="paginationHolder"&gt;&lt;/span&gt;   

  &lt;/div&gt; &lt;!-- end table div --&gt;
&lt;/div&gt; &lt;!-- end exmple div --&gt;
</pre>
</div>    

    <h3>JavaScript</h3>
    
    <div class="configWrapper">
    <pre class="prettyprint">      
<?php include("php/homepageExampleJavascript.php"); ?>
    </pre> 
  </div>

    <h3>Result</h3><br>   
  </div>

  <div id="example" class="widetable">         
    <div id="filters">Filters</div>
    <div id="table">

<span class="paginationHolder"></span> 
<table id="tariffTable" border="0" cellpadding="0" cellspacing="0">
<thead>
<tr>
<th class="col1 sorting sorted-asc">Monthly<br/>cost</th>
<th class="col2 sorting">Phone<br/>cost</th>
<th class="col3 sorting">Tariff<br/>length</th>
<th class="col4 sorting">Minutes</th>
<th class="col5 sorting">Texts</th>
<th class="col6 sorting">Internet</th>
</tr>
</thead>
<tbody>
<tr>
<td class="monthlyCost">£13<span>.50</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>50</td>
<td>250</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£16<span>.50</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>50</td>
<td>250</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£18<span>.50</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>200</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£18<span>.50</span></td>
<td class="phoneCost">£149.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>50</td>
<td>250</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£18<span>.50</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 months</span></td>
<td>50</td>
<td>250</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£21<span>.50</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>200</td>
<td>Unlimited</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£21<span>.50</span></td>
<td class="phoneCost">£149.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>50</td>
<td>250</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£21<span>.50</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>50</td>
<td>250</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£24<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>300</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£24<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>100</td>
<td>500</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£27<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>300</td>
<td>Unlimited</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£27<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>100</td>
<td>500</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£29<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£29<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>200</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£31<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>300</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£31<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>100</td>
<td>500</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£32<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£32<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>200</td>
<td>Unlimited</td>
<td class="dataAllowance">500MB</td>
</tr>
<tr>
<td class="monthlyCost">£34<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>300</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£36<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£36<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>200</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£36<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£37<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>300</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£39<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£39<span>.00</span></td>
<td class="phoneCost">£99.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£39<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£41<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>300</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£41<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">2GB</td>
</tr>
<tr>
<td class="monthlyCost">£42<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£42<span>.00</span></td>
<td class="phoneCost">£99.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£42<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£44<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£44<span>.00</span></td>
<td class="phoneCost">£74.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£44<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£46<span>.00</span></td>
<td class="phoneCost">£99.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£46<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>600</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£47<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£47<span>.00</span></td>
<td class="phoneCost">£74.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£47<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£49<span>.00</span></td>
<td class="phoneCost">£49.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£49<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£51<span>.00</span></td>
<td class="phoneCost">£74.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£51<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>900</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£52<span>.00</span></td>
<td class="phoneCost">£49.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£52<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£56<span>.00</span></td>
<td class="phoneCost">£49.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£56<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>1200</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£60<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£63<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">24 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£65<span>.00</span></td>
<td class="phoneCost">£24.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£65<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">100MB</td>
</tr>
<tr>
<td class="monthlyCost">£68<span>.00</span></td>
<td class="phoneCost">£24.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£68<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">750MB</td>
</tr>
<tr>
<td class="monthlyCost">£72<span>.00</span></td>
<td class="phoneCost">£24.99</td>
<td><span class="lowLight">12 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
<tr>
<td class="monthlyCost">£72<span>.00</span></td>
<td class="phoneCost">Free</td>
<td><span class="lowLight">18 Months</span></td>
<td>Unlimited</td>
<td>Unlimited</td>
<td class="dataAllowance">1GB</td>
</tr>
</tbody>
</table>  
<span class="paginationHolder"></span>   
<br>
    </div> <!-- end table div -->
  </div> <!-- end exmple div -->
</div> <!-- end content div -->

<?php showPageEnd(); ?>
