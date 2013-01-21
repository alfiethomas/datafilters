#!/bin/bash

if [ $# -ne 2 ]; then 
	echo ""
	echo "USAGE: ./commit.sh 'local|quick|all' <commit message>"
	echo ""
	exit
fi

/Users/alistairthomas/Documents/sites/DataFilters/build/xbrowsertests.sh $1

if [ $? == 0 ]; then
	java -jar build/yuicompressor-2.4.7.jar scripts/jquery.datafilters.js -o scripts/jquery.datafilters.min.js
	echo "Created min version"

	git add -A
	git commit -m "$1"
	git push -u origin master
fi

