//https://stackoverflow.com/questions/18681803/loading-google-api-javascript-client-library-into-chrome-extension
//https://bumbu.me/gapi-in-chrome-extension
chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log('got the token', token);
})



const API_KEY = 'AIzaSyAdLftMrzdgpN-G9KRrw_AA3I9i1K3IRu0';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SPREADSHEET_ID = "1Oh8naEHOWDl9gmRZiR1Pl621n-s4Ri04iWguEYS7dUo";
const SPREADSHEET_TAB_NAME = "Sheet2";

function onGAPILoad() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
}

// Listen for messages from inject.js
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        // Get the token
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            // Set GAPI auth token
            gapi.auth.setToken({
                'access_token': token,
            });

            const body = {
                values: [[
                    new Date(), // Timestamp
                    request.title, // Page title
                    request.url, // Page URl
                ]]
            };

            // Append values to the spreadsheet
            gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: SPREADSHEET_TAB_NAME,
                valueInputOption: 'USER_ENTERED',
                resource: body
            }).then((response) => {
                // On success
                console.log(`${response.result.updates.updatedCells} cells appended.`)
                sendResponse({ success: true });
            });
        })

        // Wait for response
        return true;
    }
);


// function onGAPILoad() {
//     gapi.client.init({
//         // Don't pass client nor scope as these will init auth2, which we don't want
//         apiKey: API_KEY,
//         discoveryDocs: DISCOVERY_DOCS,
//     }).then(function () {
//         console.log('gapi initialized')
//         chrome.identity.getAuthToken({ interactive: true }, function (token) {
//             gapi.auth.setToken({
//                 'access_token': token,
//             });

//             gapi.client.sheets.spreadsheets.values.get({
//                 spreadsheetId: "1Oh8naEHOWDl9gmRZiR1Pl621n-s4Ri04iWguEYS7dUo",
//                 range: "Sheet2",
//             }).then(function (response) {
//                 console.log(`Got ${response.result.values.length} rows back`)
//             });
//         })
//     }, function (error) {
//         console.log('error', error)
//     });
// }
