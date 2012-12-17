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

		var settings = $.extend( {
			enableFreeTextSearch: false,
			scrollToEnabled: false,
			scrollToAnimationEnabled: true,
			animationEnabled: false,
			useShowResultsButton: false,
			useApplyButton: false,
			pageSize: -1,
			filters: {},
			sortingDropDown: undefined,
			defaultTableSort: undefined,
			slidersEnabled: true,
			multiSelectLabel: "Select to add",
			useFixedWidthForMutliSelect: false,
			itemsLabel: "items",
			itemLabel: "item",
			noResultsHtml: "<p>No matching items, please modify your search criteria</p>",
			logTiming: false,
			disableIfSlow: false,
			slowTimeMs: 1000,
			useLoadingOverlayOnFilter: false,
			loadingMinTime: 300,
			useLoadingOverlayOnFilterIfSlow: true,
			disableFreeTextIfSlow: false,
			useLoadingOverlayOnStartUp: false,
			extractTextFn: function(element) { return element.text() },
			freeTextSearchExtractTextFn: function(element) { return element.text() },
			onSuccess: function() {},
			onSlow: function(time) { utils.log("Too slow to create filters: " + time + "ms, max allowed is " + settings.slowTimeMs + "ms") },
			afterFilter: function() {},
			logFn: function(string) { console.log(string) }
		}, options);		

		var state = {
			element: $(this),
			elementId: $(this).attr("id"),
			elementType: $(this).prop('tagName'),
			aliases: {},
			filtersInitialised: false,
			initialised: false,
			sort: {},
			paging: {
				currentPage: 1,
				itemsPerPage: -1,
				defaultItemsPerPage: Number.MAX_VALUE,
				totalItems: 0,
				numMatchedItems: 0
			},
			wrapper: $(document.createElement('div')).attr("class", "filterWrapper")
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
			
			if (settings.enableFreeTextSearch) addFreeTextSearch();

			for (var filtersIndex=0; filtersIndex<settings.filters.length; filtersIndex++) {				
				var filter = settings.filters[filtersIndex];
				initDataElement(filter);
			}

			if (settings.sortingDropDown != undefined) createSortingDropDown(settings.sortingDropDown);
			
			var filterCreationTime = utils.now() - start;
			if (settings.disableIfSlow && filterCreationTime > settings.slowTimeMs) {
				handleSlowness();
				settings.onSlow(filterCreationTime);
			
			} else {
				applyToFiltersElement();
				applySorting();
				addNoResultsHolder();
				addModalDiv();

				ready(settings.pageSize);			
				
				settings.onSuccess();
			}
		}

		function handleSlowness() {
			if (settings.useLoadingOverlayOnFilterIfSlow) {
				settings.useLoadingOverlay = true;
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
			if (!utils.exists($('#dataFiltersModal'))) $('body').append($('<div/>').prop('id', 'dataFiltersModal'));
		}

		function applyToFiltersElement() {
			$('#filters').empty();
			$('#filters').append(state.wrapper);
		}

		function applySorting() {
			if (state.elementType == "TABLE") applySort();	
			if (settings.sortingDropDown != undefined) selectDefaultSortingDropdownItem(settings.sortingDropDown); 			
		}

		function initDataElement(config) {
			state.filtersInitialised = false;
			sortFn = compareFunctionForDataType[config.dataType]
			state.sort[config.id] = sortFn;
			state.aliases[config.id] = config.alias;
			factoryFn = factoryFunctionForFilterType[config.filterType];

			if (config.heading && config.id && factoryFn && sortFn) { 
				var items = config.items;

				if (items == undefined) {
					var data = functionsForElementType[state.elementType].getAllDataForGivenIdFn(config.id);
					items = extractUniqueValues(data, sortFn);
				}

				if (items.length > 0) {
					createFilterGroup(config.id, config.heading, factoryFn, items);
				} else {
					utils.log("No items found for id '" + config.id + "' so '" + config.heading + "' not added as a filter");
				}
			
			} else {
				utils.log("Can not create filter for id '" + config.id + "' so '" + config.heading + "' with filterType '" + config.filterType + 
					"' and dataType '" + config.dataType + "' not added as a filter");
			}
		};

		function ready(itemsPerPageValue) {
			state.filtersInitialised = true;
			state.paging.defaultItemsPerPage = itemsPerPageValue;
			doPaging(1, itemsPerPageValue);	

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

		function addButton(text, id, clickFn) {
			var btn = $("<button/>").attr({"type": "button", "id": id, "class": "btn-style"}).click(function() { 
				clickFn(); 
			}).text(text);
			state.wrapper.append($("<div/>").append(btn));			
		}

		function extractUniqueValues(data, sortFn) {
			var items=[];
			data.each(function(){
				var text = settings.extractTextFn($(this)).trim();
			   if (text.length > 0 && $.inArray(text, items) < 0) items.push(text);       
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
			return settings.extractTextFn($(row).children('td').eq(index));
		}

		function extractTextFromListElement(row, index) {
			return settings.extractTextFn($(row).find('.'+index));
		}		

		function doPaging(page,itemsPerPageValue) {
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
			}, settings.useLoadingOverlayOnFilter && state.initialised);
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

			filterRows(matches, searches);
			createPagination();
			scrollToResults();
			checkForNoResults();
			if (settings.logTiming) utils.log("filter:" + (utils.now() - start));

			settings.afterFilter();
		}

		function showLoading() { 
		    $('body').addClass("loading");
		    if(navigator.userAgent.match(/(iPhone|iPod|MSIE)/i)) $('.modal').css('postion', 'absolute').css('top', ((-($('html').offset().top))+25)+'px') 
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
			    		settings.animationEnabled ? $(this).show('slow') : $(this).show();
			    		visibleItems++; 
			    	} else {
			    		settings.animationEnabled ? $(this).hide('slow') : $(this).hide();
			    	}

			    	state.paging.numMatchedItems++;	

			    } else {                  
			    	settings.animationEnabled ? $(this).hide('slow') : $(this).hide();
			    }
			});	

			setTimeout(function(){ hideThenShowToFixLayoutIssues(data) }, settings.animationEnabled ? 330 : 1);
		}

		function hideThenShowToFixLayoutIssues(data) {
			data.each(function() { 
				if ($(this).css('display') != 'none') $(this).hide().show();
			} );
		}

		function checkForNoResults() {
			if (state.paging.numMatchedItems == 0) {
				$('#noFilterResults').show();
				$('.paginationHolder').hide();
			} else {
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

			if (settings.enableFreeTextSearch && $('#freeTextSearch').val().trim() != "" && matched) {
				matched = matchesRegex(settings.freeTextSearchExtractTextFn($(row)), getAndRegex($('#freeTextSearch').val().trim()));
			}

			return matched;	
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
			return utils.convertToSingleLine(text).search(new RegExp(regex, "i")) > -1;
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
			range = utils.replaceAll(range, "up to ", "£0 - ");

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
				searchString += addToSearchString(searchString, $(this).text());
			});
			return searchString;
		}		

		function getSearchStringForCheckboxGroup(id) {
			var searchString = "";
			$('ul#'+id+' li input[type=checkbox]').each(function () {
				if ($(this).prop("checked") && $(this).prop("name") != "All") searchString += addToSearchString(searchString, $(this).prop("name"));
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

		function addToSearchString(searchString, value) {
			var searchToAdd = matchWordBoundaryUnlessTextStartWithTilda(value);
			return (searchString=="" ? searchToAdd : "|" + searchToAdd); 
		}

		function matchWordBoundaryUnlessTextStartWithTilda(value) {
			return (utils.startsWith(value, '~')) ? value.substring(1) : matchWordOnly(value);
		}

		function matchWordOnly(word) {
			return "\\b"+utils.extractCurrencyValue(word)+"\\b";
		}

		function createFilterGroup(index, group, factoryFn, items) {
			wrapInFilterGroup(group, factoryFn(items, index));
		}	

		function wrapInFilterGroup(group, element, prepend) {
			var filterDiv = $("<div/>").attr({"class": "filterSet"})
			filterDiv.append($("<a/>").attr({"class": "filterSelect"}).text(group));
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
			wrapInFilterGroup("Search", $('<div>').append(getFreeTextSearch()));
		}

		function getFreeTextSearch(id) {
			var freeTextSearchId = 'freeTextSearch';
			if (id) {
				freeTextSearchId += '_'+id;
			}

			return $('<input/>').attr({ type: 'search', id: freeTextSearchId, placeholder: "type to search" })
				.keyup(function() { filter(); })
				.click(function() { filter(); });			
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
			if (range > 750)  { step = 250 } else
			if (range > 350)  { step = 100 } else
			if (range > 175)  { step = 50  } else  
			if (range >  75)  { step = 25  } else 
			if (range >  60)  { step = 20  }

			var noItems = parseInt(range / step) + 1;
			var startFrom = (low - (low%step)) + step;
			if ((noItems-1)*step + startFrom < high) noItems++;

			var bandedItems = [];
			if (low == 0) {
				bandedItems.push("Free");	
				startFrom = startFrom + step;
			} 

			for (var i=0; i< noItems; i++) {
				bandedItems.push("£" + (startFrom + i*step));
			}
			return bandedItems;			
		}

		function createMinMax(items, id) {
			var ul = $("<ul/>").attr({"id": 'MaxMin_'+id, "class": "MaxMin"});
			ul.append(wrapSelectInLi(createSelectlabel(id,"Min","From: ").addClass("forSlider"),  createSelect(items,id,"Min",updateSliderFn("Min", id)).addClass("forSlider")));
			ul.append(wrapSelectInLi(createSelectlabel(id,"Max","Up to: ").addClass("forSlider"), createSelect(items,id,"Max",updateSliderFn("Max", id)).addClass("forSlider")));
			
			var containerDiv = $("<div/>");
			createSlider(containerDiv, items, id, "MaxMin");
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
			createSlider(containerDiv, items, id, type);
			containerDiv.append(createSelectlabel(id, type, labelForSelect).addClass("forSlider"));
			containerDiv.append(createSelect(items, id, type, updateSliderFn(type, id)).addClass("forSlider"));
			return containerDiv;
		}

		function updateSliderFn(type, id) {
			return function updateSlider(select) { 
				updateSliderLabel(id, select.value);
				moveSlider(type+"_"+id, select.selectedIndex);
			}			
		}

		function createMultiSelect(items, id) {

			function onChangeFn(select) {
				if (select.value != settings.multiSelectLabel) {
					var multiSelect = $(select).parent().find('.multiSelect');
					var selectedP = $('<p/>').text(select.value).prop("class", select.selectedIndex);

					$(multiSelect).append(selectedP.click(function() {
						var text = $(this).text();
						$(select).append($("<option/>").prop("value", text).text(text));
						sortSelect($(select));
						$(this).remove();
						filterAfterChange();
					}));

					$(select).find("option:selected").remove();
				}
			}

			var containerDiv = $("<div/>");
			containerDiv.append(createSelectlabel(id, "MultiSelect", ""));
			
			var select = createSelect(items, id, "MultiSelect", onChangeFn)
			containerDiv.append(select);

			var selectedItems = $("<div/>").attr({"id": "MultiSelectItems_"+id, "class": "multiSelect" })
			containerDiv.append(selectedItems);

			preSelectMultiSelect(select, id);

			return containerDiv;
		}

		function preSelectMultiSelect(select, id) {
			$.each(select.children(), function() {
				if (urlContainsParam(id, $(this).prop("value"))) {
					$(this).prop('selected', 'selected');
					select.change();
				}
			});			
		}

		function sortSelect(select) {
		    var selectedValue = select.val();
		    select.html($("option", select).sort(function(a, b) { 
		    	if (a.text == settings.multiSelectLabel) return -1;
		    	if (b.text == settings.multiSelectLabel) return 1;
		        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1 
		    }));
		    select.val(selectedValue);
		}

		function createSelectStandalone(items, id) {
			var containerDiv = $("<div/>");
			containerDiv.append(createSelectlabel(id, "Select", ""));
			containerDiv.append(createSelect(items, id, "Select"));
			return containerDiv;
		}

		function createSelect(items, index, type, changeFunction) {
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
			    
			    if (urlContainsParam(index, item)) {
			    	option.prop("selected", "selected"); 
			    	optionSelected = true;
			    }
			});

			select.change(function(event) {
				if (changeFunction) changeFunction(this);
		        filterAfterChange();
		    })	

			if (type == "Max") select.append($("<option/>").attr({"selected": !optionSelected}).text("Show All"));

		    return select;
		}

		function createSelectlabel(id, type, labelForSelect) {
			return $("<label/>").attr({"id": "selectLabel_"+type+"_"+id, "class": "selectLabel"}).text(labelForSelect)
		}

		function createSlider(containerDiv, items, id, type) {
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
			      selectSelect(id, index);
			      updateSliderLabel(id, selectValue(id, index));
			    },
			  end: function(){ filterAfterChange(); }
			}); 

			var labelDiv = $("<div/>").attr({"id": "sliderLabel_"+id, "class": "noUiSliderLabel"}).text("-");
			containerDiv.append(labelDiv);
			containerDiv.append(sliderDiv);

			if (type == "Min")    setTimeout(function(){ moveSlider(id, 0)            }, 0);
			if (type == "Max")    setTimeout(function(){ moveSlider(id, items.length) }, 0);
			if (type == "MaxMin") setTimeout(function(){ moveSlider(id, items.length) }, 0);

			return containerDiv;
		}

		function selectSelect(id, indexArray) {
			if (utils.contains(id, "MaxMin")) {
				id = id.split('_')[1];
				$('select#Min_'+id+' option:eq('+indexArray[0]+')').attr('selected', 'selected');
				$('select#Max_'+id+' option:eq('+indexArray[1]+')').attr('selected', 'selected');

			} else {
				$('select#'+id+' option:eq('+indexArray[1]+')').attr('selected', 'selected');
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

		function moveSlider(id, index) {
			if (utils.exists('#slider_'+id)) {
				var knob = (utils.contains(id, "MaxMin")) ? "1" : "0";
				$('#slider_'+id).noUiSlider('move', { knob: knob, to: index, surpressChange: true });	
			
			} else {
				var knob = (utils.contains(id, "Max")) ? "1" : "0";
				id = id.split("_")[1];

				if (utils.exists('#slider_MaxMin_'+id))  {
					$('#slider_MaxMin_'+id).noUiSlider('move', { knob: knob, to: index, surpressChange: true });
				}
			}
		}

		function createCheckboxes(items, index, type) {
			var id = (type) ? 'Checkboxes'+type+'_'+index : 'Checkboxes_'+index;
			var ul = $("<ul/>").attr({"id": id, "data-role": "filterSetSelector"});
			
			var atLeastOnChecked = false;
			$.each(items, function(iteration, item) {

				var checked = urlContainsParam(index, item);
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

		function urlContainsParam(index, item) {
			if (index && item) {
				if (state.aliases[index]) index = state.aliases[index];
				var href = encodeURIComponent(utils.replaceAll(window.location.href, '\\+', ' '));
				var param = encodeURIComponent(index+'='+item);
				var contains = utils.contains(href, param);
				return contains;
			} else {
				return false;
			}
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
			var numPages = parseInt((state.paging.numMatchedItems/state.paging.itemsPerPage) + ((state.paging.numMatchedItems%state.paging.itemsPerPage > 0) ? 1 : 0)); 
			var prev = (state.paging.currentPage>1) ? state.paging.currentPage-1 : 1;
			var next = (state.paging.currentPage<numPages) ? state.paging.currentPage+1 : numPages;
			if (next > numPages) next = numPages;

			pagingNextPrevLi(ul, "&laquo;", "Skip to first page", 1);
			pagingNextPrevLi(ul, "&lsaquo;", "Skip to previous page", prev);

			for (var i=1; i<=numPages; i++) {
				var li = $("<li/>").addClass("pageNumber");
				if (i == state.paging.currentPage) li.addClass("active");
				
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
				doScrollToResults();				
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
				var key = $('select#sortBySelect>option:selected').val();
				if (key != "sortBy") sortData(state.element, functionsForElementType[state.elementType].getAllDataFn(), key.split('_')[0], key.split('_')[1]);
		    });
			
			wrapInFilterGroup("Sort by", select, true);   
		}

		function selectDefaultSortingDropdownItem(items) {
			var index = 1;
			$.each(items, function(key, sortConfig) {
				if (sortConfig.isDefault) {
					sortData(state.element, functionsForElementType[state.elementType].getAllDataFn(), sortConfig.id, sortConfig.direction);
					$('#sortBySelect option:eq('+index+')').attr('selected', 'selected');
				}
				index++;
			});
		}

		function applySort() {
			$('#tariffTable thead th').each(function(column) {
				if (getSortFunctionForColumn(column)) {
					applySortToColum($(this), column);
				}
			});
		}

		function applySortToColum(th, column) {
			// don't add twice
			if (utils.contains(th.attr("class"), "noSorting") || utils.contains(th.attr("class"), "sortable") ) return;

			th.addClass('sortable')
			.click(function(){
				var $rows = $('#tariffTable tbody tr').get();
				var sortDirection = th.is('.sorted-asc') ? -1 : 1;	
				sortData($('#tariffTable tbody'), $rows, column, sortDirection);
				
				//identify the column sort order
				$('th').removeClass('sorted-asc sorted-desc');
				var $sortHead = $('th').filter(':nth-child(' + (column + 1) + ')');
				sortDirection == 1 ? $sortHead.addClass('sorted-asc') : $sortHead.addClass('sorted-desc');
				
				//identify the column to be sorted by
				$('td').removeClass('sorted')
					.filter(':nth-child(' + (column + 1) + ')')
					.addClass('sorted');
			});	
		}

		function sortData($parent, $rows, index, sortDirection) {
			doSortData($parent, $rows, index, sortDirection);
			doPaging(1);
		}

		function doSortData($parent, $rows, index, sortDirection) {
			$.each($rows, function(rowIndex, row) {
				row.sortKey = functionsForElementType[state.elementType].extractTextFn(row, index);
			});
			
			//compare and sort the rows 
			$rows.sort(function(a,b) {
				var sortFn = getSortFunctionForColumn(index);
				return sortFn(a.sortKey, b.sortKey, sortDirection);
			});
			
			//add the rows in the correct order to the bottom of the table
			$.each($rows, function(rowIndex, row) {
				$parent.append(row);
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

			compareAmount:   function(a,b,direction) { return compare.compare(compare.convertAmount(a), compare.convertAmount(b),   direction) },
			comparePeriod:   function(a,b,direction) { return compare.compare(compare.convertPeriod(a), compare.convertPeriod(b), direction) },
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

			extractCurrencyValue: function(string) {
				if (string == undefined) return "";

				var trimmedString = string.trim(
					);
				if (string.indexOf('£') != -1) {
					return utils.replaceAll(trimmedString, '£', '');
				
				} else if (trimmedString.toLowerCase() == "free" || trimmedString == "") {
					return "0";

				} else {
					return string;
				}
			},

			substringAfterLast: function(string, delimiter) {
				return(string.indexOf(delimiter) > -1) ? string.substring(string.lastIndexOf(delimiter)+delimiter.length) : "";
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

			isAlphaNumeric: function(txt) {
				return (txt.match(/^[0-9a-zA-Z ]+$/)) ? true : false;
			},

			substringBeforeFirst: function(text, delim) {
				var index = text.indexOf(delim);
				return (index > -1) ? text.substring(0, index) : text 
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

		// configuration section
	    var compareFunctionForDataType = {
	    	"default"  : compare.compare,
	    	"amount"   : compare.compareAmount,
	    	"currency" : compare.compareCurrency,
	    	"period"   : compare.comparePeriod
	    }	

	    var factoryFunctionForFilterType = {
	    	"select"         : createSelectStandalone,
	    	"multiSelect"    : createMultiSelect,
	    	"checkboxes"     : createCheckboxes,
	    	"min"            : createMin,
	    	"max"            : createMax,
	    	"minMax"         : createMinMax,
	    	"minWithBanding" : createMinWithBanding,
	    	"maxWithBanding" : createMaxWithBanding,
	    	"rangeBanding"   : createRangeBanding,
	    	"search"         : createFreeTextSearch
	    }

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