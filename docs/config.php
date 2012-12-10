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
<?php include("php/configExampletable.php"); ?></pre>

<div>
  <div id="filters"></div>

  <table id="exampleTable">
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
<?php include("php/configExampletable.php"); ?>  
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

<h2>Filters - properties</h2>
<table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th>Name</th>
        <th>Required</th>
      <th>Description</th>
    </tr>
    </thead>  
    <tbody>
    <tr>
        <td><a id="heading"></a>heading</td>
        <td>yes</td>
      <td>
        The heading to be used when displaying the filter.
      </td>
    </tr>      
    <tr>
        <td><a id="id"></a>id</td>
        <td>yes</td>
      <td>
        This identifies the data in the list to be used when generating this filter.
        <span class="break"></span>
        See explanations above for us with &lt;table&gt; and &lt;ul&gt; elements. 
      </td>
    </tr>
    <tr>
        <td><a id="dataType"></a>dataType</td>
        <td>yes</td>
      <td>
        This is used to determine how to sort the data. See <a href="#filters-dataTypes">below</a> for a list of supported types.
        <span class="break"></span>
        See explanations above for us with &lt;table&gt; and &lt;ul&gt; elements. 
      </td>
    </tr> 
    <tr>
        <td><a id="filterType"></a>filterType</td>
        <td>yes</td>
      <td>
        This is used to determine the type of filter used to filter the data. See <a href="#filters-filterTypes">below</a> for a list of supported types.
        <span class="break"></span>
        See explanations above for us with &lt;table&gt; and &lt;ul&gt; elements. 
      </td>
    </tr> 
    <tr>
        <td><a id="items"></a>items</td>
        <td>no</td>
      <td>
        If this is used, then the items used to generate the filter are the ones supplied.
        <span class="break"></span>
        This is not normally supplied and a list of unique items are dynamically generated from the data. This is the normal
        case as it is the main purpose of the plugin.
      </td>
    </tr>       
  </tbody>
</table>

<h2><a id="filters-dataTypes"></a>Filters - dataTypes</h2>
<table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th>Type</th>
      <th>Description</th>
    </tr>
    </thead>  
    <tbody>
    <tr>
        <td><a id="default"></a>default</td>
      <td>
        Use this for normal text based filtering. When comparing it just uses the default comapre behaviour of javascript.
      </td>
    </tr>
    <tr>
        <td><a id="currency"></a>currency</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="amount"></a>amount</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="period"></a>period</td>
      <td>
        
      </td>
    </tr>

  </tbody>
</table>

<h2><a id="filters-filterTypes"></a>Filters - filter types</h2>
<table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th>Type</th>
      <th>Description</th>
    </tr>
    </thead>  
    <tbody>
    <tr>
        <td><a id="select"></a>select</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="multiSelect"></a>multiSelect</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="checkboxes"></a>checkboxes</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="min"></a>min</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="max"></a>max</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="minMax"></a>minMax</td>
      <td>
        
      </td>
    </tr> 
    <tr>
        <td><a id="minWithBanding"></a>minWithBanding</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="maxWithBanding"></a>maxWithBanding</td>
      <td>
        
      </td>
    </tr>
    <tr>
        <td><a id="rangeBanding"></a>rangeBanding</td>
      <td>
        
      </td>
    </tr> 
    <tr>
        <td><a id="search"></a>search</td>
      <td>
        
      </td>
    </tr>                                            
  </tbody>
</table>

<h2>Custom Functions</h2>
<table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th>Name</th>
        <th>Default</th>
      <th>Description</th>
    </tr>
    </thead>  
    <tbody>
    <tr>
        <td><a id="extractTextFn"></a>extractTextFn</td>
        <td>function(element) { return element.text() }</td>
      <td>
        This is used to extract text from elements that need to be filtered. By default it just gets the text using the jQuery 
        <a href="http://api.jquery.com/text/">text()</a> method.
      </td>
    </tr> 
    <tr>
        <td><a id="freeTextSearchExtractTextFn"></a>freeTextSearchExtractTextFn</td>
        <td>function(element) { return element.text() }</td>
      <td>
        This is used to extract text from the row that needs to be filtered. By default it just gets the text using the jQuery 
        <a href="http://api.jquery.com/text/">text()</a> method.
      </td>
    </tr>         
    <tr>
        <td><a id="onSuccess"></a>onSuccess</td>
        <td nowrap="nowrap">function() {}</td>
      <td>
        The function that is passed in using this will be called when the initial filters have been successfully created and the page is ready for use.
      </td>
    </tr>
    <tr>
        <td><a id="onSlow"></a>onSlow</td>
        <td nowrap="nowrap">function() {}</td>
      <td>
        
      </td>
    </tr>                    
    <tr>
      <td><a id="afterFilter"></a>afterFilter</td>
      <td nowrap="nowrap">function() {}</td>
      <td>
        The function that is passed in using this will be called everytime the results have been filter. 
      </td>
    </tr>
  </tbody>
</table>




<h2>Properties</h2>
<table border="0" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th>Name</th>
        <th>Default</th>
      <th>Description</th>
    </tr>
    </thead>  
    <tbody>
    <tr>
        <td><a id="filters"></a>filters</td>
        <td>{}</td>
      <td>
        This is used for configuring which filters to apply. See separate <a href="filtersConfig" class="ref">filters configuration</a> table for more details
      </td>
    </tr>       
    <tr>
        <td><a id="pageSize"></a>pageSize</td>
        <td>-1</td>
      <td>
        Sets the page size. If this is set to $lt; 1 then paging is not used and all results are shown.
      </td>
    </tr>                 
      <tr>
        <td><a id="enableFreeTextSearch"></a>enableFreeTextSearch</td>
        <td>false</td>
      <td>
        If this is set to true it will add a search box as the first filter with a title of search. It responds to the keyup event
        and takes the current text in the search box and matches it against any text in the element being filtered. Spaces are treated
        as a word separator and the match is done as an OR type search using all the words entered. 
      </td>
    </tr>
    <tr>
        <td><a id="scrollToEnabled"></a>scrollToEnabled</td>
        <td>false</td>
      <td>
        If this is set to true, whenever a filter is updated, then page will be scrolled. If there is an element in the DOM with an id of 'scrollTo'
        then the page is scrolled to that point, otherwise it scrolls to the first instance of an element with the "paginationHolder" class, or failing 
        either of those two to the element being filtered. It has an animation length of 300ms. 
        <span class="break"></span>
        Use sparingly, can be a bit annoying if the page scrolls away from the current filters, but in some circumstances, particularly
        when you have a small filter set, it can be useful. This can be used nicely in conjunction with <a href="useApplyButton" class="ref">useApplyButton</a>.
      </td>
    </tr> 
    <tr>
        <td><a id="scrollToAnimationEnabled"></a>scrollToAnimationEnabled</td>
        <td>true</td>
      <td>
        If <a href="scrollToEnabled" class="ref">scrollToEnabled</a> is true, then this can be used to turn of animation of the scrolling.
      </td>
    </tr> 
    <tr>
        <td><a id="animationEnabled"></a>animationEnabled</td>
        <td>false</td>
      <td>
        If this is set to true, whenever a filter is updated and the results change, elements will be hidden and shown using the jQuery
        parametised methods of hide('slow') and slow('slow'). This will cause the browser to hide and show elements over a 300ms period 
        and hence the user will get a sliding type effected. 
      </td>
    </tr> 
    <tr>
        <td><a id="useShowResultsButton"></a>useShowResultsButton</td>
        <td>false</td>
      <td>
        If this is set to true, a "Show Results" button will be added to the bottom of the filters list. When clicked, the page will be 
        scrolled to the element in the DOM with an id of 'scrollTo'. If the element does not exist then the button will not do anything
        but will still be displayed.
      </td>
    </tr>
    <tr>
        <td><a id="useApplyButton"></a>useApplyButton</td>
        <td>false</td>
      <td>
        If this is set to true, an "Apply" button will be added to the bottom of the filters list. Whenever a filter us updated, the results
        list will <b>not</b> be filtered until the "Apply" button is clicked. If <a href="#scrollToEnabled" class="ref">scrollToEnabled</a> is also set to true, the page will be 
        scrolled to the element in the DOM with an id of 'scrollTo'.
      </td>
    </tr>
    <tr>
        <td><a id="slidersEnabled"></a>slidersEnabled</td>
        <td>true</td>
      <td>
        If this is set to true, then sliders are used for max / min type filters.
      </td>
    </tr> 
    <tr>
        <td><a id="itemsLabel"></a>itemsLabel</td>
        <td>"items"</td>
      <td>
        Text to show on the paging label i.e. 'Showing 1 - 10 of 20 &lt;itemsLabel&gt;'. The default is "items" so default is 'Showing 1 - 10 of 20 items'.
        Setting this to 'thingys' would result in  'Showing 1 - 10 of 20 thingys'.
      </td>
    </tr>
    <tr>
        <td><a id="itemLabel"></a>itemsLabel</td>
        <td>"item"</td>
      <td>
        See <a href="itemLabel" class="ref">itemsLabel</a> - used when only one restult returned i.e. 'Showing 1 - 10 of 20 &lt;itemLabel&gt;'
      </td>
    </tr> 
    <tr>
        <td><a id="noResultsHtml"></a>noResultsHtml</td>
        <td>"&lt;p&gt;No matching items, please modify your search criteria&lt;/p&gt;"</td>
      <td>
        This is used when no restults are returned. When the filters are initially applied, a hidden div with this html is append after the 
        element being filtered.
      </td>
    </tr>  
    <tr>
        <td><a id="disableIfSlow"></a>disableIfSlow</td>
        <td>false</td>
      <td> 
      </td>
    </tr>   
    <tr>
        <td><a id="slowTimeMs"></a>slowTimeMs</td>
        <td>1000</td>
      <td> 
      </td>
    </tr>      
    <tr>
        <td><a id="disableFreeTextIfSlow"></a>disableIfSlow</td>
        <td>false</td>
      <td> 
      </td>
    </tr>      
    <tr>
        <td><a id="useLoadingOverlayOnStartUp"></a>useLoadingOverlayOnStartUp</td>
        <td>false</td>
      <td> 
      </td>
    </tr>  
    <tr>
        <td><a id="useLoadingOverlayOnFilterIfSlow"></a>useLoadingOverlayOnFilterIfSlow</td>
        <td>false</td>
      <td> 
      </td>
    </tr>  
    <tr>
        <td><a id="useLoadingOverlayOnFilter"></a>useLoadingOverlayOnFilter</td>
        <td>false</td>
      <td> 
      </td>
    </tr>  
    <tr>
        <td><a id="loadingMinTime"></a>loadingMinTime</td>
        <td>300</td>
      <td> 
      </td>
    </tr>                                             
    </tbody>    
  </table>
</div>
<!--

      sortingDropDown: undefined,
      defaultTableSort: undefined,
-->
<?php showPageEnd(); ?>