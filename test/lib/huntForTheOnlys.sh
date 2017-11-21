echo "**********"
echo ""
echo "Commencing the hunt for the mocha only statements..."
echo ""
echo "**********"

results="$(grep --color=always -r --exclude=\*.sh '\.only' $1)"
exit_code=$?

if [[ $exit_code -eq 0 ]]; then
    echo ""
    echo $results
    echo ""
    echo "We found .only()!! Remove before you push this 💩\n"
    echo ""
    exit 1
fi

echo ""
echo "No only statements found. Suite is clean!"
echo ""
exit 0