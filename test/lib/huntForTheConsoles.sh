echo "**********"
echo ""
echo "Commencing the hunt for the console statements..."
echo ""
echo "**********"

results="$(grep --color=always -r --exclude=\*.sh '\console.log' $1)"
exit_code=$?

if [[ $exit_code -eq 0 ]]; then
    echo ""
    echo $results
    echo ""
    echo "We found console.log!!! Remove before you push this 💩\n"
    echo ""
    exit 1
fi

echo ""
echo "No console.log statements found. Suite is clean!"
echo ""
exit 0