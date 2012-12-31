if [ $# -ne 1 ]
then 
echo "USAGE: ./commit.sh <commit message>"
exit
fi	

java -jar build/yuicompressor-2.4.7.jar scripts/jquery.datafilters.js -o scripts/jquery.datafilters.min.js
echo "Created min version"

git add -A
git commit -m "$1"
git push -u origin master
