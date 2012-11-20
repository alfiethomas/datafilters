test("test basic compare function", function() {
	deepEqual($('qunit').DataFilter('sortItems', getTestList(), "compare"), ["are", "hello", "how", "today", "world", "you"]);
});

function getTestList() {
	return ["hello", "world", "how", "are", "you", "today"];
}