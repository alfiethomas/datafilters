test("extractCurrencyValue should trim and remove £", function() {
  equal($('qunit').DataFilter('extractCurrencyValue', "£100"), "100");
  equal($('qunit').DataFilter('extractCurrencyValue', " £100 "), "100");
  equal($('qunit').DataFilter('extractCurrencyValue', "  ddd  "), "  ddd  ");
});

test("extractCurrencyValue should return 0 for Free", function() {
  equal($('qunit').DataFilter('extractCurrencyValue', "Free"), "0");
});

test("substringAfterLastIndex should do what it says on the tin", function() {
	equal($('qunit').DataFilter('substringAfterLast', "hello,world,how,are,you", ","), "you");
	equal($('qunit').DataFilter('substringAfterLast', "you", ","), "");
});

test("contains should do what it says on the tin", function() {
	equal($('qunit').DataFilter('contains', "~hello", "~"), true);
	equal($('qunit').DataFilter('contains', "hello", "~"), false);
	equal($('qunit').DataFilter('contains', "h~ello", "~"), true);
});

test("startsWith should do what it says on the tin", function() {
	equal($('qunit').DataFilter('startsWith', "~hello", "~"), true);
	equal($('qunit').DataFilter('startsWith', "hello", "~"), false);
	equal($('qunit').DataFilter('startsWith', "h~ello", "~"), false);
	equal($('qunit').DataFilter('startsWith', "hello", "he"), true);
});

test("replaceAll should do what it says on the tin", function() {
	equal($('qunit').DataFilter('replaceAll', "~hello", "~", "!"), "!hello");
	equal($('qunit').DataFilter('replaceAll', "hello", "~", "!"), "hello");
	equal($('qunit').DataFilter('replaceAll', "h~el~~lo", "~", "!"), "h!el!!lo"); 
});

test("isAlphaNumeric should do what is says on the tin", function() {
 	equal($('qunit').DataFilter('isAlphaNumeric', "hello 123"), true);	
});

test("substringBeforeFirst should do what is says on the tin", function() {
 	equal($('qunit').DataFilter('substringBeforeFirst', "hello.123.456", "."), "hello");	
 	equal($('qunit').DataFilter('substringBeforeFirst', "hello", "."), "hello");
});