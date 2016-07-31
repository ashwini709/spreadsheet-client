# Web client for Google Expense sheet

### Working version

[Here.](https://amoghgarg1990.github.io/spreadsheet-client/) You will not be able to use it though. Look at the section harcoded parts below.


### What does this "web-app" do?

I have a an expense spread-sheet on google drive. Each month's expense is stored in separate sheet. 
For example, the sheet for July 2016 looks like this:

Date | Amount | Category | Comment | Payment Type
--- | --- | --- | --- | --- 
7 July | 123 | Lunch | McD | Cash

The columns for `Category` and `Payment Type`only take a values belonging to particular list.

Now this app was made to add entries to the above google spread sheet easily from a mobile device. The google spread sheet android client should be able to do it. But I found it be very cumbersome to use. 

## Hardcode parts of the app:

- Spreadsheet ID 
- Sheet Names: The app looks at the date entered, finds the month and the year. It will then append to the sheet `<month in 3 chars> '<year>`. For example if the date is `7 July 2016`, it will append to sheet `Jul '16`
- App KEY: This is the google API key.

## App was built on top of code from:

https://developers.google.com/sheets/quickstart/js
