<?php include("php/template.php"); ?>
<?php showPageStart("home", "A jQuery plugin for lists and tables of data"); ?>

<div id="content">
    <div class="textWrapper">
        <h1>Welcome</h1>
        <div class="text">
        <p>
          DataFilters is a jQuery plugin that makes filtering and sorting tables and structured lists of data a breeze. Simply configure and apply to the
          containter that holds your data, ensure you have an element with an id of 'filters' and away you go!
        </p>                
        <p>
          DataFilters can be configured to dynamically create various filtering and sorting elements such as:
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
        </div>
    </div>
</div>

<?php showPageEnd(); ?>