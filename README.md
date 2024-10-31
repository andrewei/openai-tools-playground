# OpenAI playground for testing tools/functions.

## Available tools/functions

### Tesla
Can read information from the car, commands are not supported.

### Home Assistant
Can turn on/off lights, dim, set color.

### get week number
Returns the week number of the year.

### get date
Returns the date.

### Generate and run JS code
Generates and runs JS code.

### Generate and run Python code
Generates and runs Python code.

### Search wikipedia
Searches wikipedia for a given search term.

### KillSelf (circle of life)
Has the ability to kill itself.
Will be used for reloading source code on changes.

### notes

Can store and retrieve notes from file.

## Installation

npm install

## Requirements

- tesla token in a file .token in /src
- .env file in root with the variables defined in .env.example.
- If you don't have all the accounts required for using the tools, just remove them from the index file

## Usage

npm run start

# Memory

The memory is stored in a file called chatHistory.json, and will be loaded on startup,
and stored for each question. This, in combination with the killSelf function, will
allow the bot to relead the source code while persisting the memory.


# Example questions:

Set the light theme to fit the movie "xxxxxxx",

Set the light theme to fit the Tesla battery percentage
---The light theme has been set to represent the Tesla battery percentage, with the color blue and the brightness level at 63%.
