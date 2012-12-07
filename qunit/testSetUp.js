function initDataFilterForList(sortBy) {
	$('#tariffList').DataFilter('init', { 
        "filters": [
            { "heading": "Test1", "id": "testClass1",  "dataType": "default",  "filterType": "checkboxes"     },
            { "heading": "Test9", "id": "testClass9",  "dataType": "default",  "filterType": "checkboxes", "items": ["~row1", "row2"] },            
            { "heading": "Test2", "id": "testClass2",  "dataType": "default",  "filterType": "min"            },
            { "heading": "Test3", "id": "testClass3",  "dataType": "period",   "filterType": "max"            },
            { "heading": "Test4", "id": "testClass4",  "dataType": "default",  "filterType": "minMax"         },
            { "heading": "Test5", "id": "testClass5",  "dataType": "currency", "filterType": "min"            },
            { "heading": "Test6", "id": "testClass6",  "dataType": "currency", "filterType": "minWithBanding" },
            { "heading": "Test7", "id": "testClass7",  "dataType": "default",  "filterType": "select"         },
            { "heading": "Test8", "id": "testClass8",  "dataType": "default",  "filterType": "multiSelect"    },
            { "heading": "Test10","id": "testClass10", "dataType": "currency", "filterType": "rangeBanding"   }
        ],
        "pageSize": 4,
        "sortingDropDown": sortBy,
        "scrollToAnimationLength": 1

	});
}

function getSortingDropdownItems() {
	return [
        { "heading": "test1 - lowest",  "id": "testClass1", "direction":  "1" },
        { "heading": "test1 - highest", "id": "testClass1", "direction": "-1", "isDefault": true },
        { "heading": "test2 - lowest",  "id": "testClass2", "direction":  "1" },
        { "heading": "test2 - highest", "id": "testClass2", "direction": "-1" },
        { "heading": "test5 - lowest",  "id": "testClass5", "direction":  "1" },
        { "heading": "test5 - highest", "id": "testClass5", "direction": "-1" },
        { "heading": "test6 - lowest",  "id": "testClass6", "direction":  "1" },
        { "heading": "test6 - highest", "id": "testClass6", "direction": "-1" }
	]	
}

function initDataFilterForTable(successFn, afterFilterFn) {
	$('#tariffTable').DataFilter('init', { 
        "filters": [
            { "heading": "Test1",  "id": 1,  "dataType": "default",  "filterType": "checkboxes"     },
            { "heading": "Test9",  "id": 9,  "dataType": "default",  "filterType": "checkboxes", "items": ["~row1", "row2"] },
            { "heading": "Test2",  "id": 2,  "dataType": "default",  "filterType": "min"            },
            { "heading": "Test3",  "id": 3,  "dataType": "period",   "filterType": "max"            },
            { "heading": "Test4",  "id": 4,  "dataType": "default",  "filterType": "minMax"         },
            { "heading": "Test5",  "id": 5,  "dataType": "currency", "filterType": "min"            },
            { "heading": "Test6",  "id": 6,  "dataType": "currency", "filterType": "minWithBanding" },
            { "heading": "Test7",  "id": 7,  "dataType": "default",  "filterType": "select"         },
            { "heading": "Test8",  "id": 8,  "dataType": "default",  "filterType": "multiSelect"    },
            { "heading": "Test10", "id": 10, "dataType": "currency", "filterType": "rangeBanding"   }            
        ],
        "pageSize": 4,
        "onSuccess": successFn,
        "afterFilter": afterFilterFn,
        "scrollToAnimationLength": 1
	});	
}

function initDataFilterForTableWithCustomTextExtract() {
	$('#tariffTable').DataFilter('init', { 
        "filters": [
            { "heading": "Test1", "id": 1, "dataType": "default",  "filterType": "checkboxes" }
        ],
        "pageSize": 4,
        "settings.scrollToAnimationLength": 1,
        "extractTextFn": function(element) { 
        	var text = element.text();
        	return text.substring(0, text.indexOf('-'));
        }
	});	
}

function initDataFilterForTableWithNoPaging() {
	$('#tariffTable').DataFilter('init', { 
        "filters": [
            { "heading": "Test1", "id": 1, "dataType": "default",  "filterType": "checkboxes" }
        ],
        "scrollToAnimationLength": 1
   	});	
}

function initDataFilterForTableWithTextSearch() {
	$('#tariffTable').DataFilter('init', { 
        "filters": [
            { "heading": "Test1", "id": 1, "dataType": "default",  "filterType": "checkboxes" }
        ],
        "scrollToAnimationLength": 1,
        "enableFreeTextSearch": true
   	});	
}

function setUpTable() {
	var table = $(document.createElement("table")).attr({id: "tariffTable", cellspacing: 0, cellpadding: 0 });
	var tr = $(document.createElement("tr"));
	for (i=1; i<=10; i++) {
		tr.append($(document.createElement("th")).prop("class", "sorting").text("Test"+i));
	}
	table.append($(document.createElement('thead')).append(tr));

	for (i=1; i<=10; i++) {
		var tr = $(document.createElement("tr"));
		tr.append($(document.createElement("td")).text("row"+i+"-col1"));
		tr.append($(document.createElement("td")).text("row"+(11-i)+"-col2"));
		tr.append($(document.createElement("td")).text("row"+i+"-col3"));
		tr.append($(document.createElement("td")).text("row"+i+"-col4"));
		tr.append($(document.createElement("td")).text("£"+(i%4)));
		tr.append($(document.createElement("td")).text("£"+(i*10)));
		tr.append($(document.createElement("td")).text("row"+(i%5)+"-col7"));
		tr.append($(document.createElement("td")).text("row"+i+"-col8"));
		tr.append($(document.createElement("td")).text("row"+i+"-col9"));
		tr.append($(document.createElement("td")).text("£"+(i*10)));
		table.append(tr);
	}
	
	addFilterAndPagingDivs();
	$('#qunit').append(table);
}

function setUpList() {
	var list = $(document.createElement("ul")).attr({id: "tariffList"});
	for (i=1; i<=10; i++) {
		var li = $(document.createElement("li"));
		li.append($(document.createElement("p")).attr({"class": "testClass1"}).text("row"+i+"-col1"));
		li.append($(document.createElement("p")).attr({"class": "testClass2"}).text("row"+(11-i)+"-col2")); // reversed
		li.append($(document.createElement("p")).attr({"class": "testClass3"}).text("row"+i+"-col3")); 
		li.append($(document.createElement("p")).attr({"class": "testClass4"}).text("row"+i+"-col4")); 
		li.append($(document.createElement("p")).attr({"class": "testClass5"}).text("£"+(i%4))); 
		li.append($(document.createElement("p")).attr({"class": "testClass6"}).text("£"+(i*10))); 
		li.append($(document.createElement("p")).attr({"class": "testClass7"}).text("row"+(i%5)+"-col7"));
		li.append($(document.createElement("p")).attr({"class": "testClass8"}).text("row"+i+"-col8"));
		li.append($(document.createElement("p")).attr({"class": "testClass9"}).text("row"+i+"-col9"));
		li.append($(document.createElement("p")).attr({"class": "testClass10"}).text("£"+(i*10))); 
		list.append(li);
	}

	addFilterAndPagingDivs();
	$('#qunit').append(list);
}

function addFilterAndPagingDivs() {
	$('#qunit').append($(document.createElement("div")).attr({id: "filters"}));
	$('#qunit').append($(document.createElement("div")).attr({id: "paginationHolder", "class": "paginationHolder"}));
}

function remove() {
	$('#tariffList').empty().remove();
	$('#tariffTable').empty().remove();
	$('#filters').empty().remove();
	$('#paginationHolder').empty().remove();
}

function getParameter(name) {
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}