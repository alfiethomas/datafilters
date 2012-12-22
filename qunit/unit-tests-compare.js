test("test basic compare function", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestWordList(), "compare"), ["are", "hello", "how", "today", "world", "you"]);
	deepEqual($('qunit').DataFilter('sortItems', getTestWordList(), "compare", "-1"), ["you", "world", "today", "how", "hello", "are"]);
});

function getTestWordList() {
	return ["hello", "world", "how", "are", "you", "today"];
}

test("test compareAmount", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestAmountList(), "compareAmount"), ["No Thanks", "10MB", "100MB", "1GB", "5GB", "10GB", "Unlimited"]);
	deepEqual($('qunit').DataFilter('sortItems', getTestAmountList(), "compareAmount", "-1"), ["Unlimited", "10GB", "5GB", "1GB", "100MB", "10MB", "No Thanks"]);	
});

function getTestAmountList() {
	return ["10GB", "100MB", "5GB", "Unlimited", "1GB", "10MB", "No Thanks"];
}

test("test compareCurrency", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestCurrencyList(), "compareCurrency"), ["", "Free", "£1", "£5", "£10", "£100"]);
	deepEqual($('qunit').DataFilter('sortItems', getTestCurrencyList(), "compareCurrency", "-1"), ["£100", "£10", "£5", "£1", "", "Free"]);	
});

function getTestCurrencyList() {
	return ["£1", "£10", "", "£5", "Free", "£100"];
}

test("test compareCurrency range", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestCurrencyRangeList(), "compareCurrency"), ["free on all tariffs", "£1 - £10", "£5 - £15", "Free - £20", "£10 - £25"]);
	deepEqual($('qunit').DataFilter('sortItems', getTestCurrencyRangeList(), "compareCurrency", "-1"), ["£10 - £25", "Free - £20", "£5 - £15", "£1 - £10", "free on all tariffs"]);	
});

function getTestCurrencyRangeList() {
	return ["£1 - £10", "£10 - £25", "free on all tariffs", "£5 - £15", "Free - £20"];
}

test("test comparePeriod", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestPeriodList(), "comparePeriod"), ["30 Days", "12 Months", "18 Months", "24 Months"]);
	deepEqual($('qunit').DataFilter('sortItems', getTestPeriodList(), "comparePeriod", "-1"), ["24 Months", "18 Months", "12 Months", "30 Days"]);	
});

function getTestPeriodList() {
	return ["12 Months", "30 Days", "24 Months", "18 Months"];
}

test("test compareStock", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestStockList(), "compareStock"), ["In Stock", "Delivered in 2 days", "Out of Stock"]);
	deepEqual($('qunit').DataFilter('sortItems', getTestStockList(), "compareStock", "-1"), ["Out of Stock", "Delivered in 2 days", "In Stock"]);	
});

function getTestStockList() {
	return ["Out of Stock", "In Stock", "Delivered in 2 days"];
}