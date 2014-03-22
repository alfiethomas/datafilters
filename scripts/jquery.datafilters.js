/*! http://www.datafilters.info/license.txt */

/* IE patches */
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, ''); 
  }
}

if (!window.console) console = { log: function(string){ } }; 

(function($) {

	$.fn.DataFilter = function(method, options) {

		/*
		 * See bottom of file for furhter configuration
		 */

		/* START Settings */
		var settings = $.extend( {

			/* This is used for configuring which filters to apply. See separate <a href="#filtersConfig">filters configuration</a> table for more details */
			filters: {},

			/* Use this to specify the currency symbol to be used. If not specified, £ is used. */
			currencySymbol: "£",

			/* If this is set to true it will add a search box as the first filter with a title of search. It responds to the keyup 
			event and takes the current text in the search box and matches it against any text in the element being filtered. Spaces 
			are treated as a word separator and the match is done as an OR type search using all the words entered. */
			useFreeTextSearch: false,

			/* The heading to be used for the the global free text search see <a href="#useFreeTextSearch">useFreeTextSearch</a>  */
			freeTextSearchHeading: "Search",

			/* If this is set to true, then the current state of the filter is shown in the hash or the URL. The history is not updated
			so if the users click back, they are taken to the previous page, not the previous filter state. This can be used for bookmarking and
			sharing links to a particular filter state. It also means that when you navigate away from the page and then click the back button
			the filters are re-created in the last state they were in based on the URL hash */
			hashNavigationEnabled: false,
			
			/* If this is set to true, whenever a filter is updated, then page will be scrolled. If there is an element in the DOM with 
			an id of 'scrollTo' then the page is scrolled to that point, otherwise it scrolls to the first instance of an element with the
			 "paginationHolder" class, or failing either of those two to the element being filtered. It has an animation length of 300ms.
			<br>
			Use sparingly, can be a bit annoying if the page scrolls away from the current filters, but in some circumstances, particularly 
			when you have a small filter set, it can be useful. This can be used nicely in conjunction with <a href="#useApplyButton">useApplyButton</a>. */
			scrollToEnabled: false,

			/* If <a href="#scrollToEnabled" class="ref">scrollToEnabled</a> is true, then this can be used to turn of animation of the scrolling. */
			scrollToAnimationEnabled: true,
			
			/* If this is set to true, a "Show Results" button will be added to the bottom of the filters list. When clicked, the page will 
			be scrolled to the element in the DOM with an id of 'scrollTo'. If the element does not exist then the button will not do anything 
			but will still be displayed. */
			useShowResultsButton: false,

			/*  If this is set to true, an "Apply" button will be added to the bottom of the filters list. Whenever a filter us updated, the 
			results list will not be filtered until the "Apply" button is clicked. If <a href="#scrollToEnabled" class="ref">scrollToEnabled</a> is also set to true, the page will be 
			scrolled to the element in the DOM with an id of 'scrollTo'. */
			useApplyButton: false,

			/* Sets the page size. If this is set to < 1 then paging is not used and all results are shown. */
			pageSize: -1,

			/* Maximum number of paging elements to show. For example, if they are 200 items with a page size of 10, then to start with page numbers 1 through 10
			will be shown. As you get past the middle page then the page numbers no longer start from 1. In the previous example, page 7 would show pages 3 through 12 */
			maxPagingNumbers: 10,
			
			/*  */
			sortingDropDown: undefined,

			/*  */
			sortingDropDownHeading: "Sort by",

			/* By default, if you are using a table, then sorting is applied to the table. Set this to false to disable. Each &lt;th&gt; is made clickable and a class
			of <b>sortable</b> is added to it. When selected it is sorted asc and a class of <b>sorted-asc</b> is added, if clicked again the column is sorted descending 
			and a class of <b>sorted-desc</b> is added. There will only ever be a single sorted-asc or sorted-desc across all  &lt;th&gt; elements */
			applyTableSorting: true,
			
			/* The column to sort a table by by default. Specify the column index<br>
			e.g. { "id" : 2 }<br>
			and orptionally a direction of 1 or -1 for asc/desc<br>
			e.g. { "id" : 2, "direction" : "-1" }*/
			defaultTableSort: undefined,
			
			/* If this is set to true, then sliders are used for max / min type filters. */
			slidersEnabled: true,
			
			/* Label to be used as the default option in the dropdown for a multi-select label */
			multiSelectLabel: "Select to add",
			
			/* Text to show on the paging label i.e. 'Showing 1 - 10 of 20 &lt;itemsLabel&gt;'. The default is "items" so default is 
			'Showing 1 - 10 of 20 items'. Setting this to 'thingys' would result in 'Showing 1 - 10 of 20 thingys'. */
			itemsLabel: "items",
			
			/* See <a href="#itemsLabel" class="ref">itemsLabel</a> - used when only one restult returned i.e. 'Showing 1 - 10 of 20 <itemLabel>' */
			itemLabel: "item",
			
			/* This is used when no restults are returned. When the filters are initially applied, a hidden div with this html is append 
			after the element being filtered. */
			noResultsHtml: "<p>No matching items, please modify your search criteria</p>",
			
			/* Disable plugin if browser is slow (by default 1000ms to create the filters) - can be used in conjunction with <a href="#slowTimeMs">slowTimeMs</a>.
			If this happens then the callback function <a href="onSlow">onSlow</a> is called if you need to do anything in this scenario.
			This effectively means that the web page is left as it was originally. Any other dependant changes to the DOM should be done using the callback 
			function <a href="#onSuccess">onSuccess</a> which will not be called in this case.  */
			disableIfSlow: false,
			
			/* The time in ms that if the filters take longer than to create, the plugin is deemed to be slow. See <a href="disableIfSlow">disableIfSlow</a>,
			<a href="useLoadingOverlayOnFilterIfSlow">useLoadingOverlayOnFilterIfSlow</a>, <a href="disableFreeTextIfSlow">disableFreeTextIfSlow</a> */
			slowTimeMs: 1000,

			/* See <a href="#slowTimeMs">slowTimeMs</a>. One of the options if the plugin is slow to start up */
			useLoadingOverlayOnFilterIfSlow: true,
			
			/* See <a href="#slowTimeMs">slowTimeMs</a>. One of the options if the plugin is slow to start up */
			disableFreeTextIfSlow: false,			
			
			/* If set to true, shows a "Loading overaly" everytime something is filtered. This can be used if the dataset is large and likely to take a while to 
			filter, or just for feedback to confirm something is happening. By default, the loading overlay will be shown for a minimum of 300ms so it is visible.
			This can be change using See <a href="#loadingMinTime">loadingMinTime</a> */
			useLoadingOverlayOnFilter: false,
			
			/* Text to show with the loading overlay. This is not used if the  property <a href="loadingOverlayLoadingImage">loadingOverlayLoadingImage</a> is set */
			loadingOverlayLoadingText: "Loading...",
			
			/* By default the loading overlyay use the text "Loading...". If this property is set, then no text is display and this image is used as the backlground image
			for the overlay */
			loadingOverlayLoadingImage: undefined,
			
			/* The mimimum amount of time to show the "Loading" overlay for. The default is 300ms which allows time for the user to see it, but does not fee long.
			The filtering is not blocked of this time as the loading time runs in parallel and continues if filtering not complete after specified time */
			loadingMinTime: 300,
			
			/* If this is set to true the loading overlay is shown when the filters are being created */
			useLoadingOverlayOnStartUp: false,
			
			/* If this is set to true then if there is only a single item, a filter is not shown. Can be overriden at the filter level using the same property */
			hideSingleItem: false,

			/* Set to true to log timings - <b>not recommended for use in Production</b> */
			logTiming: false,

		/* END Settings */

		/* START Custom Functions */
			/* This is used to extract text from elements that need to be filtered. By default it just gets the text using the jQuery 
			<a href="http://api.jquery.com/text/">text()</a> method. */
			extractTextFn: function(element) { return element.text() },
			
			/* This is used to extract text from the row that needs to be filtered. By default it just gets the text using the jQuery 
			<a href="http://api.jquery.com/text/">text()</a> method. */
			freeTextSearchExtractTextFn: function(element) { return element.text() },

			/* The function that is passed in using this will be called when the initial filters have been successfully created and 
			the page is ready for use. */
			onSuccess: function() {},

			/* Called when the plugin is deemed to be too slow - see <a href="disableIfSlow">disableIfSlow</a> */
			onSlow: function(time) { utils.log("Too slow to create filters - " + time + "ms, max allowed is " + settings.slowTimeMs + "ms") },

			/* The function that is passed in using this will be called everytime the results have been filter. This is function is passed 
			the current filter state as a string. This is the same string that is displayed in the URL hash if 
			<a href="#hashNavigationEnabled">hashNavigationEnabled</a> is set to true. */
			afterFilter: function(state) {},

			/* Determines how plugin logs events such as validations, errors and timings. Mainly provided as a hook for testing  */
			logFn: function(string) { console.log(string) }
		/* END Custom Functions */

		}, options);		

		var state = {
			element: $(this),
			elementId: $(this).attr("id"),
			elementType: $(this).prop('tagName'),
			aliases: {},
			reverseAliases: {},
			filtersInitialised: false,
			initialised: false,
			surpressSliderEvent: false,
			sort: {},
			tableSortedByCol: undefined,
			extractText: {},
			paging: {
				currentPage: 1,
				itemsPerPage: -1,
				defaultItemsPerPage: Number.MAX_VALUE,
				totalItems: 0,
				numMatchedItems: 0
			},
			wrapper: $(document.createElement('div')).attr("class", "filterWrapper"),
			nonExactMatch: []
		}

		var hashParamModifier = {
			"Min"    : "from_",
			"Max"    : "to_",
			"Range"  : "range_"
		}

		methods = {		

			init: function(){
				if (validate()) {
					utils.wrapFunctionWithLoading(doInit, settings.useLoadingOverlayOnStartUp);
					return this;
				
				} else {
					utils.log("Invalid use of DataFilter - check above log messages");
				}

				function validate() {
					var valid = true;
					if ($('#filters').length == 0) valid = logValidationError("No element with id 'filters'");
					if ($('.paginationHolder').length == 0) {
						logValidationWarning("No .paginationHolder class elements for paging - paging will be disabled"); 
						settings.pageSize = -1;
					}
					return valid;
				}	

				function logValidationError(message) {
					utils.log(message);
					return false;
				}

				function logValidationWarning(message) {
					utils.log(message);
				}	
			}
		}

		function doInit() {
			var start = utils.now();
			
			if (settings.useFreeTextSearch) addFreeTextSearch();

			for (var filtersIndex=0; filtersIndex<settings.filters.length; filtersIndex++) {				
				var filter = settings.filters[filtersIndex];
				initDataElement(filter);
			}

			if (settings.sortingDropDown != undefined) createSortingDropDown(settings.sortingDropDown);
			
			var filterCreationTime = logTiming("doInt>created", start);
			var isSlow = filterCreationTime > settings.slowTimeMs;

			if (settings.disableIfSlow && isSlow) {
				settings.onSlow(filterCreationTime);
			
			} else {
				if (isSlow) handleSlowness();
				applyToFiltersElement();
				logTiming("doInt>applied", start);

				applySorting();
				logTiming("doInt>sorting", start);

				addNoResultsHolder();
				logTiming("doInt>no results", start);

				addModalDiv();
				logTiming("doInt>modal div", start);

				ready(settings.pageSize);
				logTiming("doInt>ready", start);			
				
				settings.onSuccess();
				logTiming("doInt>success", start);
			}

			logTiming("doInt>initialised", start);
		}

		function logTiming(msg, start) {
			var time = utils.now() - start;
			if (settings.logTiming) utils.log(msg+":" + time);
			return time;
		}


		function handleSlowness() {
			if (settings.useLoadingOverlayOnFilterIfSlow) {
				settings.useLoadingOverlayOnFilter = true;
				settings.animationEnabled = false;
			}

			if (settings.disableFreeTextIfSlow) $('freeTextSearch').remove();
		}

		function addNoResultsHolder() {
			if (!utils.exists("#noFilterResults")) {
				state.element.after($('<div/>').attr("id", "noFilterResults").html(settings.noResultsHtml).hide());
			}
		}

		function addModalDiv() {
			if ((settings.useLoadingOverlayOnFilter || settings.useLoadingOverlayOnStartUp || settings.useLoadingOverlayOnFilterIfSlow) &&
					!utils.exists($('#dataFiltersModal'))) {

				var modalDiv = $('<div/>').attr({'id': 'dataFiltersModal', 'class': 'overlay'});
				if (!settings.loadingOverlayLoadingImage) modalDiv.append($('<p/>').prop('class', 'overlay').text(settings.loadingOverlayLoadingText));
				$('body').append(modalDiv);

				$("<style type='text/css'> " +
					"#dataFiltersModal, #dataFiltersModal p {" +
					"    display:    none;" +
					"    position:   fixed;" +
					"    z-index:    1000;" +
					"    top:        0;" +
					"    left:       0;" +
					"    height:     100%;" +
					"    width:      100%;" +
					"    opacity: 	 0.85;" +
					"	 -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=85)';" +
					"	 filter:     alpha(opacity=85);" + 
					"    background:  white 50% 50% no-repeat;" +
					((settings.loadingOverlayLoadingImage) ? "background-image: url("+settings.loadingOverlayLoadingImage+")" : "") +
					"}" +
					"#dataFiltersModal p {" +
					"    position: relative;" +
					"    color: black;" +
					"    top: 45%;" +
					"    text-align: center;" +
					"}" +
					"body.loading {" +
					"    overflow: hidden;" +
					"}" +
					"body.loading #dataFiltersModal, #dataFiltersModal p {" +
					"    display: block;" +
					"}​ </style>").appendTo("head");
			}
		}

		function applyToFiltersElement() {
			$('#filters').empty();
			$('#filters').append(state.wrapper);
		}

		function applySorting() {
			if (state.elementType == "TABLE" && settings.applyTableSorting) applyTableSorting();	
			if (settings.sortingDropDown != undefined) selectDefaultSortingDropdownItem(settings.sortingDropDown); 			
		}

		function initDataElement(config) {

		  /* START Filters - Properties */
			/* The heading to be used when displaying the filter. Note this will escape HTML */
			var heading = config.heading;

			/* Additional html for heading that will not be part of the header link. Note this can contain HTML */
			var headingHtml = config.headingHtml;

			/* This identifies the data in the list to be used when generating this filter. 
			<span class="break"></span> 
			See explanations above for us with &lt;table&gt; and &lt;ul&gt; elements. */
			var id = config.id;	

			/* This is used to determine how to sort the data. See <a href="#Filters-DataTypes">below</a> for a list of supported types. 
			<span class="break"></span>
			See explanations above for us with &lt;table&gt; and &lt;ul&gt; elements. */
			var dataType = config.dataType;

			/* This is used to determine the type of filter used to filter the data. See <a href="#Filters-FilterTypes">below</a> for a list of supported types.
			<span class="break"></span>
			See explanations above for us with &lt;table&gt; and &lt;ul&gt; elements. */
			var filterType = config.filterType;

			/* Alias to be used. This is used for pre-selecting filter options using the query string */
			var alias = config.alias;

			/* If this is used, then the items used to generate the filter are the ones supplied.
			<span class="break"></span> 
			This is not normally supplied and a list of unique items are dynamically generated from the data. This is the normal
			case as it is the main purpose of the plugin. */
			var items = config.items;

			/* If this is set to true then if there is only a single item, this fitler is not shown. This overrides the global option */
			var hideSingleItem = config.hideSingleItem;

			/*  */
			var extractTextFn = config.extractTextFn;
		  /* END Filters - Properties */

			state.filtersInitialised = false;
			sortFn = compareFunctionForDataType[dataType]
			state.sort[id] = sortFn;
			
			if (extractTextFn) state.extractText[id] = extractTextFn;

			if (filterType == "sortOnly") return;

			state.aliases[id] = alias;
			state.reverseAliases[alias] = id;
			factoryFn = factoryFunctionForFilterType[filterType];

			if (heading && id && factoryFn && sortFn) { 

				if (items == undefined) {
					var data = functionsForElementType[state.elementType].getAllDataForGivenIdFn(id);
					items = extractUniqueValues(data, sortFn, id);
				
				} else {
					checkForNonExactMatches(items, id);
				}

				if (shouldShowElement(items, id, heading, hideSingleItem)) {
					createFilterGroup(id, heading, headingHtml, factoryFn, items);	
				}
			
			} else {
				utils.log("Can not create filter for id '" + id + "' so '" + heading + "' with filterType '" + filterType + 
					"' and dataType '" + dataType + "' not added as a filter");
			}
		};

		function checkForNonExactMatches(items, id) {
			for (var i=0; i<items.length; i++) {
				if (utils.startsWith(items[i], "~")) {
					var newString = items[i].substring(1);
					items[i] = newString;
					state.nonExactMatch.push(id+"_"+newString);
				}
			}
		}

		function shouldShowElement(items, id, heading, hideSingleItem ) {
			if (items.length == 0) {
				utils.log("No items found for id '" + id + "' so '" + heading + "' not added as a filter");
				return false;
			}

			if (items.length == 1) {
				var shouldShow = (hideSingleItem != undefined) ? !hideSingleItem : !settings.hideSingleItem;
				if (!shouldShow) {
					utils.log("Only 1 item found for id '" + id + "' so '" + heading + "' not added as a filter");	
					return false;
				}
			}

			return true;
		}

		function ready(itemsPerPageValue) {
			state.filtersInitialised = true;
			state.paging.defaultItemsPerPage = itemsPerPageValue;
			doPaging(getInitialPageNumber(), getInitialPageSize(itemsPerPageValue));	

			if (settings.useApplyButton) {
				addButton("Apply Filters", "applyFilter", filter);

			} else if (settings.useShowResultsButton) {
				addButton("Show Results", "showResults", function() { doScrollToResults(true) });
			}

			if (settings.defaultTableSort) {
				var th = $('#'+state.elementId+' thead th:nth-child('+settings.defaultTableSort.id+')');
				th.click();
				if (settings.defaultTableSort.direction && settings.defaultTableSort.direction == "-1") th.click(); 
			}

			setTimeout(function() { state.initialised = true }, 1);
		}

		function getInitialPageNumber() {
			var pageNumber = utils.getHashParameter("page");
			return (pageNumber) ? pageNumber : 1;
		}

		function getInitialPageSize(itemsPerPageValue) {
			var showAll = utils.getHashParameter("showAll");
			return (showAll) ? -1 : itemsPerPageValue;
		}		

		function addButton(text, id, clickFn) {
			var btn = $("<button/>").attr({"type": "button", "id": id, "class": "btn-style"}).click(function() { 
				clickFn(); 
			}).text(text);

			if(id == "applyFilter") {
				state.wrapper.append($("<div/>").attr({"class": "applyBtnDiv"}).append(btn));
			} else {
				state.wrapper.append($("<div/>").append(btn));
			}
		}

		function extractUniqueValues(data, sortFn, index) {
			var items=[];
			data.each(function(){
				var text = extractText($(this), index).trim();
			   if (text.length > 0 && !utils.inArrayIgnoreCase(text, items)) items.push(text);       
			});

			compare.sortItems(items, sortFn);
			return items;
		}

		function getAllDataForTable() {
			return $('#'+state.elementId+' tbody tr');			
		}

		function getAllDataForList() {
			return $('ul#'+state.elementId+'>li');
		}

		function getAllDataForColumnFromTable(oneBasedIndex) {
			return $('#'+state.elementId+' tbody tr td:nth-child('+oneBasedIndex+')');
		}

		function getAllDataForIdFromList(clazz) {
			return $('ul#'+state.elementId+'>li .'+clazz);
		}

		function extratcTextFromTableCell(row, index) {
			return extractText($(row).children('td').eq(index), index);
		}

		function extractTextFromListElement(row, index) {
			return extractText($(row).find('.'+index), index);
		}	

		function extractText(element, index) {
			return (state.extractText[index]) ? state.extractText[index](element) : settings.extractTextFn(element);
		}	

		function doPaging(page, itemsPerPageValue) {
			if (page) state.paging.currentPage = page;
			if (state.paging.currentPage <= 0) state.paging.currentPage = 1;

			if (itemsPerPageValue) state.paging.itemsPerPage = parseInt(itemsPerPageValue);
			if (state.paging.itemsPerPage <= 0) state.paging.itemsPerPage = Number.MAX_VALUE;

			showRows();
		}

		function filterAfterChange() {
			if(!settings.useApplyButton) filter();
		}

		function filter() {
			state.paging.currentPage = 1;
			showRows();
		}		

		function showRows() {
			utils.wrapFunctionWithLoading(function() {
				doShowRows();
			}, settings.useLoadingOverlayOnFilter && state.filtersInitialised);
		}

		function doShowRows() {
			if (!state.filtersInitialised) {
				return;	
			} 

			var start = utils.now();
			var searches = {};
			$('#filters [data-role="filterSetSelector"]').each(function () {
				var type = this.id.split("_")[0];
				var index = this.id.split("_")[1];

				switch (type) {
					case "Select"           : addToSearches(searches, index, getSearchStringForSelect(this.id)); break;
					case "MultiSelect"      : addToSearches(searches, index, getSearchStringForMultiSelect(this.id)); break;
					case "Checkboxes"       : addToSearches(searches, index, getSearchStringForCheckboxGroup(this.id)); break;
					case "CheckboxesRange"  : addCheckboxesRangeSearcehs(searches, index); break;
					case "Max"              : addToSearches(searches, index, getSearchStringForMaxSelect(this.id)); break;
					case "Min"              : addToSearches(searches, index, getSearchStringForMinSelect(this.id)); break;
					case "freeTextSearch"   : addToSearches(searches, index, getSearchStringForSearch(this.id)); break;
				}
			});
			logTiming("doShowRows>searches", start);

			filterRows(matches, searches);
			logTiming("doShowRows>filterRows", start);

			createPagination();
			logTiming("doShowRows>createPagination", start);

			scrollToResults();
			logTiming("doShowRows>scrollToResults", start);

			checkForNoResults();
			logTiming("doShowRows>checkForNoResults", start);

			var hash = updateUriHash(searches);
			logTiming("doShowRows>udateUriHash", start);			

			settings.afterFilter(hash);
			logTiming("doShowRows>afterFilter", start);
		}

		function updateUriHash(searches) {
			addToSearches(searches, "search", getFreeTextSearchValue());
			if (settings.sortingDropDown) addToSearches(searches, "sortBy", getCurrentSortState());
			if (state.tableSortedByCol)   addToSearches(searches, "sortyByColumn", state.tableSortedByCol);

			if (state.paging.itemsPerPage <= 0 || state.paging.itemsPerPage == Number.MAX_VALUE) {
				addToSearches(searches, "showAll", "true");
			} else {
				addToSearches(searches, "page", state.paging.currentPage+"");
			}

			var hash = "";
			$.each(searches, function(id, searchStrings) {
				$.each(searchStrings, function(index, searchString) {
					searchString= escapeHashString(searchString);
					if (searchString.length > 0) {
						var searchStringTokens = searchString.split("|");
						$.each(searchStringTokens, function(index, searchString) {
							if (hash.length > 0) hash += "&"; 
							hash += utils.getIdAlias(id)+"="+searchString;
						});
					}
				});
			});
			
			hash = utils.replaceAll(hash, " ", "+");

			if (settings.hashNavigationEnabled) {
				window.location.replace((''+window.location).split('#')[0] + '#' + hash);
			}

			return hash;
		}

		function escapeHashString(string) {
			string = utils.replaceAll(string, "Show All", "");
			string = utils.replaceAll(string, "--MAX--_", "to_")
			string = utils.replaceAll(string, "--MIN--_", "from_")
			string = utils.replaceAll(string, "--RANGE--_", "range_");
			string = removeWordBoundaryMarkers(string); 
			string = removeRegexForFreeText(string);
			return (utils.endsWith(string, "_")) ? "" : utils.unEscapeRegex(string);
		}

		function removeWordBoundaryMarkers(text) {
			return utils.replaceAll(text, "\\\\b", "");
		}

		function removeRegexForFreeText(text) {
			return (utils.startsWith(text, "(?=.*")) ? text.substring(5, text.length-1) : text; 
		}

		function showLoading() { 
			$('body').addClass("loading");
			if(navigator.userAgent.match(/(iPhone|iPod|MSIE)/i)) $('#dataFiltersModal').css('postion', 'absolute').css('top', ((-($('html').offset().top))+25)+'px') 
		}

		function hideLoading() { 
			$('body').removeClass("loading"); 
		} 		

		function scrollToResults() {
			if (settings.scrollToEnabled  && state.initialised) {
				doScrollToResults(settings.useApplyButton || settings.useShowResultsButton);
			}
		}

		function doScrollToResults(forceScroll) {
			var scrollToElement = utils.exists($("#scrollTo")) ? $("#scrollTo") : utils.exists($(".paginationHolder")) ? $(".paginationHolder").eq(0) : state.element;

			if (forceScroll || (getPageOffset() > scrollToElement.offset().top)) {
				if (settings.scrollToAnimationEnabled) { 
					$('html, body').animate({ scrollTop: scrollToElement.offset().top }, 300);			
				} else {
					$('html, body').scrollTop(scrollToElement.offset().top);
				}
			}
		}

		function getPageOffset() {
			return (-$('html, body').offset().top > $('html, body').scrollTop()) ? -$('html, body').offset().top : $('html, body').scrollTop();
		}

		function addToSearches(searches, index, searchString) {
			if (searches[index]) {
				searches[index].push(searchString);
			} else {
				searches[index] = [searchString];
			}
		}

		/* Note: minimise calls to show() & hide() as it causes a reflow, so set temp attribute and change at end in one go */
		function filterRows(matches, searches) {
			var visibleItems = 0;
			state.paging.totalItems = 0;
			state.paging.numMatchedItems = 0;

			var data = functionsForElementType[state.elementType].getAllDataFn();
			data.each(function() {
				var matched = matches(this, searches);
				state.paging.totalItems++;

				if (matched) {

					if (shouldShowItem(visibleItems)) {
						$(this).attr("showHide", "show");
						visibleItems++; 
					} else {
						$(this).attr("showHide", "hide");
					}

					state.paging.numMatchedItems++;	

				} else {                  
					$(this).attr("showHide", "hide");
				}
			});	

			$(state.element).find('[showHide="hide"]').hide();
			$(state.element).find('[showHide="show"]').show();

			setTimeout(function(){ hideThenShowToFixLayoutIssues() }, 1);
		}

		function hideThenShowToFixLayoutIssues() {
			$(state.element).find('[showHide="show"]').hide().show();
		}

		/* optimised to only redraw if required */
		function checkForNoResults() {
			if (state.paging.numMatchedItems == 0) {
				$('#noFilterResults').show();
				$('.paginationHolder').hide();
			
			} else if (state.paging.numMatchedItems > 0) {
				$('#noFilterResults').hide();
				$('.paginationHolder').show();
			}
		}

		function shouldShowItem(visibleItems) {
			return state.paging.numMatchedItems >= (state.paging.currentPage-1) * state.paging.itemsPerPage
				&& visibleItems < state.paging.itemsPerPage;
		}

		function matches(row, searches, counts) {
			var matched = true;
			$.each(searches, function(columnIndex, value) {
				if (state.elementType == "TABLE") columnIndex = parseInt(columnIndex)-1;
				$.each(value, function(searchIndex) { 
					if(matched) matched = doMatch(row, columnIndex, value[searchIndex]); 
				});
				if (!matched) return false;
			});

			if (getFreeTextSearchValue() != "" && matched) {
				matched = matchesRegex(settings.freeTextSearchExtractTextFn($(row)), getAndRegex($('#freeTextSearch').val().trim()));
			}

			return matched;	
		}

		function getFreeTextSearchValue() {
			return (settings.useFreeTextSearch) ? $('#freeTextSearch').val().trim() : "";
		}

		function getAndRegex(text) {
			var regex = "";
			var tokens = text.split(" ");
			for (var i=0; i<tokens.length; i++) {
				regex += "(?=.*"+tokens[i]+")";
			}
			return regex;
		}

		function doMatch(row, index, value) {
			var cellText = functionsForElementType[state.elementType].extractTextFn(row, index);

			if (utils.startsWith(value, "--MAX--") || utils.startsWith(value, "--MIN--")) { 
				return matchesMaxMin(index, cellText, value);

			} else if (utils.startsWith(value, "--RANGE--")) { 
				return matchesRanges(index, cellText, value);

			} else {
				return matchesRegex(cellText, value);
			}
		}

		function matchesRegex(text, regex) {
			text = utils.convertToSingleLine(text);
			return text.search(new RegExp(regex, "i")) > -1;
		}

		function matchesRanges(index, value, ranges) {
			var atLeastOneMactch = false;
			var rangesArray = ranges.split('--RANGE--_');

			for (var i=0; i<rangesArray.length; i++) {
				if (rangesArray[i].trim().length > 0) {
					atLeastOneMactch = atLeastOneMactch || matchesRange(index, value, rangesArray[i]);
				}
			}
			return atLeastOneMactch;
		}

		function matchesRange(index, value, range) {
			range = utils.replaceAll(range, "up to ", settings.currencySymbol + "0 - ");

			var values = range.split(' - ');
			if (values.length == 1) values[1] = values[0];

			var compareFn = getSortFunctionForColumn(index);
			var matched = compareFn(values[0], value, -1) >= 0 && compareFn(values[1], value, 1) >= 0;
			return matched;
		}

		function matchesMaxMin(index, value, maxMin) {
			var maxMinValue = maxMin.split('_')[1];
			var compareFn = getSortFunctionForColumn(index);
			var sortDirction = utils.contains(maxMin, "--MAX--_") ? 1 : -1;
			var matched = (maxMinValue == "Show All") ? true : compareFn(maxMinValue, value, sortDirction) >= 0;
			return matched;
		}

		function getSearchStringForSearch(id) {
			return getAndRegex($('#'+id).val().trim());
		}

		function getSearchStringArrayForMinMaxSelect(index) {
			return [
				getSearchStringForMaxSelect("Max_"+index), 
				getSearchStringForMinSelect("Min_"+index)
			];
		}	

		function getSearchStringForMaxSelect(id) { return getSearchStringForMinMaxSelect(id, "--MAX--_"); }
		function getSearchStringForMinSelect(id) { return getSearchStringForMinMaxSelect(id, "--MIN--_"); }

		function getSearchStringForMinMaxSelect(id, type) {
			return type + $('select#'+id+'>option:selected').val();
		}			

		function getSearchStringForSelect(id) {
			return $('select#'+id+' option:selected').prop("value");
		}

		function getSearchStringForMultiSelect(id) {
			var searchString = "";
			id = id.split("_")[1];
			$('#MultiSelectItems_'+id+' p').each(function () {
				searchString += addToSearchString(searchString, $(this).text(), id);
			});
			return searchString;
		}		

		function getSearchStringForCheckboxGroup(id) {
			var searchString = "";
			var index = id.split("_")[1];
			$('ul#'+id+' li input[type=checkbox]').each(function () {
				if ($(this).prop("checked") && $(this).prop("name") != "All") searchString += addToSearchString(searchString, $(this).prop("name"), index);
			});
			return searchString;
		}

		function addCheckboxesRangeSearcehs(searches, index) {
			var rangeSearches = "";
			$('ul#CheckboxesRange_'+index+' li input[type=checkbox]').each(function () {
				if ($(this).prop("checked") && $(this).prop("name") != "All") {
					rangeSearches += "--RANGE--_" + $(this).parent().text();
				}
			});
			addToSearches(searches, index, rangeSearches);
		}		

		function addToSearchString(searchString, value, id) {
			value = utils.escapeRegex(value);
			var searchToAdd = addWordBoundaryMatchForExactMatches(value, id);
			return (searchString=="" ? searchToAdd : "|" + searchToAdd); 
		}

		function addWordBoundaryMatchForExactMatches(value, id) {
			var nonExactMatch = $.inArray(id+"_"+value, state.nonExactMatch) > -1;
			return (nonExactMatch) ? value : matchWordOnly(value, id) ;
		}

		function matchWordOnly(word, id) {
			if (utils.startsAndEndsWithWordCharacter(word)) {
				return "\\b" + word + "\\b";
			} else {
				return word;
			}
		}

		function createFilterGroup(index, heading, headingHtml, factoryFn, items) {
			wrapInFilterGroup(heading, headingHtml, factoryFn(items, index));
		}	

		function wrapInFilterGroup(heading, headingHtml, element, prepend) {
			var filterDiv = $("<div/>").attr({"class": "filterSet"})
			filterDiv.append($("<a/>").attr({"class": "filterSelect"}).text(heading));
			if (headingHtml) filterDiv.append($("<span/>").attr({"class": "filterSelectInfo"}).html(headingHtml));
			filterDiv.append(addFilterAttrs(element));	
			
			if (prepend) {
				state.wrapper.prepend(filterDiv);	
			} else {
				state.wrapper.append(filterDiv);
			}
		}

		function addFilterAttrs(element, idValue) {
			return element.attr({"id": idValue, "class": 'filterContent'})
		}	

		function addFreeTextSearch() {
			wrapInFilterGroup(settings.freeTextSearchHeading, undefined, $('<div>').append(getFreeTextSearch()));
		}

		function getFreeTextSearch(id) {
			var freeTextSearchId = 'freeTextSearch';
			if (id) {
				freeTextSearchId += '_'+id;
			}

			var input = $('<input/>').attr({ type: 'search', id: freeTextSearchId, placeholder: "type to search" });

			var search = utils.getHashParameter("search");
			if (search) {
				input.val(search);
			}

			input.keyup(function() { filter(); }).click(function() { filter(); });			
			return input;
		}	

		function createFreeTextSearch(items, index) {
			return getFreeTextSearch(index).attr({"data-role": "filterSetSelector"});
		}		

		function createMaxWithBanding(items, index) {
			return createMax(getBandedItems(items), index);
		}

		function createMinWithBanding(items, index) {
			var bandedItems = removeLastItemToEnsureAResultIsAlwaysReturned(getBandedItems(items));
			return createMin(bandedItems, index);
		}

		function createRangeBanding(items, index) {
			var bandedItems = getBandedItems(items);
			var rangeItems = [];
			for (var i=0; i<bandedItems.length; i++) {

				if (i==0) {
					if (bandedItems[i].toLowerCase() == "free") {
						rangeItems.push(bandedItems[i]);	
					} else {
						rangeItems.push("up to " + bandedItems[i]);
					}
				} else {
					rangeItems.push(bandedItems[i-1] + ' - ' + bandedItems[i]);
				} 
			}

			var start = utils.now();
			var combinedRangeItems = combineRangesToEnsureTheyAllMatchSomething(index, items, rangeItems);

			return createCheckboxes(combinedRangeItems, index, "Range");
		}

		function removeLastItemToEnsureAResultIsAlwaysReturned(items) {
			if (items.length > 1) items.pop();
			return items;
		}

		function combineRangesToEnsureTheyAllMatchSomething(index, items, rangeItems) {
			var combinedRangeItems = [];
			var currentRange = rangeItems[0];

			for (var i=0; i<rangeItems.length; i++) {
				
				if (rangeFirstIndexMacth(index, rangeItems[i], items) == -1) {
					if (i<rangeItems.length-1) {
						currentRange = currentRange.split(' - ')[0] + ' - ' + rangeItems[i+1].split(' - ')[1];
					}
				
				} else {
					if (utils.startsWith(currentRange, "Free -")) {
						currentRange = currentRange.replace("Free -", "up to ");  
					}
					
					combinedRangeItems.push(currentRange);
					
					if (i<rangeItems.length-1) {
						currentRange = rangeItems[i+1];
					}
				}
			}

			return combinedRangeItems;
		}

		function rangeFirstIndexMacth(index, range, items) {
			if (state.elementType == "TABLE") index = parseInt(index)-1;

			for (var j=0; j<items.length; j++) {
				if (matchesRange(index, items[j], range)) {
					return j;
				}
			}
			return -1;
		}

		function getBandedItems(items) {
			var low = utils.extractCurrencyValue(items[0]);
			var high = utils.extractCurrencyValue(items[items.length-1]);
			var range = parseInt(high) - parseInt(low);
			var step = 10;

			if (range > 1750) { step = 500 } else
			if (range > 900)  { step = 250 } else
			if (range > 350)  { step = 100 } else
			if (range > 175)  { step = 50  } else  
			if (range >  75)  { step = 25  } else 
			if (range >  60)  { step = 20  }

			var noItems = ((items.length == 1) ? 1 : parseInt(range / step) + 1);
			var startFrom = (low - (low%step)) + step;
			if ((noItems-1)*step + startFrom < high) noItems++;

			var bandedItems = [];
			if (low == 0) {
				bandedItems.push("Free");	
			} 

			if (noItems > 1 || bandedItems.length == 0) {
				for (var i=0; i< noItems; i++) {
					bandedItems.push(settings.currencySymbol + (startFrom + i*step));
				}
			}
			return bandedItems;			
		}

		function createMinMaxWithBanding(items, id) {
			return createMinMax(getBandedItems(items), id);
		}

		function createMinMax(items, id) {
			var ul = $("<ul/>").attr({"id": 'MaxMin_'+id, "class": "MaxMin"});
			
			var minSelectLabel = createSelectlabel(id,"Min","From: ").addClass("forSlider");
			var minSelect = createSelect(items,id,"Min",updateSliderFn("Min", id)).addClass("forSlider");
			ul.append(wrapSelectInLi(minSelectLabel, minSelect));
			
			var maxSelectLabel = createSelectlabel(id,"Max","Up to: ").addClass("forSlider");
			var maxSelect = createSelect(items,id,"Max",updateSliderFn("Max", id)).addClass("forSlider");
			ul.append(wrapSelectInLi(maxSelectLabel, maxSelect));
			
			var containerDiv = $("<div/>");
			createSlider(containerDiv, items, id, "MaxMin", minSelect, maxSelect);
			containerDiv.append(ul);
			
			return containerDiv;
		}

		function wrapSelectInLi(label, select) {
			return $("<li/>").append(label).append(select);
		}			

		function createMax(items, index) {
			return createSelectAndSlider(items, index, "Max", "Up to: ");

		}

		function createMin(items, index) {
			return createSelectAndSlider(items, index, "Min", "From: ");
		}

		function createSelectAndSlider(items, id, type, labelForSelect) {
			var containerDiv = $("<div/>");
			var select = createSelect(items, id, type, updateSliderFn(type, id)).addClass("forSlider");
			var selectLabel = createSelectlabel(id, type, labelForSelect).addClass("forSlider");

			createSlider(containerDiv, items, id, type, select);
			containerDiv.append(selectLabel);
			containerDiv.append(select);

			return containerDiv;
		}

		function updateSliderFn(type, id) {
			return function updateSlider(select) { 
				updateSliderLabel(id, select.value);
				moveSlider(select);
			}			
		}

		function createMultiSelect(items, id) {

			function onChangeFn(select) {
				if (select.value != settings.multiSelectLabel) {
					var multiSelect = $(select).parent().find('.multiSelect');
					var selectedPiD = multiSelect.attr("id")+"_"+select.selectedIndex;

					if ($("#"+selectedPiD).length == 0 && select.selectedIndex > 0) {
						var selectedP = $('<p/>').text(select.value).attr("id", selectedPiD);

						$(multiSelect).append(selectedP.click(function() {
							$(this).remove();
							select.selectedIndex = 0;
							filterAfterChange();
						}));						
					}
					select.selectedIndex = 0;
				}
			}

			function blurFunction(select) {
				if (select.selectedIndex != 0) select.selectedIndex = 0;
			}

			var containerDiv = $("<div/>");
			
			var select = createSelect(items, id, "MultiSelect", onChangeFn, blurFunction);
			containerDiv.append(select);

			var selectedItems = $("<div/>").attr({"id": "MultiSelectItems_"+id, "class": "multiSelect" })
			containerDiv.append(selectedItems);

			preSelectMultiSelect(select, id);

			return containerDiv;
		}

		function preSelectMultiSelect(select, id) {
			$.each(select.children(), function() {
				if (utils.locationHashContainsParam(id, $(this).prop("value"))) {
					$(this).prop('selected', 'selected');
					select.change();
				}
			});			
		}

		function createSelectStandalone(items, id) {
			var containerDiv = $("<div/>");
			containerDiv.append(createSelect(items, id, "Select"));
			return containerDiv;
		}

		function createSelect(items, index, type, changeFunction, blurFunction) {
			if (type == undefined) type = "Select";

			var id = type+'_'+index;
			var select = $("<select/>").attr({"id": id, "data-role": "filterSetSelector"});
			
			if (type == "Min")         select.append($("<option/>").text("Show All"));
			if (type == "Select")      select.append($("<option/>").text("All").prop("value", ""));
			if (type == "MultiSelect") select.append($("<option/>").text(settings.multiSelectLabel).prop("value", ""));

			var optionSelected = false;
			$.each(items, function(iteration, item) {
				var option = $("<option/>").prop("value", item).text(item);
				select.append(option);
				
				if (utils.locationHashContainsParam(index, item, type)) {
					option.prop("selected", "selected"); 
					optionSelected = true;
				}
			});

			select.change(function(event) {
				if (changeFunction) changeFunction(this);
				filterAfterChange();
			});

			if (blurFunction != undefined) {
				select.blur(function(event) {
					blurFunction(this);	
				});
			}

			if (type == "Max") select.append($("<option/>").attr({"selected": !optionSelected}).text("Show All"));

			return select;
		}

		function createSelectlabel(id, type, labelForSelect) {
			return $("<label/>").attr({"id": "selectLabel_"+type+"_"+id, "class": "selectLabel"}).text(labelForSelect)
		}

		function createSlider(containerDiv, items, id, type, associatedSelect1, associatedSelect2) {
			if (!settings.slidersEnabled) return containerDiv;

			id = type+'_'+id;
			var handles = (type == "MaxMin") ? 2 : 1;
			var sliderDiv = $("<div/>").attr({"id": "slider_"+id, "class": "noUiSlider"});
			sliderDiv.noUiSlider('init', {
			  handles: handles,  
			  scale: [0, items.length],
			  start: [0, items.length],   
			  change:
				function(){
				  var index = $(this).noUiSlider('value');
				  if (!state.surpressSliderEvent) {
				  	selectSelect(id, index);
				  }
				  updateSliderLabel(id, selectValue(id, index));
				},
			  end: function(){ filterAfterChange(); }
			}); 

			var labelDiv = $("<div/>").attr({"id": "sliderLabel_"+id, "class": "noUiSliderLabel"}).text("-");
			containerDiv.append(labelDiv);
			containerDiv.append(sliderDiv);

			setTimeout(function(){ moveSliders(associatedSelect1, associatedSelect2); }, 0);			

			return containerDiv;
		}

		function moveSliders(associatedSelect1, associatedSelect2) {
			state.surpressSliderEvent = true;

			if (associatedSelect2) {

				// move max first (initially max set to 0 and min can not be more thab max so wouldn't be moved)
			 	moveSlider(associatedSelect2);
			 	moveSlider(associatedSelect1);
			} else {
				moveSlider(associatedSelect1);
			}

			state.surpressSliderEvent = false;
		}

		function selectSelect(id, indexArray) {
			if (utils.contains(id, "MaxMin")) {
				id = id.split('_')[1];
                $('select#Min_'+id).val($('select#Min_'+id+' option:eq('+indexArray[0]+')').val());
                $('select#Max_'+id).val($('select#Max_'+id+' option:eq('+indexArray[1]+')').val());

			} else {
				$('select#'+id).val($('select#'+id+' option:eq('+indexArray[1]+')').val());
			}
		}

		function selectValue(id, indexArray) {
			if (utils.contains(id, "MaxMin")) {
				id = id.split('_')[1];
				var from = $('select#Min_'+id+' option:eq('+indexArray[0]+')').text().trim();
				var to = $('select#Max_'+id+' option:eq('+indexArray[1]+')').text().trim();

				return getMinMaxLabel(from, to);

			} else {
				var value = $('select#'+id+' option:eq('+indexArray[1]+')').text();
				var from = (utils.contains(id, "Max")) ? "Show All" : value;
				var to =   (utils.contains(id, "Min")) ? "Show All" : value; 

				return getMinMaxLabel(from, to);
			}
		}

		function getMinMaxLabel(from, to) {
			if (from == "Show All" && to == "Show All") {
				return "Show All";
			
			} else if (to == "Show All") {
				return "From " + from;
			
			} else if (from == "Show All") {
				return "Up to " + to;

			} else {
				return from + " to " + to;
			}
		}

		function updateSliderLabel(id, value) {
			if (utils.exists('#sliderLabel_'+id)) {
				$('#sliderLabel_'+id).text(value);
			}
		}
		
		function moveSlider(select) {

			var selectId = $(select).attr("id");
			var selectedIndex = $(select).prop("selectedIndex");
		
			// if we find a slider matching the select id, it must be min or max slider (i.e. only 1 knob)
			if (utils.exists('#slider_'+selectId)) {
				$('#slider_'+selectId).noUiSlider('move', { knob: knob, to: selectedIndex, surpressChange: true });	
			
			// if we can't find a slider matching the select id, it must be minMax slider (i.e. 2 knobs). Min is knob 0, Max is knob 1			
			} else {
				var knob = (utils.contains(selectId, "Max")) ? "1" : "0";
				selectId = selectId.split("_")[1];

				if (utils.exists('#slider_MaxMin_'+selectId))  {
					$('#slider_MaxMin_'+selectId).noUiSlider('move', { knob: knob, to: selectedIndex, surpressChange: true });
				}
			}
		}

		function createCheckboxes(items, index, type) {
			var id = (type) ? 'Checkboxes'+type+'_'+index : 'Checkboxes_'+index;
			var ul = $("<ul/>").attr({"id": id, "data-role": "filterSetSelector"});
			
			var atLeastOnChecked = false;
			$.each(items, function(iteration, item) {

				var checked = utils.locationHashContainsParam(index, item, type);
				atLeastOnChecked = atLeastOnChecked || checked;

				ul.append(createCheckboxLi(item, id, checked, function(event) { 
					checkAll(id, false);
					filterAfterChange() 
				}));
			});

			// add all checkbox
			ul.prepend(createCheckboxLi("All", index, !atLeastOnChecked, function() { 
				$.each($('ul#'+id+' input[type="checkbox"]'), function(i, item) {
					checkAll(id, true);
					if (i > 0) $(item).prop("checked", false); 
				});
				filterAfterChange();
			}));

			return ul;	
		}	

		function checkAll(id, checked) {
			if ($('ul#'+id+' input[type="checkbox"]:checked').length == 0) {
				checked = true;
			}
			$('ul#'+id+' input[type="checkbox"]').eq(0).prop("checked", checked);			
		}

		function createCheckboxLi(item, index, checked, clickFn) {
			return $("<li/>").attr({"class": "checkboxLi"})
					.append(createCheckboxLabel(item).prepend(createCheckbox(item, index, checked, clickFn)))			
		}

		function createCheckbox(item, index, checked, clickFn) {
			return $("<input/>").attr({
				"id":    index + '_' + item
			   ,"class": "filterCheckbox" 
			   ,"name":  item
			   ,"value": item
			   ,"type":  'checkbox'
			   ,"checked": checked
			})
			.click(clickFn);
		}

		function createCheckboxLabel(item) {
			// remove tilda used for non-exact word searching for display
			item = utils.startsWith(item, '~') ? item.substring(1) : item;
			return $("<label/>").text(item);
		}

		function createPagination() {
			$('.paginationHolder').each(function(){
				$(this).empty().append(doCreatePagination());
			});	
		}

		function doCreatePagination() {
			var ul = createPagingUl();
			if (settings.pageSize > 0  && state.paging.numMatchedItems > state.paging.itemsPerPage) 
				addPageNumbersToPagingUl(ul);
			if (settings.pageSize > 0) 
				addShowAllLess(ul); 
			return ul;
		}

		function createPagingUl() {
			var from = ((state.paging.currentPage-1) * state.paging.itemsPerPage) + 1;
			var to = ((state.paging.currentPage) * state.paging.itemsPerPage);
			if (to > state.paging.numMatchedItems) to = state.paging.numMatchedItems;

			var ul = $("<ul/>").attr({"class": "pagination"});
			var showing = "Showing ";

			if (settings.pageSize > 0) {
				showing += from + " - " + to + " of ";
			} 

			showing += state.paging.numMatchedItems + " " + ((state.paging.numMatchedItems==1) ? settings.itemLabel : settings.itemsLabel);

			if (state.paging.numMatchedItems < state.paging.totalItems) {
				showing += "<span class='totalItems'> (filtered from " + state.paging.totalItems + ")</span>";
			}
			
			return ul.append($("<li/>").attr({"class": "showing"}).html(showing));
		}

		function addShowAllLess(ul) {
			if (state.paging.numMatchedItems > state.paging.itemsPerPage) {
				pagingShowAllLi(ul, "Show All", 1, -1);

			} else if (state.paging.defaultItemsPerPage > 0 && state.paging.itemsPerPage > state.paging.defaultItemsPerPage) {
				pagingShowAllLi(ul, "First Page", 1, state.paging.defaultItemsPerPage);
			}				
		}		

		function addPageNumbersToPagingUl(ul) {
			var currentPage = parseInt(state.paging.currentPage);
			var numPages = parseInt((state.paging.numMatchedItems/state.paging.itemsPerPage) + ((state.paging.numMatchedItems%state.paging.itemsPerPage > 0) ? 1 : 0)); 
			var prev = (currentPage>1) ? currentPage-1 : 1;
			var next = (currentPage<numPages) ? currentPage+1 : numPages;
			if (next > numPages) next = numPages;

			pagingNextPrevLi(ul, "&laquo;", "Skip to first page", 1);
			pagingNextPrevLi(ul, "&lsaquo;", "Skip to previous page", prev);

			var numPagesMidPoint = Math.floor(settings.maxPagingNumbers/2)
			var pagingStartsFrom = (numPages > settings.maxPagingNumbers && currentPage > numPagesMidPoint) ? currentPage - numPagesMidPoint : 1;
			var pagingEndsAt     = (numPages > settings.maxPagingNumbers) ? Math.min(settings.maxPagingNumbers-1 + pagingStartsFrom, numPages) : numPages;

			if (pagingEndsAt - pagingStartsFrom < settings.maxPagingNumbers && pagingStartsFrom > 1) {
				pagingStartsFrom = Math.max(pagingEndsAt - settings.maxPagingNumbers, 1);
			}

			for (var i=pagingStartsFrom; i<=pagingEndsAt; i++) {
				var li = $("<li/>").addClass("pageNumber");
				if (i == currentPage) li.addClass("active");
				
				ul.append(li.append($("<a/>").text(i).click(function(event) {
					doPaging($(this).text());
					doScrollToResults();
				})));		
			}

			pagingNextPrevLi(ul, "&rsaquo;",  "Skip to next page", next);
			pagingNextPrevLi(ul, "&raquo;", "Skip to last page", numPages);	
		}

		function pagingShowAllLi(ul, text, currentPageParam, itemsPerPageParam) {
			ul.append($("<li/>").append($("<a/>").addClass("pagingShow").text(text).click(function(event) {
				doPaging(currentPageParam, itemsPerPageParam);
				if (itemsPerPageParam != -1) doScrollToResults();				
			})));		
		}

		function pagingNextPrevLi(ul, pagingSymbol, altText, currentPageParam) {
			ul.append($("<li/>").prop("class", "pageNumber").append($("<a/>").click(function(event) {
				doPaging(currentPageParam);
				doScrollToResults();
			}).html(pagingSymbol)));		
		}

		function getSortFunctionForColumn(column) {
			if ($.isNumeric(column)) column = parseInt(column)+1;
			return state.sort[column];
		}

		function createSortingDropDown(items) {
			var select = $("<select/>").attr({"id": "sortBySelect"});
			select.append($("<option/>").prop("value", "sortBy").text("Sort by"));
			
			for(var sortConfigIndex=0; sortConfigIndex<items.length; sortConfigIndex++) {
				var sortConfig = items[sortConfigIndex];

				if (state.sort[sortConfig.id] != undefined) {
					var value = sortConfig.id + "_" + sortConfig.direction;
					select.append($("<option/>").prop("value", value).text(sortConfig.heading));

				} else {
					utils.log("Sort function not defined for id '" + sortConfig.id + "' so not adding '" + sortConfig.heading + "' to sorting dropdown")
				}
			}
			
			select.change(function(event) {
				var key = getSelectedSortKey();
				var sortFn = functionsForElementType[state.elementType].getAllDataFn();
				var index = key.split('_')[0];
				var direction =  key.split('_')[1];

				if (key != "sortBy") sortData(state.element, sortFn, index, direction);
			});
			
			var sortDiv = $("<div/>").append(select);
			wrapInFilterGroup(settings.sortingDropDownHeading, undefined, sortDiv, true);   
		}

		function selectDefaultSortingDropdownItem(items) {
			var uriSortConfig = getUriSortConfig();

			var index = 1;
			$.each(items, function(key, sortConfig) {
				var shouldSelectOption = (uriSortConfig) ? (uriSortConfig.id === sortConfig.id && uriSortConfig.direction === sortConfig.direction) : sortConfig.isDefault;

				if (shouldSelectOption) {
					sortData(state.element, functionsForElementType[state.elementType].getAllDataFn(), sortConfig.id, sortConfig.direction);
					$('#sortBySelect option:eq('+index+')').attr('selected', 'selected');
				}
				index++;
			});
		}

		function getUriSortConfig() {
			var sortKey = utils.getHashParameter("sortBy");
			if (sortKey && utils.contains(sortKey, '_')) {
				var id = utils.getIdFromAlias(sortKey.split('_')[0]);
				var direction = utils.getSortDirectionFromAlias(sortKey.split('_')[1]);
				return {"id": id, "direction": direction}
			}
		}

		function getSelectedSortKey() {
			return $('select#sortBySelect>option:selected').val();
		}

		function getCurrentSortState() {
			var key = getSelectedSortKey();
			var id = utils.getIdAlias(key.split('_')[0]);
			var direction =  utils.getSortDirectionAlias(key.split('_')[1]);

			return (key != "sortBy") ? id+'_'+direction : "";			
		}

		function applyTableSorting() {
			$('#tariffTable thead th').each(function(column) {
				if (getSortFunctionForColumn(column)) {
					applySortToColum($(this), column);
				}
			});

			var sortyByColumn = utils.getHashParameter("sortyByColumn");
			if (sortyByColumn && utils.contains(sortyByColumn, "_")) {
				var column = utils.getIdFromAlias(sortyByColumn.split("_")[0])-1;
				var direction = utils.getSortDirectionFromAlias(sortyByColumn.split("_")[1]);
				sortTableByColumn(column, direction);
			}
		}

		function applySortToColum(th, column) {
			// don't add twice
			if (utils.contains(th.attr("class"), "noSorting") || utils.contains(th.attr("class"), "sortable") ) return;

			// if header contains an anchor, add a click handler and if clicked, don't sort
			if (th.find("a").length > 0) {
				th.find("a").click(function(){ $(th).addClass("skipSorting") });
			}

			th.addClass('sortable')
			.click(function(){
				
				// prevent sorting once if required
				if (utils.contains(th.attr("class"), "skipSorting")) {
					$(th).removeClass("skipSorting");
				
				} else {
					var sortDirection = th.is('.sorted-asc') ? -1 : 1;	
					sortTableByColumn(column, sortDirection);
				}
			});	
		}	

		function sortTableByColumn(column, sortDirection) {
			state.tableSortedByCol = utils.getIdAlias(column+1) + '_' + utils.getSortDirectionAlias(sortDirection);	

			var rows = $('#tariffTable tbody tr').get();
			sortData($('#tariffTable tbody'), rows, column, sortDirection);		
			
			//identify the column sort order
			$('th').removeClass('sorted-asc sorted-desc');
			var $sortHead = $('th').filter(':nth-child(' + (column + 1) + ')');
			sortDirection == 1 ? $sortHead.addClass('sorted-asc') : $sortHead.addClass('sorted-desc');
			
			//identify the column to be sorted by
			$('td').removeClass('sorted')
				.filter(':nth-child(' + (column + 1) + ')')
				.addClass('sorted');			
		}

		function sortData(parent, rows, index, sortDirection) {
			doSortData(parent, rows, index, sortDirection);
			doPaging(1);
		}		

		function doSortData(parent, rows, index, sortDirection) {
			$.each(rows, function(rowIndex, row) {
				row.sortKey = functionsForElementType[state.elementType].extractTextFn(row, index);
			});
			
			// compare and sort the rows 
			rows.sort(function(a,b) {
				var sortFn = getSortFunctionForColumn(index);
				return sortFn(a.sortKey, b.sortKey, sortDirection);
			});

			// add the rows in the correct order to the bottom of the table
			$.each(rows, function(rowIndex, row) {
				parent.append(row);
				row.sortKey = null;
			});
		}

		compare = {
			sortItems: function(items, compareFn, direction) {
				if (direction == undefined) direction = 1;
				if (typeof compareFn == "string") compareFn = compare[compareFn];
				items.sort(function(a,b) { return compareFn(a,b,direction) } );
				return items;
			},

			compareAmount:   function(a,b,direction) { return compare.compare(compare.convertAmount(a), compare.convertAmount(b), direction) },
			comparePeriod:   function(a,b,direction) { return compare.compare(compare.convertPeriod(a), compare.convertPeriod(b), direction) },
			compareStock:    function(a,b,direction) { return compare.compare(compare.convertStock(a),  compare.convertStock(b),  direction) },
			compareCurrency: function(a,b,direction) { return compare.compare(parseFloat(utils.extractCurrencyValue(a)), parseFloat(utils.extractCurrencyValue(b)), direction) },

			compare: function(a,b,direction) {
			  if (!direction) direction = 1;
			  return ((a < b) ? -direction : ((a > b) ?  direction : 0));
			},      

			strPad: function(i,l,s) {
				var o = i.toString().trim();
				if (!s) { s = '0'; }
				while (o.length < l) { o = s + o; }
				return o;
			},

			convertStock: function(stock) {
				if (utils.startsWith(stock.toLowerCase(), "in stock")) return "000";
				if (utils.startsWith(stock.toLowerCase(), "out of stock")) return "zzz";
				return stock.toLowerCase();
			},

			convertAmount: function(data) {
				var data = data.replace("GB", "000000").replace("MB", "000");
				if (!utils.containsNumber(data)) data = (data == "Unlimited") ? Number.MAX_VALUE : "0";
				return compare.strPad(data, 10);
			},

			convertPeriod: function(period) {
				var period = period.toUpperCase().replace(" DAYS", "").replace(" MONTHS", "00");
				return compare.strPad(period, 10);
			}
		}	

		utils = {

			inArrayIgnoreCase: function(text, items) {
				var lowerCaseText = text.toLowerCase();
				for (var i=0; i<items.length; i++) {
					if (items[i].toLowerCase() == lowerCaseText) return true;
				}
				return false;
			}, 

			escapeRegex: function(text) {
				return (text).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
			},

			unEscapeRegex: function(text) {
				return (text).replace(/\\/g, "");
			},			

			startsAndEndsWithWordCharacter: function(text) {
				return text.search(new RegExp("^\\w.*\\w$")) > -1;
			},

			getHashLocation: function() {
				// hack to get £ working in Safari based browsers
				return utils.replaceAll(utils.replaceAll(window.location.hash, "%A3", "£"), "%C2", "");
			},

			locationHashContainsParam: function(index, item, type) {
				var locationHash = utils.getHashLocation();

				if (type) item = utils.getHashParamModifier(type) + item;

				if (index && item) {
					locationHash = utils.replaceAll(locationHash, '%20', ' ');
					locationHash = utils.replaceAll(locationHash, '\\+', ' ');
					locationHash = encodeURIComponent(locationHash);
					
					var param = encodeURIComponent(utils.getIdAlias(index)+'='+item);
					var contains = utils.contains(locationHash.toLowerCase(), param.toLowerCase());
					
					return contains;
				
				} else {
					return false;
				}
			},	

			getHashParamModifier: function(type) {
				var modifier = hashParamModifier[type];
				return (modifier) ? modifier : "";
			},			

			getIdAlias: function(id) {
				return (state.aliases[id]) ? state.aliases[id] : id;
			},

			getIdFromAlias: function(alias) {
				return (state.reverseAliases[alias]) ? state.reverseAliases[alias] : alias;
			},

			getSortDirectionAlias: function(direction) {
				return (direction+"" == "1") ? "asc" : "desc";
			},		

			getSortDirectionFromAlias: function(alias) {
				return (alias === "asc") ? "1" : "-1";
			},					

			getHashParameter: function(name) {
				if(name=(new RegExp('[#&]'+encodeURIComponent(name)+'=([^&]*)')).exec(utils.getHashLocation()))
					return decodeURIComponent(name[1]);
			},

			extractCurrencyValue: function(string) {
				if (string == undefined) return "";

				var trimmedString = string.trim().toLowerCase();

				if (string.indexOf(settings.currencySymbol) != -1) {
					return utils.substringAfterLast(trimmedString, settings.currencySymbol);
				
				} else if (utils.contains(trimmedString, "free") || trimmedString == "") {
					return "0";

				} else {
					return string;
				}
			},

			substringAfterLast: function(string, delimiter) {
				return(string.indexOf(delimiter) > -1) ? string.substring(string.lastIndexOf(delimiter)+delimiter.length) : "";
			},	

			substringBeforeFirst: function(text, delim) {
				var index = text.indexOf(delim);
				return (index > -1) ? text.substring(0, index) : text 
			},			

			contains: function(value, text) {
				if (value == undefined || text == undefined) return false;
				return value.toLowerCase().indexOf(text.toLowerCase()) != -1;
			},

			containsNumber: function(txt) {
				return /\d/.test(txt);
			},			

			exists: function(element) {
				return $(element).length > 0;
			},

			now: function() {
				return new Date().getTime();
			},

			replaceAll: function(txt, replace, with_this) {
			  return txt.replace(new RegExp(replace, 'g'),with_this);
			},

			convertToSingleLine: function(text) {
				return text.replace(/(\r\n|\n|\r)/gm," ");
			},

			startsWith: function(txt, fragment) {
				return txt.indexOf(fragment) == 0;
			},

			endsWith: function(txt, fragment) {
				return txt.indexOf(fragment) == txt.length - fragment.length;
			},			

			isAlphaNumeric: function(txt) {
				return (txt.match(/^[0-9a-zA-Z ]+$/)) ? true : false;
			},

			log: function(string) {
				settings.logFn(string);
			},

			equalsIgnoreCase: function(a,b) {
				return (a == undefined || b == undefined) ? false : a.toLowerCase() == b.toLowerCase();
			},			

			wrapFunctionWithLoading: function(functionToWrap, shouldWrap) {
				if (shouldWrap) {
					showLoading();

					setTimeout(function() { 
						var start = utils.now();
						
						try {
							functionToWrap(); 
						} catch(e) {
							hideLoading();
							utils.log("Error in wrapped function (message): " + e.message);
							utils.log("Error in wrapped function (stack): " + e.stack);
							throw e;
						}
						
						var timeTaken = utils.now() - start;
						if (timeTaken < settings.loadingMinTime) {
							setTimeout(hideLoading, settings.loadingMinTime-timeTaken);
						} else {
							hideLoading();
						}
					}, 1);
				
				} else {
					functionToWrap();
				}			
			}																
		}	

		/* START Filters - Data Types */
		var compareFunctionForDataType = {

			/* Items will be sorted alaphabetically using the default JS sort order */
			"default"  : compare.compare,

			/* Sorts items by treating GB with 000000 and MB with 000. Unlimitied is treated as Number.MAX_VALUE */
			"amount"   : compare.compareAmount,

			/* If the string contains a £ sign, then the text after the last instance of the £ sign is parsed in to a number. If the text does not contain
			a £ sign then 0 is assumed */
			"currency" : compare.compareCurrency,

			/*  */
			"period"   : compare.comparePeriod,

			/* In Stock is first, Out of Stock is last anyhing else is sorted alaphabetically in between */
			"stock"    : compare.compareStock
		}	
		/* END Filters - Data Types */

		/* START Filters - Filter Types */
		var factoryFunctionForFilterType = {

			/* Uses a standard HTML Select element to filter results based on option selected.<br>
			<img src="images/select.jpg" / > */
			"select"            : createSelectStandalone,

			/* Creates an HTML Select element and everytime an option is chosen, this is added to  a list of selected options
			and reomoved from the Select element enabling multi-selection.<br>
			<img src="images/multiSelect.jpg" / >*/
			"multiSelect"       : createMultiSelect,

			/* Creates a checkbox per unique item. Also adds an all checkbox as the first element. By default, "All" is selected.
			When another element is selected, "All" is deselected. If no elements are selected, "All" is selected.<br>
			<img src="images/checkboxes.jpg" / > */
			"checkboxes"        : createCheckboxes,

			/* Creates an HTML select element and when an option is selected, the data is filtered so that anything greater or equal to the
			value is selected (i.e. the seleted option is the minimum). If sliders are enabled then they can be used to update the Select box.<br>
			<img src="images/min.jpg" / >*/
			"min"               : createMin,

			/* Creates an HTML select element and when an option is selected, the data is filtered so that anything less than or equal to the
			value is selected (i.e. the seleted option is the maximum). If sliders are enabled then they can be used to update the Select box.<br>
			<img src="images/max.jpg" / >*/
			"max"               : createMax,

			/* Creates HTML select elements for <a href="#max">max</a> and <a href="#min">min</a> and combines the results. If sliders are enabled then they can be used to update the Select boxes.<br>
			<img src="images/minMax.jpg" / >*/
			"minMax"            : createMinMax,

			/* As per <a href="#minMax">minMax</a>, however, the data used is placed in to bands - see <a href="#banding">banding</a> for details. */
			"minMaxWithBanding" : createMinMaxWithBanding,

			/* As per <a href="#minMax">min</a>, however, the data used is placed in to bands - see <a href="#banding">banding</a> for details. */
			"minWithBanding"    : createMinWithBanding,

			/* As per <a href="#minMax">max</a>, however, the data used is placed in to bands - see <a href="#banding">banding</a> for details. */
			"maxWithBanding"    : createMaxWithBanding,

			/* Puts the data in to bands (see <a href="#banding">banding</a> for details) and then creates a checkbox per valid band range.<br>
			<img src="images/rangeBanding.jpg" / > */
			"rangeBanding"      : createRangeBanding,

			/* Uses an HTML5 &lt;input="search"&gt; element to display a search box. Whenever the user types someting or clears the search, then a free text search is 
			performed. If browser does not support &lt;input="search"&gt; then a default input box is used instead.<br>
			<img src="images/search.jpg" / > */
			"search"            : createFreeTextSearch
		}
		/* END Filters - Filter Types */

		var functionsForElementType = {
			"TABLE": {
				"getAllDataFn"           : getAllDataForTable,
				"getAllDataForGivenIdFn" : getAllDataForColumnFromTable,
				"extractTextFn"          : extratcTextFromTableCell
			},
			"UL" : {
				"getAllDataFn"           : getAllDataForList,
				"getAllDataForGivenIdFn" : getAllDataForIdFromList,
				"extractTextFn"          : extractTextFromListElement
			} 
		}


		// default jQuery method invocation pattern
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

		} else if ( utils[method] ) {
			return utils[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

		} else if ( compare[method] ) {
			return compare[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );

		} else {
			$.error( 'No such method: ' +  method );
		}
	}

})(jQuery)