(function($) {

	$.fn.DataFilter = function(method, options) {

		/*
		 * See bottom of file for furhter configuration
		 */

		var settings = $.extend( {
			scrollToEnabled: false,
			useShowResultsButton: false,
			useApplyButton: false,
			pageSize: -1,
			dataElements: {},
			sortingDropDown: undefined,
			defaultTableSort: undefined,
			slidersEnabled: true,
			extractTextFn: function(element) { return element.text() },
			onSuccess: function() {}
		}, options);		

		var state = {
			element: $(this),
			elementId: $(this).attr("id"),
			elementType: $(this).prop('tagName'),
			filtersInitialised: false,
			initialised: false,
			pauseFilter: false,
			sort: {},
			paging: {
				currentPage: 1,
				itemsPerPage: -1,
				defaultItemsPerPage: Number.MAX_VALUE,
				totalItems: 0,
				numMatchedItems: 0
			},
			wrapper: $(document.createElement('div'))
		}

		methods = {		

			init: function(){
				if (validate()) {
					doInit();
					settings.onSuccess();
					return this;
				
				} else {
					console.log("Invalid use of DataFilter - check above log messages");
				}

				function validate() {
					var valid = true;
					if (state.element.length == 0) valid = logValidationError("Element defined in initialisation can not be found");  
					if ($('#filters').length == 0) valid = logValidationError("No element with id 'filters'");
					if ($('.paginationHolder').length == 0) logValidationWarning("No .paginationHolder class elements for paging"); 
					return valid;
				}	

				function logValidationError(message) {
					console.log(message);
					return false;
				}

				function logValidationWarning(message) {
					console.log(message);
				}	
			}
		}

		function doInit() {
			if (settings.sortingDropDown != undefined) createSortingDropDown(settings.sortingDropDown);

			$.each(settings.dataElements, function(groupName, config) {
				initDataElement(groupName, config);
			});

			applyToFiltersElement();
			applySorting();

			ready(settings.pageSize);			
		}

		function applyToFiltersElement() {
			$('#filters').empty();
			$('#filters').append(state.wrapper);
		}

		function applySorting() {
			if (state.elementType == "TABLE") applySort();	
			if (settings.sortingDropDown != undefined) selectDefaultSortingDropdownItem(settings.sortingDropDown); 			
		}

		function initDataElement(groupName, config) {
			state.filtersInitialised = false;
			sortFn = compareFunctionForDataType[config.dataType]
			state.sort[config.id] = sortFn;
			factoryFn = factoryFunctionForFilterType[config.filterType];

			if (groupName && factoryFn) { 
				var items = config.items;

				if (items == undefined) {
					var data = functionsForElementType[state.elementType].getAllDataForGivenIdFn(config.id);
					items = extractUniqueValues(data, sortFn);
				}
				createFilterGroup(config.id, groupName, factoryFn, items);
			}
		};

		function ready(itemsPerPageValue) {
			state.pauseFilter = false;
			state.filtersInitialised = true;
			state.paging.defaultItemsPerPage = itemsPerPageValue;
			doPaging(1, itemsPerPageValue);	

			if (settings.useApplyButton) {
				addButton("Apply Filters", doFilter);

			} else if (settings.useShowResultsButton) {
				addButton("Show Results", doScrollToResults);
			}

			if (settings.defaultTableSort) {
				var th = $('#'+state.elementId+' thead th:nth-child('+settings.defaultTableSort.id+')');
				th.click();
				if (settings.defaultTableSort.direction && settings.defaultTableSort.direction == "-1") th.click(); 
			}

			state.initialised = true;
		}

		function addButton(text, clickFn) {
			var btn = $(document.createElement("button")).attr({"type": "button", "class": "btn-style"}).click(function() { 
				state.pauseFilter = false;
				clickFn(); 
			}).text(text);
			state.wrapper.append($(document.createElement("div")).append(btn));			
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
			state.pauseFilter = false;

			if (page) state.paging.currentPage = page;
			if (state.paging.currentPage <= 0) state.paging.currentPage = 1;

			if (itemsPerPageValue) state.paging.itemsPerPage = parseInt(itemsPerPageValue);
			if (state.paging.itemsPerPage <= 0) state.paging.itemsPerPage = Number.MAX_VALUE;

			doFilter();
		}

		function filterAfterChange() {
			if(!settings.useApplyButton) filter();
		}

		function filter() {
			state.paging.currentPage = 1;
			doFilter();
		}

		function doFilter() {
			if (!state.filtersInitialised || state.pauseFilter) {
				state.pauseFilter = false;
				return;	
			} 

			var searches = {};
			$('#filters [data-role="filterSetSelector"]').each(function () {
				var type = this.id.split("_")[0];
				var index = this.id.split("_")[1];

				switch (type) {
					case "Checkboxes" : addToSearches(searches, index, getSearchStringForCheckboxGroup(this.id)); break;
					case "Max"        : addToSearches(searches, index, getSearchStringForMaxSelect(this.id)); break;
					case "Min"        : addToSearches(searches, index, getSearchStringForMinSelect(this.id)); break;
				}
			});

			filterRows(matches, searches);
			createPagination();
			scrollToResults();
		}

		function scrollToResults() {
			if ((settings.useApplyButton && state.initialised) || 
					(utils.exists("#scrollTo") && settings.scrollToEnabled && state.initialised)) {

				doScrollToResults();
			}
		}

		function doScrollToResults() {
			$('html, body').animate({
		         scrollTop: $("#scrollTo").offset().top
		    }, 1000);			
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

			var start = utils.now();
			data.each(function() {
			    var matched = matches(this, searches);
			    state.paging.totalItems++;

			    if (matched) {

			    	if (shouldShowItem(visibleItems)) {
			    		$(this).show();
			    		visibleItems++; 
			    	} else {
			    		$(this).hide();	
			    	}

			    	state.paging.numMatchedItems++;	

			    } else {                  
			    	$(this).hide();
			    }
			});	

			//console.log("filtered:" + (utils.now() - start));
			setTimeout(function(){ hideThenShowToFixLayoutIssues(data) }, 0);
			//console.log("hacked:" + (utils.now() - start));
		}

		function hideThenShowToFixLayoutIssues(data) {
			data.each(function() { 
				if ($(this).css('display') != 'none') $(this).hide().show();
			} );
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

			return matched;	
		}

		function doMatch(row, index, value) {
			var cellText = functionsForElementType[state.elementType].extractTextFn(row, index);

			return utils.contains(value, "--M") ? 
				matchesMaxMin(index, cellText, value) :
				matchesRegex(cellText, value);
		}

		function matchesRegex(text, regex) {
			return text.search(new RegExp(regex, "i")) > -1;
		}

		function matchesMaxMin(columnIndex, value, maxMin) {
			var maxMinValue = maxMin.split('_')[1];
			var compareFn = getSortFunctionForColumn(columnIndex);
			var sortDirction = utils.contains(maxMin, "--MAX--_") ? 1 : -1;
			var matched = utils.contains(maxMinValue, "No M") ? true : compareFn(maxMinValue, value, sortDirction) >= 0;
			return matched;
		}

		function getSearchStringForMaxSelect(id) { return getSearchStringForMinMaxSelect(id, "--MAX--_"); }
		function getSearchStringForMinSelect(id) { return getSearchStringForMinMaxSelect(id, "--MIN--_"); }

		function getSearchStringForMinMaxSelect(id, type) {
			return type + $('select#'+id+'>option:selected').val();
		}

		function getSearchStringArrayForMinMaxSelect(index) {
			return [
				getSearchStringForMaxSelect("Max_"+index), 
				getSearchStringForMinSelect("Min_"+index)
			];
		}


		function getSearchStringForCheckboxGroup(id) {
			var searchString = "";
			$('ul#'+id+' li input[type=checkbox]').each(function () {
				if (this.checked) searchString += addToSearchString(searchString, this.value);
			});
			return searchString;
		}

		function addToSearchString(searchString, value) {
			var searchToAdd = matchWordBoundaryIfSingleWordAndDoesNoStartWithTilda(value);
			return (searchString=="" ? searchToAdd : "|" + searchToAdd); 
		}

		function matchWordBoundaryIfSingleWordAndDoesNoStartWithTilda(value) {
			return (utils.startsWith(value, '~') || utils.contains(value, " ")) ? value.substring(1) : matchWordOnly(value);
		}

		function matchWordOnly(word) {
			return "\\b"+utils.extractCurrencyValue(word)+"\\b";
		}

		function createFilterGroup(index, group, factoryFn, items) {
			wrapInFilterGroup(group, factoryFn(items, index));
		}	

		function wrapInFilterGroup(group, element) {
			var filterDiv = $(document.createElement("div")).attr({"class": "filterSet"})
			filterDiv.append($(document.createElement("a")).attr({"class": "filterSelect"}).text(group));
			filterDiv.append(addFilterAttrs(element));	
			state.wrapper.append(filterDiv);	
		}

		function addFilterAttrs(element, idValue) {
			return element.attr({"id": idValue, "class": 'filterContent'})
		}				

		function createMaxWithBanding(items, index) {
			return createMax(getBandedItems(items), index);
		}

		function createMinWithBanding(items, index) {
			var bandedItems = removeLastItemToEnsureAResultIsAlwaysReturned(getBandedItems(items));
			return createMin(bandedItems, index);
		}

		function removeLastItemToEnsureAResultIsAlwaysReturned(items) {
			if (items.length > 1) items.pop();
			return items;
		}		

		function getBandedItems(items) {
			var low = utils.extractCurrencyValue(items[0]);
			var high = utils.extractCurrencyValue(items[items.length-1]);
			var range = parseInt(high) - parseInt(low);
			var step = 10;

			if (range > 350) { step = 100 } else
			if (range > 175) { step = 50  } else  
			if (range >  75) { step = 25  } else 
			if (range >  60) { step = 20  }

			var noItems = parseInt(range / step) + 1;
			var startFrom = (low - (low%step)) + step;
			if ((noItems-1)*step + startFrom < high) noItems++;

			var bandedItems = [];
			if (low == 0) {
				bandedItems.push("Free");	
				startFrom = startFrom + step;
			} 

			for (i=0; i< noItems; i++) {
				bandedItems.push("£" + (startFrom + i*step));
			}
			return bandedItems;			
		}

		function createMinMax(items, id) {
			var ul = $(document.createElement("ul")).attr({"id": 'MaxMin_'+id, "class": "MaxMin"});
			ul.append(wrapSelectInLi(createSelectlabel(id,"Min","From: "), createSelect(items,id,"Min")));
			ul.append(wrapSelectInLi(createSelectlabel(id,"Max","Up to: "), createSelect(items,id,"Max")));
			
			var containerDiv = $(document.createElement("div"));
			createSlider(containerDiv, items, id, "MaxMin");
			containerDiv.append(ul);
			
			return containerDiv;
		}

		function wrapSelectInLi(label, select) {
			return $(document.createElement("li")).append(label).append(select);
		}			

		function createMax(items, index) {
			return createSelectAndSlider(items, index, "Max", "Up to: ");

		}

		function createMin(items, index) {
			return createSelectAndSlider(items, index, "Min", "From: ");
		}

		function createSelectAndSlider(items, id, type, labelForSelect) {
			var containerDiv = $(document.createElement("div"));
			createSlider(containerDiv, items, id, type);
			containerDiv.append(createSelectlabel(id, type, labelForSelect));
			containerDiv.append(createSelect(items, id, type, labelForSelect));
			return containerDiv;
		}

		function createSelect(items, id, type) {
			id = type+'_'+id;
			var select = $(document.createElement("select")).attr({"id": id, "data-role": "filterSetSelector"});
			
			if (type == "Min") select.append($(document.createElement("option")).text("No Min"));

			$.each(items, function(iteration, item) {
			    select.append($(document.createElement("option")).prop("value", item).text(textForSelect(item)));
			});

			select.change(function(event) {
				updateSliderLabel(id, this.value);
				moveSlider(id, this.selectedIndex);
		        filterAfterChange();
		    })	

			if (type == "Max") select.append($(document.createElement("option")).attr({"selected": true}).text("No Max"));

		    return select;
		}

		function textForSelect(text) {
			return text;
			// return (text == "£0") ? "Free" : text;
		}

		function createSelectlabel(id, type, labelForSelect) {
			return $(document.createElement("label")).attr({"id": "selectLabel_"+type+"_"+id, "class": "selectLabel"}).text(labelForSelect)
		}

		function createSlider(containerDiv, items, id, type) {
			if (!settings.slidersEnabled) return containerDiv;

			id = type+'_'+id;
			var handles = (type == "MaxMin") ? 2 : 1;
			var sliderDiv = $(document.createElement("div")).attr({"id": "slider_"+id, "class": "noUiSlider"});
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

			var labelDiv = $(document.createElement("div")).attr({"id": "sliderLabel_"+id, "class": "noUiSliderLabel"}).text("-");
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
				var from = (utils.contains(id, "Max")) ? "No Min" : value;
				var to =   (utils.contains(id, "Min")) ? "No Max" : value; 

				return getMinMaxLabel(from, to);
			}
		}

		function getMinMaxLabel(from, to) {
			if (from == "No Min" && to == "No Max") {
				return "Show All";
			
			} else if (to == "No Max") {
				return "From " + from;
			
			} else if (from == "No Min") {
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
			state.pauseFilter = true;
			if (utils.exists('#slider_'+id)) {
				var knob = (utils.contains(id, "MaxMin")) ? "1" : "0";
				$('#slider_'+id).noUiSlider('move', { knob: knob, to: index });	
			
			} else {
				var knob = (utils.contains(id, "Max")) ? "1" : "0";
				id = id.split("_")[1];

				if (utils.exists('#slider_MaxMin_'+id)) $('#slider_MaxMin_'+id).noUiSlider('move', { knob: knob, to: index });
			}
		}

		function createCheckboxes(items, index) {
			var ul = $(document.createElement("ul")).attr({"id": 'Checkboxes_'+index, "data-role": "filterSetSelector"});
			$.each(items, function(iteration, item) {
			    ul.append(
			    	$(document.createElement("li")).attr({"class": "checkboxLi"})
			   		.append(createCheckboxLabel(item).prepend(createCheckbox(item, index)))
			   )
			});
			return ul;	
		}

		function createCheckbox(item, index) {
		    return $(document.createElement("input")).attr({
		        "id":    index + '_' + item
		       ,"class": "filterCheckbox" 
		       ,"name":  index
		       ,"value": item
		       ,"type":  'checkbox'
		       ,"checked":false
		    })
		    .click(function(event) {
		        filterAfterChange();
		    });
		}

		function createCheckboxLabel(item) {
			// remove tilda used for non-exact word searching for display
			item = utils.startsWith(item, '~') ? item.substring(1) : item;
		    return $(document.createElement('label')).text(item);
		}

		function createPagination() {
			$('.paginationHolder').each(function(){
				$(this).empty().append(createPaginationUl());
			});	
		}

		function createPaginationUl() {
			var from = ((state.paging.currentPage-1) * state.paging.itemsPerPage) + 1;
			var to = ((state.paging.currentPage) * state.paging.itemsPerPage);
			if (to > state.paging.numMatchedItems) to = state.paging.numMatchedItems;

			var numPages = parseInt((state.paging.numMatchedItems/state.paging.itemsPerPage) + ((state.paging.numMatchedItems%state.paging.itemsPerPage > 0) ? 1 : 0)); 
			var prev = (state.paging.currentPage>1) ? state.paging.currentPage-1 : 1;
			var next = (state.paging.currentPage<numPages) ? state.paging.currentPage+1 : numPages;
			if (next > numPages) next = numPages;

			var ul = $(document.createElement("ul")).attr({"class": "pagination"});
			ul.append($(document.createElement("li")).attr({"class": "showing"}).text("Showing " + from + " - " + to + " of " + state.paging.numMatchedItems));

			pagingNextPrevLi(ul, "&laquo;", "Skip to first page", 1);
			pagingNextPrevLi(ul, "&lsaquo;", "Skip to previous page", prev);

			for (i=1; i<=numPages; i++) {
				var li = $(document.createElement("li"));
				if (i == state.paging.currentPage) li.attr({"class": "active"});
				
				ul.append(li.append($(document.createElement("a")).text(i).click(function(event) {
					doPaging(event.currentTarget.text);
				})));		
			}

			pagingNextPrevLi(ul, "&rsaquo;",  "Skip to next page", next);
			pagingNextPrevLi(ul, "&raquo;", "Skip to last page", numPages);

			if (state.paging.numMatchedItems > state.paging.itemsPerPage) {
				pagingShowAllLi(ul, "Show All", 1, -1);

			} else if (state.paging.defaultItemsPerPage > 0 && state.paging.itemsPerPage > state.paging.defaultItemsPerPage) {
				pagingShowAllLi(ul, "Show Less", 1, state.paging.defaultItemsPerPage);
			}

			return ul;
		}

		function pagingShowAllLi(ul, text, currentPageParam, itemsPerPageParam) {
			ul.append($(document.createElement("li")).append($(document.createElement("a")).attr({"class": "pagingShow"}).text(text).click(function(event) {
				doPaging(currentPageParam, itemsPerPageParam);
			})));		
		}

		function pagingNextPrevLi(ul, pagingSymbol, altText, currentPageParam) {
			ul.append($(document.createElement("li")).append($(document.createElement("a")).click(function(event) {
				doPaging(currentPageParam);
			}).html(pagingSymbol)));		
		}

		function getSortFunctionForColumn(column) {
			if ($.isNumeric(column)) column = parseInt(column)+1;
			return state.sort[column];
		}

		function createSortingDropDown(items) {
			var select = $(document.createElement("select")).attr({"id": "sortBySelect"});
			select.append($(document.createElement("option")).prop("value", "sortBy").text("Sort by..."));
			$.each(items, function(key, sortConfig) {
				var value = sortConfig.id + "_" + sortConfig.direction;
			    select.append($(document.createElement("option")).prop("value", value).text(key));
			});
			select.change(function(event) {
				var key = $('select#sortBySelect>option:selected').val();
				if (key != "sortBy") sortData(state.element, functionsForElementType[state.elementType].getAllDataFn(), key.split('_')[0], key.split('_')[1]);
		    });
			wrapInFilterGroup("Sort by", select);   
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
			if (!utils.contains(th.attr("class"), "sorting") || utils.contains(th.attr("class"), "sortable") ) return;

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
			sortItems: function(items, compareFn) {
				if (typeof compareFn == "string") compareFn = compare[compareFn];
				items.sort(function(a,b) { return compareFn(a,b,1) } );
				return items;
			},

			compareMinsText: function(a,b,direction) { return compare.compare(compare.strPad(a, 10),    compare.strPad(b, 10),    direction) },
			compareData:     function(a,b,direction) { return compare.compare(compare.convertData(a),   compare.convertData(b),   direction) },
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

			convertData: function(data) {
				var data = data.replace("GB", "000000").replace("MB", "000");
				return compare.strPad(data, 10);
			},

			convertPeriod: function(period) {
				var period = period.replace("P", "").replace("D", "").replace("M", "00");
				return compare.strPad(period, 10);
			}
		}	

		utils = {

			extractCurrencyValue: function(string) {
				if (string == undefined) return "";

				var trimmedString = string.trim();
				if (string.indexOf('£') != -1) {
					return utils.replaceAll(trimmedString, '£', '');
				
				} else if (trimmedString == "Free") {
					return "0";

				} else {
					return string;
				}
			},

			substringAfterLast: function(string, delimiter) {
				return(string.indexOf(delimiter) > -1) ? string.substring(string.lastIndexOf(delimiter)+1) : "";
			},	

			contains: function(value, text) {
				return (value) && value.indexOf(text) != -1;
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

			startsWith: function(txt, fragment) {
				return txt.indexOf(fragment) == 0;
			}											
		}	

		// configuration section
	    var compareFunctionForDataType = {
	    	"default"  : compare.compare,
	    	"data"     : compare.compareData,
	    	"currency" : compare.compareCurrency,
	    	"period"   : compare.comparePeriod,
	    	"minsText" : compare.compareMinsText
	    }	

	    var factoryFunctionForFilterType = {
	    	"checkboxes"     : createCheckboxes,
	    	"min"            : createMin,
	    	"max"            : createMax,
	    	"minMax"         : createMinMax,
	    	"minWithBanding" : createMinWithBanding,
	    	"maxWithBanding" : createMaxWithBanding
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