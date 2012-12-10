test("Test logging", function() {
	var logs = [];
	remove();
	setUpList();
	$('#filters').empty().remove();	
	$('#tariffList').DataFilter('init', { 
        "filters": [
            { "heading": "Test1", "id": "testClass1",  "dataType": "default",  "filterType": "checkboxes" },
        ],
        logFn: function(string) { logs.push(string) }
	});

});

test("Test List", function(sortBy) { 
	remove();
	setUpList();
	initDataFilterForList();
	commonTests('#tariffList', '#tariffList li'); 
});

test("Test List with sortBy", function(sortBy) { 
	remove();
	setUpList();
	initDataFilterForList(getSortingDropdownItems());
	sortingTestsForList();
});

test("Test no paging", function() {
	remove();
	setUpTable();
	initDataFilterForTableWithNoPaging();
	equal($('#tariffTable tbody tr:visible').length, 10, "All rows (10) visible");
	equal($('ul.pagination li:nth-child(1)').text(), "Showing 10 items", "Validate showing paging element does not show page numbers");

	selectCheckbox('tariffTable',1,2)
	equal($('#tariffTable tbody tr:visible').length, 1, "Should be 1 row visible");
	equal($('#tariffTable tbody tr:visible').eq(0).text(), getTextForRow(1), "Validate first row of text is " + getTextForRow(1));	
});

test("Test free text search", function() {
	remove();
	setUpTable();
	initDataFilterForTableWithTextSearch();
	equal($('#tariffTable tbody tr:visible').length, 10, "All rows (10) visible");

	selectCheckbox('tariffTable',1,2);
	selectCheckbox('tariffTable',1,3);
	selectCheckbox('tariffTable',1,4);
	equal($('#tariffTable tbody tr:visible').length, 3, "Should be 3 rows visible - 3 checkboxes selected");

	$('#freeTextSearch').val("row1");
	var event = jQuery.Event("keyup");
	$("#freeTextSearch").trigger(event);	

	equal($('#tariffTable tbody tr:visible').length, 2, "Should be 2 rows visible - 3 checkboxes selected, but only 2 rows match text");	
});

test("Test custom text extract", function() {
	remove();
	setUpTable();
	initDataFilterForTableWithCustomTextExtract();
	equal($('ul#Checkboxes_1 li input[type="checkbox"]').length, 11, "Should be 11 checkboxes");
	equal($('#tariffTable tbody tr:visible').length, 4, "Should be 4 rows visible");
	equal($('ul#Checkboxes_1 li label').eq(0).text(), "All", "First checkbox text should be All");
	equal($('ul#Checkboxes_1 li label').eq(1).text(), "row1", "2nd checkbox text should be row1");
	equal($('ul#Checkboxes_1 li input[type="checkbox"]').eq(1).prop("name"), "row1", "2nd checkbox value should be row1");
	equal($('#tariffTable tbody tr:visible').eq(0).text(), getTextForRow(1), "Validate first row of text is " + getTextForRow(1));

	selectCheckbox('tariffTable',1,2)
	equal($('#tariffTable tbody tr:visible').length, 1, "Should be 1 row visible");
	equal($('#tariffTable tbody tr:visible').eq(0).text(), getTextForRow(1), "Validate first row of text is " + getTextForRow(1));
});

test("Test Table", function() {
	remove();
	setUpTable();
	initDataFilterForTable(
		function() {
			$('#qunit').append($(document.createElement('label')).prop("id", "success").text("success"));
		},
		function () {
			$('#qunit #success').text("filtered");	
		}
	);
	equal($('#success').text(), "success", "Should add success label using onSuccess callback");
	commonTests('#tariffTable', '#tariffTable tbody tr');
	sortingTestsForTable('#tariffTable');
	equal($('#success').text(), "filtered", "Should updated success label after filter using callback")

	setTimeout(function() { 
		test("Test Table Delayed slider test", function() { 
			toggleShowAllLess();
			minWithSliderTest('#tariffTable'); 
			maxWithSliderTest('#tariffTable');
			maxMinWithSliderTest('#tariffTable');
			remove();
		}); 
	}, 100);	
});

function commonTests(element, selector) {
	equal($(selector).length, 10, "Should be a total of 10 elements"); ;
	equal($(selector+':visible').length, 4, "4 elements should be visible");
	equal($(selector+':visible').eq(0).text(), getTextForRow(1), "Validate first row");

	pagingTests(selector);
	dropdownTests(element, selector);
	checkboxTests(element, selector);
	rangeBandingTests(element, selector);
}

function pagingTests(selector) {

	equal($('ul.pagination li:nth-child(1)').text(), "Showing 1 - 4 of 10 items", "Validate showing paging element");

	// show last page
	clickPagingElement(6);
	equal($(selector+':visible').length, 2, "Last page should have 2 rows");
	equal($(selector+':visible').eq(0).text(), getTextForRow(9), "Validate first row on last page");	
	equal($('ul.pagination').children().length, 9, "Should have 3 pages, showing, show all, next, prev, first, last");

	// trigger show all
	equal($('ul.pagination li:nth-child(9)').text(), "Show All", "Should have Show All option");	
	toggleShowAllLess();
	equal($('ul.pagination li:nth-child(2)').text(), "First Page", "Should have First Page option after clicking show all");
	equal($(selector+':visible').length, 10, "After clicking show all 10 elements should be visible");
	equal($('ul.pagination').children().length, 2, "Should have just showing and First Page");

	// trigger First Page
	toggleShowAllLess();
	equal($('ul.pagination li:nth-child(9)').text(), "Show All", "Should have Show All option after clicking First Page");	
	equal($(selector+':visible').length, 4, "8 elements should be visible after clicking First Page");	

	function testPaging(elementToClick, pageToGoTo, previousPage, numVisibileItems, selector) {
		clickPagingElement(elementToClick);
		equal($('ul.pagination li:nth-child('+(pageToGoTo+3)+')').text(), pageToGoTo+"", "Validate element "+elementToClick+" in paging is page "+pageToGoTo);
		equal($('ul.pagination li:nth-child('+(pageToGoTo+3)+')').attr("class"), "pageNumber active", "Page "+pageToGoTo+" should have active class");	
		equal($('ul.pagination li:nth-child('+(previousPage+3)+')').attr("class"), "pageNumber", "Page "+previousPage+" should have no class");
		equal($(selector+':visible').length, numVisibileItems, numVisibileItems+" elements should be visible");	
	}

	testPaging(7, 2, 1, 4, selector);  // next
	testPaging(8, 3, 2, 2, selector);  // last
	testPaging(3, 2, 3, 4, selector);  // prev
	testPaging(2, 1, 2, 4, selector);  // first

	// leave on all
	toggleShowAllLess();
	equal($('ul.pagination li:nth-child(2)').text(), "First Page", "Should have First Page option after clicking show all");
}

function dropdownTests(element, selector) {

	// check initial state
	equal($("select[id*='MultiSelect_'] option").length, 11, "Select list should be 11 items");
	equal($("select[id*='MultiSelect_'] option:selected").text(), "Select to add", "Default value should be 'Select to add'");
	equal($(selector+":visible").length, 10, "Should be 10 rows when nothing selected");

	// select item - should remove from dropwdown and add to div
	selectSelect($("select[id*='MultiSelect_']"), 3);
	equal($("select[id*='MultiSelect_'] option").length, 10, "Select list should be 10 items - was 11");
	equal($("div[id*='MultiSelectItems_']").find('p').text(), "row2-col8", "row2-col8 shoulld be added to list of items div");
	equal($("select[id*='MultiSelect_'] option:selected").text(), "Select to add", "Default value should return to 'Select to add");
	equal($(selector+":visible").length, 1, "Should be 1 row visible");

	// select item - should remove from dropwdown and add to div
	selectSelect($("select[id*='MultiSelect_']"), 3);
	equal($("select[id*='MultiSelect_'] option").length, 9, "Select list should be 9 items - was 1o");
	equal($("div[id*='MultiSelectItems_']").find('p').text(), "row2-col8row3-col8", "row3-col8 shoulld be added to list of items div");
	equal($("select[id*='MultiSelect_'] option:selected").text(), "Select to add", "Default value should return to 'Select to add");
	equal($(selector+":visible").length, 2, "Should be 2 row visible");

	// reset - click all items that have been selected
	$("div[id*='MultiSelectItems_'] p").click();
	equal($("select[id*='MultiSelect_'] option").length, 11, "Select list should be 11 items");
	equal($("select[id*='MultiSelect_'] option:selected").text(), "Select to add", "Default value should be 'Select to add'");
	equal($(selector+":visible").length, 10, "Should be 10 rows when nothing selected");
}	

function checkboxTests(element, selector) {
	equal($("ul[id*='Checkboxes']").eq(0).find("li").length, 11, "Should be 11 checkboxes as all elements are different so one for each and All checkbox");

	var all = getCheckbox(element, 1, 1);
	equal(all.attr('name'), "All", "First checkbox text should be All");
	equal(all.attr('checked'), "checked", "All checkbox should be checked");
	
	equal(selectCheckbox(element, 1, 2), "row1-col1", "Select and check first checkbox is row1-col1");
	equal(getCheckbox(element, 1, 1).attr('checked'), undefined, "All checkbox should not be checked");
	equal($(selector+":visible").length, 1, "Should be 1 row when 1 checkbox selected");
	equal($(selector+':visible').eq(0).text(), getTextForRow(1), "Should be first row");

	equal(selectCheckbox(element, 1, 3), "row10-col1", "Select and check second checkbox is row10-col1 - (2nd row is 10 as 10 is sorted after 1)");
 	equal($(selector+":visible").length, 2, "Should be 2 rows when 2 checkboxes selected");	
 	equal($(selector+':visible').eq(1).text(), getTextForRow(10), "2nd row should be row10");
 	clearAllCheckboxes(element,1);

 	equal(getCheckbox(element,1,1).attr('checked'), "checked", "All checkbox should be checked");
 	equal(selectCheckbox(element, 2, 2), "~row1", "Select and check first checkbox in second list is row1");	
 	equal($(selector+":visible").length, 2, "Should be 2 rows when checkbox row1 selected as configured to non-word matching so matches row1 & row10");
 	clearAllCheckboxes(element, 2);
 	
 	equal(all.attr('checked'), "checked", "All checkbox should be checked");
 	equal(selectCheckbox(element, 2, 3), "row2", "Select and check second checkbox in second list is row2");	
 	equal($(selector+":visible").length, 1, "Should be 1 row when checkbox row2 selected as configured for word matching."); 	
 	clearAllCheckboxes(element, 2);
}

function rangeBandingTests(element, selector) {
	equal($(selector+":visible").length, 10, "Should be 10 rows visible before starting range tests");

	equal($("ul[id*='Checkboxes']").eq(2).find("li").length, 5, "Should be 5 checkboxes - All, up to 25, 25-50, 50-75, 75-100");
	equal(getCheckbox(element,3,1).prop("checked"), true, "Check first range checkbox is selected");
	equal(getCheckbox(element,3,1).parent().text(), "All", "Check first range checkbox is All");
	equal(getCheckbox(element,3,2).parent().text(), "up to £25", "Check second range checkbox");
	equal(getCheckbox(element,3,3).parent().text(), "£25 - £50", "Check third range checkbox");
	equal(getCheckbox(element,3,4).parent().text(), "£50 - £75", "Check fouth range checkbox");
	equal(getCheckbox(element,3,5).parent().text(), "£75 - £100", "Check fifth range checkbox");
	
	selectCheckbox(element,3,2);
	equal($(selector+":visible").length, 2, "Should be 2 rows visible when 'up to £25' selected");

	clearAllCheckboxes(element,3);
	equal($(selector+":visible").length, 10, "Should be 10 rows visible after resetting range tests");
	
	selectCheckbox(element,3,3);
	equal($(selector+":visible").length, 3, "Should be 3 rows visible when '£25 - £50' selected");	

	selectCheckbox(element,3,2);
	selectCheckbox(element,3,4);
	selectCheckbox(element,3,5);
	equal($(selector+":visible").length, 10, "Should be 10 rows visible when all checkboxes selected individually");

	clearAllCheckboxes(element,3);
}

function minWithSliderTest(element) {
	sliderTest(element, 2, "Min", "From", "row7-col2", 8, 0);
	checkDropdownMovesSlider(element, 2, "Min", 8, 0, "144px", "0px");
}

function maxWithSliderTest(element) {
	sliderTest(element, 3, "Max", "Up to", "row3-col3", 2, 10);
	checkDropdownMovesSlider(element, 3, "Max", 2, 10, "36px", "180px");
}

function maxMinWithSliderTest(element) {
	sliderTest(element, 4, "Min", "From", "row7-col4", 8, 0, true);
	sliderTest(element, 4, "Max", "Up to", "row2-col4", 2, 10, true, 1);

	$('#slider_MaxMin_4').noUiSlider('move', { knob: 0, to: 3 });
	$('#slider_MaxMin_4').noUiSlider('move', { knob: 1, to: 7 });
	equal($(element+" tbody tr:visible").length, 6, "Should only be 6 visible rows)");	
}

function sliderTest(element, filterNum, type, label, selectText, toNum, resetNum, isMaxMin, knob) {
	var id = type+"_"+filterNum;
	var sliderId = id;
	if (isMaxMin) sliderId = "MaxMin_"+filterNum;
	if (knob == undefined) knob = 0;

	// check defaults
	var filter = $(".filterSet").eq(filterNum);
	equal(filter.find("a").text(), "Test"+filterNum, "Filter "+(filterNum+1)+" should be for Test"+filterNum);
	equal(filter.find("#sliderLabel_"+sliderId).text(), "Show All", "Slider label should be defaulted to 'Show All'");
	equal($('#'+id+' option:selected').text(), "No "+type, "Associated dropdown should be set to 'No "+type+"'");
	equal($('#selectLabel_'+id).text(), label+": ", "Associated dropdown label should be '"+label+": '");

	// move slider
	$('#slider_'+sliderId).noUiSlider('move', { knob: knob, to: toNum });	
	equal(filter.find("#sliderLabel_"+sliderId).text(), label+" "+selectText, "Label should update to "+label+"' row3-col3' when moved to position "+toNum);
	equal($(element+" tbody tr:visible").length, 3, "Should only be 3 visible rows)");	
	equal($('#'+id+' option:selected').text(), selectText, "Associated dropdown should be set to '"+selectText+"'");	

	// reset slider
	$('#slider_'+sliderId).noUiSlider('move', { knob: knob, to: resetNum });	
	equal($(element+" tbody tr:visible").length, 10, "Should 10 visible rows");
	equal($('#'+id+' option:selected').text(), "No "+type, "Associated dropdown should be set to 'No "+type+"'");	
}

function checkDropdownMovesSlider(element, filterNum, type, toNum, resetNum, toPx, resetPx) {
	var id = type+"_"+filterNum;
	
	// select dropwdown
	selectSelectById(id, toNum);
	equal($("#slider_"+id).find(".noUi-handle").css("left"), toPx, "Slider should move to "+toPx+"+ when option "+toNum+" selected");
	equal($(element+" tbody tr:visible").length, 3, "Should only be 3 visible rows");	

	// reset
	selectSelectById(id, resetNum);
	equal($("#slider_"+id).find(".noUi-handle").css("left"), resetPx, "Slider should move to "+resetPx+" when reset");
	equal($(element+" tbody tr:visible").length, 10, "Should 10 visible rows");	
}

function sortingTestsForTable(table) {
	var asc = ["row1-col1","row10-col1","row2-col1","row3-col1"];
	var dsc = ["row9-col1","row8-col1","row7-col1","row6-col1"];

	equal($(table+" tbody tr:visible").length, 10, "Check 10 rows showing before sorting tests");
	sortingTestsForColumn(table, 1, asc, dsc);

	toggleShowAllLess();
	equal($(table+" tbody tr:visible").length, 4, "Check 4 rows showing after showing less");
	sortingTestsForColumn(table, 1, asc, dsc);
	equal(getCurrentPage(), "1", "Should go to page 1 after sorting");

	clickPagingElement(5);
	equal(getCurrentPage(), "2", "Validate currently on page 2");
	sortingTestsForColumn(table, 1, asc, dsc);
	equal(getCurrentPage(), "1", "Should go to page 1 after sorting");

	// configured to sort using period
	asc = ["row1-col3","row2-col3","row3-col3","row4-col3"];
	dsc = ["row10-col3","row9-col3","row8-col3","row7-col3"];
	sortingTestsForColumn(table, 3, asc, dsc);

	// configured to sort using default
	asc = ["row1-col4","row10-col4","row2-col4","row3-col4"];
	dsc = ["row9-col4","row8-col4","row7-col4","row6-col4"];
	sortingTestsForColumn(table, 4, asc, dsc);

	// configured to sort using to sort using currency
	asc = ["£10","£20","£30","£40"];
	dsc = ["£100","£90","£80","£70"];
	sortingTestsForColumn(table, 6, asc, dsc);	

}

function sortingTestsForColumn(table, colNum, asc, dsc) {
	function sortByColumn(table, colNum) { $(table+" thead th:nth-child("+colNum+")").click(); }

	sortByColumn(table, colNum);
	assertSortOrder(table, colNum, asc);

	sortByColumn(table, colNum);
	assertSortOrder(table, colNum, dsc);	
}

function sortingTestsForList() {
	function nthOption(n) {return $("#sortBySelect option:nth-child("+n+")") }

	equal($("#sortBySelect option").length, 9, "Should be 9 entries in sorting dropdown - 8 options and sortby");
	equal(nthOption(1).text(), "Sort by", "First elemnt in sorting drop down");
	equal(nthOption(3).text(), "test1 - highest", "Check another element in sorting dropdown");
	equal(nthOption(3).attr("selected"), "selected", "Configured default option should be selected"); 
	assertSortOrderForList("#tariffList", "testClass1", ["row9-col1","row8-col1","row7-col1","row6-col1"]);
	
	nthOption(2).prop("selected", "selected");
	$("#sortBySelect").change();
	assertSortOrderForList("#tariffList", "testClass1", ["row1-col1","row10-col1","row2-col1","row3-col1"]);

	// tests currency sort order
	assertSortOrderForList("#tariffList", "testClass2", ["row10-col2","row1-col2","row9-col2","row8-col2"]);
	nthOption(9).prop("selected", "selected");
	$("#sortBySelect").change();
	assertSortOrderForList("#tariffList", "testClass6", ["£100","£90","£80","£70"]);		
}

function assertSortOrder(table, colNum, sortOrder) {
	for (i=0; i<sortOrder.length; i++) {
		equal($(table+" tbody tr").eq(i).find("td:nth-child("+(colNum)+")").text(), sortOrder[i], "For col " + colNum + " Row "+(i+1)+" should be " + sortOrder[i]);
	}
}

function assertSortOrderForList(list, id, sortOrder) {
	for (i=0; i<sortOrder.length; i++) {
		equal($(list+" li").eq(i).find("."+id).text(), sortOrder[i], "List item "+(i+1)+" should be " + sortOrder[i]);
	}
}

function toggleShowAllLess() {
	$('#paginationHolder a.pagingShow').click();
}

function clickPagingElement(num) {
	$('ul.pagination li:nth-child('+num+') a').click();
}

function getCurrentPage() {
	return $('ul.pagination li.active a').text();	
}

function getCheckbox(element,ulNum,liNum) {
	return $("ul[id*='Checkboxes']").eq(ulNum-1).find("li:nth-child("+liNum+") input");	
}

function selectCheckbox(element,ulNum,liNum) {
	var checkbox = getCheckbox(element,ulNum,liNum);
	checkbox.prop("checked", true).click().prop("checked", true);	
	return checkbox.attr('name');
}

function selectSelectById(id, index) {
	selectSelect($('select#'+id), index);
}

function selectSelect(select, index) {
	select.find('option').eq(index).prop('selected', 'selected');
	select.change();

}

function clearAllCheckboxes(element,ulNum) {
	getCheckbox(element,ulNum,1).click().prop("checked", true);	
}

function getTextForRow(n) {
	return "row"+n+"-col1row"+(11-n)+"-col2row"+n+"-col3row"+n+"-col4£"+(n%4)+"£"+(n*10)+"row"+(n%5)+"-col7row"+n+"-col8row"+n+"-col9£"+(n*10);
}
