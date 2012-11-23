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

test("Test custom text extract", function() {
	remove();
	setUpTable();
	initDataFilterForTableWithCustomTextExtract();
	equal($('ul#Checkboxes_1 li input[type="checkbox"]').length, 10, "Should be 10 checkboxes");
	equal($('#tariffTable tbody tr:visible').length, 4, "Should be 4 rows visible");
	equal($('ul#Checkboxes_1 li label').eq(0).text(), "row1", "First checkbox text should be row1");
	equal($('ul#Checkboxes_1 li input[type="checkbox"]').eq(0).prop("value"), "row1", "First checkbox value should be row1");
	equal($('#tariffTable tbody tr:visible').eq(0).text(), getTextForRow(1), "Validate first row of text is " + getTextForRow(1));

	selectCheckbox('tariffTable',1,1)
	equal($('#tariffTable tbody tr:visible').length, 1, "Should be 1 row visible");
	equal($('#tariffTable tbody tr:visible').eq(0).text(), getTextForRow(1), "Validate first row of text is " + getTextForRow(1));
});

test("Test Table", function() {
	remove();
	setUpTable();
	initDataFilterForTable(function() {
		$('#qunit').append($(document.createElement('label')).prop("id", "success").text("success"));
	});
	equal($('#success').text(), "success", "Should add success label using onSuccess callback");
	commonTests('#tariffTable', '#tariffTable tbody tr');
	sortingTestsForTable('#tariffTable');

	setTimeout(function() { 
		test("Test Table Delayed slider test", function() { 
			toggleShowAllLess();
			minWithSliderTest('#tariffTable'); 
			maxWithSliderTest('#tariffTable');
			maxMinWithSliderTest('#tariffTable');
			remove();
		}); 
	}, 1);	
});


function commonTests(element, selector) {
	equal($(selector).length, 10, "Should be a total of 10 elements"); ;
	equal($(selector+':visible').length, 4, "4 elements should be visible");
	equal($(selector+':visible').eq(0).text(), getTextForRow(1), "Validate first row");

	pagingTests(selector);
	checkboxTests(element, selector);
}

function pagingTests(selector) {

	equal($('ul.pagination li:nth-child(1)').text(), "Showing 1 - 4 of 10", "Validate showing paging element");

	// show last page
	clickPagingElement(6);
	equal($(selector+':visible').length, 2, "Last page should have 2 rows");
	equal($(selector+':visible').eq(0).text(), getTextForRow(9), "Validate first row on last page");	
	equal($('ul.pagination').children().length, 9, "Should have 3 pages, showing, show all, next, prev, first, last");

	// trigger show all
	equal($('ul.pagination li:nth-child(9)').text(), "Show All", "Should have Show All option");	
	toggleShowAllLess();
	equal($('ul.pagination li:nth-child(7)').text(), "Show Less", "Should have Show Less option after clicking show all");
	equal($(selector+':visible').length, 10, "After clicking show all 10 elements should be visible");
	equal($('ul.pagination').children().length, 7, "Should have 1 page, showing, show all, next, prev, first & last");

	// trigger show less
	toggleShowAllLess();
	equal($('ul.pagination li:nth-child(9)').text(), "Show All", "Should have Show All option after clicking show less");	
	equal($(selector+':visible').length, 4, "8 elements should be visible after clicking show less");	

	function testPaging(elementToClick, pageToGoTo, previousPage, numVisibileItems, selector) {
		clickPagingElement(elementToClick);
		equal($('ul.pagination li:nth-child('+(pageToGoTo+3)+')').text(), pageToGoTo+"", "Validate element "+elementToClick+" in paging is page "+pageToGoTo);
		equal($('ul.pagination li:nth-child('+(pageToGoTo+3)+')').attr("class"), "active", "Page "+pageToGoTo+" should have active class");	
		equal($('ul.pagination li:nth-child('+(previousPage+3)+')').attr("class"), undefined, "Page "+previousPage+" should have no class");
		equal($(selector+':visible').length, numVisibileItems, numVisibileItems+" elements should be visible");	
	}

	testPaging(7, 2, 1, 4, selector);  // next
	testPaging(8, 3, 2, 2, selector);  // last
	testPaging(3, 2, 3, 4, selector);  // prev
	testPaging(2, 1, 2, 4, selector);  // first

	// leave on all
	toggleShowAllLess();
	equal($('ul.pagination li:nth-child(7)').text(), "Show Less", "Should have Show Less option after clicking show all");
}

function checkboxTests(element, selector) {
	equal($("ul[id*='Checkboxes']").eq(0).find("li").length, 10, "Should be 100 checkboxes as all elements are different");
	
	equal(selectCheckbox(element, 1, 1), "row1-col1", "Select and check first checkbox is row1-col1");
	equal($(selector+":visible").length, 1, "Should be 1 row when 1 checkbox selected");
	equal($(selector+':visible').eq(0).text(), getTextForRow(1), "Should be first row");

	equal(selectCheckbox(element, 1, 2), "row10-col1", "Select and check second checkbox is row10-col1 - (2nd row is 10 as 10 is sorted after 1)");
 	equal($(selector+":visible").length, 2, "Should be 2 rows when 2 checkboxes selected");	
 	equal($(selector+':visible').eq(1).text(), getTextForRow(10), "2nd row should be row10");

 	clearAllCheckboxes();
 	equal(selectCheckbox(element, 2, 1), "~row1", "Select and check first checkbox in second list is row1");	
 	equal($(selector+":visible").length, 2, "Should be 2 rows when checkbox row1 selected as configured to non-word matching so matches row1 & row10");

 	clearAllCheckboxes();
 	equal(selectCheckbox(element, 2, 2), "row2", "Select and check second checkbox in second list is row2");	
 	equal($(selector+":visible").length, 1, "Should be 1 row when checkbox row2 selected as configured for word matching."); 	

 	clearAllCheckboxes();
}

function minWithSliderTest(element) {
	sliderTest(element, 2, "Min", "From", "row7-col2", 8, 0);
}

function maxWithSliderTest(element) {
	sliderTest(element, 3, "Max", "Up to", "row3-col3", 2, 10);
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

	var filter = $(".filterSet").eq(filterNum);
	equal(filter.find("a").text(), "Test"+filterNum, "Filter "+(filterNum+1)+" should be for Test"+filterNum);
	equal(filter.find("#sliderLabel_"+sliderId).text(), "Show All", "Slider label should be defaulted to 'Show All'");
	equal($('#'+id+' option:selected').text(), "No "+type, "Associated dropdown should be set to 'No "+type+"'");
	equal($('#selectLabel_'+id).text(), label+": ", "Associated dropdown label should be '"+label+": '");

	$('#slider_'+sliderId).noUiSlider('move', { knob: knob, to: toNum });	
	equal(filter.find("#sliderLabel_"+sliderId).text(), label+" "+selectText, "Label should update to "+label+"' row3-col3' when moved to position "+toNum);
	equal($(element+" tbody tr:visible").length, 3, "Should only be 3 visible rows)");	
	equal($('#'+id+' option:selected').text(), selectText, "Associated dropdown should be set to '"+selectText+"'");	

	$('#slider_'+sliderId).noUiSlider('move', { knob: knob, to: resetNum });	
	equal($(element+" tbody tr:visible").length, 10, "Should 10 visible rows");
	equal($('#'+id+' option:selected').text(), "No "+type, "Associated dropdown should be set to 'No "+type+"'");	
}

function sortingTestsForTable(table) {
	var asc = ["row1-col1","row10-col1","row2-col1","row3-col1"];
	var dsc = ["row9-col1","row8-col1","row7-col1","row6-col1"];

	equal($(table+" tbody tr:visible").length, 10, "Check 10 rows showing before sorting tests");
	sortingTestsForColumn(table, 1, asc, dsc);

	toggleShowAllLess();
	equal($(table+" tbody tr:visible").length, 4, "Check 4 rows showing after showing less");
	sortingTestsForColumn(table, 1, asc, dsc);

	clickPagingElement(5);
	equal(getCurrentPage(), "2", "Validate currently on page 2");
	sortingTestsForColumn(table, 1, asc, dsc);

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
	equal(getCurrentPage(), "1", "Should go to page 1 after sorting");

	sortByColumn(table, colNum);
	assertSortOrder(table, colNum, dsc);	
	equal(getCurrentPage(), "1", "Should go to page 1 after sorting");
}

function sortingTestsForList() {
	function nthOption(n) {return $("#sortBySelect option:nth-child("+n+")") }

	equal($("#sortBySelect option").length, 9, "Should be 9 entries in sorting dropdown - 8 options and sortby");
	equal(nthOption(1).text(), "Sort by...", "First elemnt in sorting drop down");
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

function selectCheckbox(element,ulNum,liNum) {
	var checkbox = $("ul[id*='Checkboxes']").eq(ulNum-1).find("li:nth-child("+liNum+") input");
	checkbox.prop("checked", true).click().prop("checked", true);	
	return checkbox.attr('value');
}

function clearAllCheckboxes() {
	$("ul[id*='Checkboxes'] li input").prop("checked", false);

	// click first on to trigger filter
	$("ul[id*='Checkboxes']").eq(0).find("li:nth-child(1) input").click().prop("checked", false);	
}

function getTextForRow(n) {
	return "row"+n+"-col1row"+(11-n)+"-col2row"+n+"-col3row"+n+"-col4£"+(n%4)+"£"+(n*10)+"row"+(n%5)+"-col7";
}
