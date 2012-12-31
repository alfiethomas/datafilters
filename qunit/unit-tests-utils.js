test("extractCurrencyValue should trim and remove £", function() {
  equal($('qunit').DataFilter('extractCurrencyValue', "£100"), "100");
  equal($('qunit').DataFilter('extractCurrencyValue', " £100 "), "100");
  equal($('qunit').DataFilter('extractCurrencyValue', "  ddd  "), "  ddd  ");
});

test("extractCurrencyValue should return 0 for Free", function() {
  equal($('qunit').DataFilter('extractCurrencyValue', "Free"), "0");
  equal($('qunit').DataFilter('extractCurrencyValue', "FREE"), "0");
  equal($('qunit').DataFilter('extractCurrencyValue', "free"), "0");
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

test("equalsIgnoreCase should do what is says on the tin", function() {
 	equal($('qunit').DataFilter('equalsIgnoreCase', "hello", "hello"), true);
 	equal($('qunit').DataFilter('equalsIgnoreCase', "HELLO", "hello"), true);
 	equal($('qunit').DataFilter('equalsIgnoreCase', "hello", "world"), false);
 });

test("locationHashContainsParam should do what is says on the tin", function() {
	window.location.hash = "name=bob";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob"), true);

	window.location.hash = "name=BOB";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob"), true);	

	window.location.hash = "name=will";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob"), false);

	window.location.hash = "name=bob&name=will";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob"), true);	

	window.location.hash = "name=will&name=bob";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob"), true);	

	window.location.hash = "name=bob bobbo";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob bobbo"), true);	

	window.location.hash = "name=bob+bobbo";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob bobbo"), true);

	window.location.hash = "name=bob%20bobbo";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob bobbo"), true);

	window.location.hash = "name=bob-bobbo";
	equal($('qunit').DataFilter('locationHashContainsParam', "name", "bob bobbo"), false);				
});

test("escapeForRegex tests", function() {
	equal($('qunit').DataFilter('escapeForRegex', "hello 123 456"), "hello 123 456");	
	equal($('qunit').DataFilter('escapeForRegex', "hello.123.456"), "hello123456");	
});