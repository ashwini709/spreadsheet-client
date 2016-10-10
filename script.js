
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '204251467419-6vrsj8f29kl1e2v8f0p6bp3802lm31i4.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
var SPREAD_SHEET_ID = "1Ms2ZOgSgTfVBYy1Rafb9_le7gE696_sdJrrL2GDaYpU";
/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  console.log("Check Auth")

  gapi.auth.authorize(
    {
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadSheetsApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
  console.log("LOADING SHEETS")
  var discoveryUrl =
  'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(getSummaries);
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function getSheetName(date) {
  var monthNumber = date.substr(5, 2)
  var year = date.substr(2, 2)
  var monthName = months[parseInt(monthNumber)-1]
  var sheetName = monthName + " '" + year
  return sheetName
}

function handleAddExpense() {

  console.log("Handle Expense")
  toggleButtonAndLoading();

  var date = document.getElementById('date').value;
  var amount = document.getElementById('amount').value;

  if (amount !== "") {
    var category = document.getElementById('category').value;
    var comment = document.getElementById('comment').value;
    var paymentType = document.getElementById('paymentType').value;

    console.log(date, amount, category, comment, paymentType)

    var spreadsheetId = SPREAD_SHEET_ID;
    var sheetName = getSheetName(date)
    console.log(sheetName)
    var range = sheetName + "!A2:F2"

    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption:  "USER_ENTERED",
      insertDataOption:  "INSERT_ROWS",
      "majorDimension": "ROWS",
      "values": [
      [date, amount, category, comment, paymentType]
      ]
    }).then(function(response) {
      console.log(response);
      getLast5Entries(response)
    }, function(response) {
      console.log('Error: ' + response.result.error.message);
    });
  }
}

function toggleButtonAndLoading(){
  console.log("Toggling Classes")

  document.getElementById("spinner").classList.toggle("hidden-element");
  document.getElementById("addDiv").classList.toggle("hidden-element");
}

function getLast5Entries(response){
  var updatedRange = response.result.updates.updatedRange
  console.log(updatedRange)
  var startInd = updatedRange.indexOf("!");
  var endInd = updatedRange.indexOf(":");
  var rowNumberEnd = parseInt(updatedRange.substr(startInd+2, endInd));
  var rowNumberStart = Math.max(rowNumberEnd - 4, 1)

  var rangeRequired = updatedRange.substring(0, startInd+2) + rowNumberStart + updatedRange.substring(endInd)

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREAD_SHEET_ID,
    range: rangeRequired,
  }).then(function(response) {
    console.log(response.result)
    showLast5Entries(response.result.values);
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
  console.log(rangeRequired)
}

function showLast5Entries(values){

  toggleButtonAndLoading();

  document.getElementById("entries-body").innerHTML = "";

  for (i = values.length - 1; i > -1 ; i--) {
    var data = values[i];
    var table = document.getElementById("entries-body");
    var row = table.insertRow(-1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    cell0.innerHTML = data[0];
    cell1.innerHTML = data[1];
    cell2.innerHTML = data[2];
    cell3.innerHTML = data[3];
    cell4.innerHTML = data[4];
    row.className = "entry-row"
  }
}

function getSummaries() {
  toggleButtonAndLoading();

  var date = document.getElementById('date').value;
  var sheetName = getSheetName(date);
  var range = sheetName + "!G2:H14";

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREAD_SHEET_ID,
    range: range,
  }).then(function(response) {
    showSummaries(response.result.values);
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function showSummaries(values) {
  var summaryContainer = document.getElementById('summary-container');
  summaryContainer.innerHTML = "";

  var total = values.pop();
  appendSummary(summaryContainer, total, 0);

  var sorted = values.sort(function(a, b) { return ((a[1] - b[1]) > 0) ? 1 : -1; }).reverse();

  for (i = 0; i <= 3 ; i++) {
    var row = sorted[i];
    appendSummary(summaryContainer, row, i+1);
  }
}

function appendSummary(summaryContainer, data, index) {
  var summaryItem = document.createElement('div');
  summaryItem.id = "summary-item-" + index;
  summaryContainer.appendChild(summaryItem);

  document.getElementById("summary-item-" + index).innerHTML = "<label>" + data[0] + "</label><value>" + data[1] + "</value>";
}

window.onload = function(e) {
  console.log(new Date())
  console.log(document.getElementById('date'))
  document.getElementById('date').valueAsDate = new Date();
  document.getElementById('amount').focus();
}
