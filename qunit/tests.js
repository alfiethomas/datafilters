// set div for filters
var filters = $(document.createElement("div")).attr({id: "filters"});

// set up test table
var table = $(document.createElement("table")).attr({id: "tariffTable", border: "1"});
var tr = $(document.createElement("tr"));
for (i=1; i<=10; i++) {
	tr.append($(document.createElement("th")).text("Test"+i));
}
table.append($(document.createElement('thead')).append(tr));

for (i=1; i<=100; i++) {
	var tr = $(document.createElement("tr"));
	for (j=1; j<=10; j++) {
		tr.append($(document.createElement("td")).text("row"+i+"-col"+j));
	}
	table.append(tr);
}

test("extractCurrencyValue should trim and remove £ and $", function() {
  equal(extractCurrencyValue("£100"), "100");
  equal(extractCurrencyValue(" £100 "), "100");
  equal(extractCurrencyValue("$100"), "100");
  equal(extractCurrencyValue(" $100 "), "100");
  equal(extractCurrencyValue("  ddd  "), "  ddd  ");
});

test("substringAfterLastIndex should do what it says on the tin", function() {
	equal(substringAfterLast("hello,world,how,are,you", ","), "you");
	equal(substringAfterLast("you", ","), "");
});

test("Add 100 items then page and filter by checkbox", function() {
	$('#qunit').append(filters).append(table);
	init(1, compare, "Test1", createCheckboxes);
	init(2, compare, "Test2", createMin);
	doReady(8);
	equal($('#qunit>table tr').length, 101); 
	equal($('#qunit>table tr:visible').length, 9);
	equal($('#qunit>table tbody tr:visible').length, 8);	

	$('#1_row1-col1').prop('checked', true);
	$('#1_row2-col1').prop('checked', true);
	doFilter();
	equal($('#qunit>table tbody tr:visible').length, 2);

	$('#1_row1-col1').prop('checked', false);
	$('#1_row2-col1').prop('checked', false);
	doFilter();
	equal($('#qunit>table tbody tr:visible').length, 8);

	setTimeout(remove, 1);
});

function remove() {
	$('#tariffTable').remove();
	$('#filters').remove();
}