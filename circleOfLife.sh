#!/bin/bash

echo "AI world created"
# Infinite loop to keep restarting the program based on exit code
while true
do
    echo "A new AI is born"
    npm run start

    # Capture the exit code of the npm process
    exit_code=$?

    if [ $exit_code -eq 66 ]; then
        echo "Killing self, going to heaven"
        echo "RIP"
        echo "The computer is pregnant, new instance in progress ..."
    else
        echo "Program exited with code $exit_code..."
        break
    fi
done