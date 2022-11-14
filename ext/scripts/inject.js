var script = document.createElement("script");
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const CLIENT_ID = '';  // change
const API_KEY = '';  // change
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const REGION = 'America/Mexico_City'; // change

let tokenClient;
let gapiInited = false;
let gisInited = false;

script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&key=${API_KEY}`;
document.body.appendChild(script);

function maybeEnableButton() {
    if (gapiInited && gisInited) {
        createAutorizeButton();
    }
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButton();
    } catch (error) {
        console.log(error);
    }
}

async function getListEvents(startDate, endDate) {
    console.log('getListEvents');
    let events = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return events;
}

// ############# IMPORTS #############

var script_awesome = document.createElement("script");
script_awesome.src = "https://kit.fontawesome.com/a200447ac4.js";
script_awesome.crossOrigin = "anonymous";
document.body.appendChild(script_awesome);

var script_calender = document.createElement("script");
script_calender.src = "https://apis.google.com/js/api.js";
script_calender.onload = function () {
    gapi.load('client', initializeGapiClient);
};
script_calender.async = true;
script_calender.defer = true;
document.body.appendChild(script_calender);

var script_client = document.createElement("script");
script_client.src = "https://accounts.google.com/gsi/client";
script_client.onload = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButton();
};
script_client.async = true;
script_client.defer = true;
document.body.appendChild(script_client);

// ############# END IMPORTS #############

function createAutorizeButton() {
    // check if there is a token in the session storage
    if (sessionStorage.getItem('token') !== null) {
        // if there is a token, use it to authorize the user
        tokenClient.setToken(sessionStorage.getItem('token'));
        tokenClient.authorize();
    } else {
        // if there is no token, create a button to authorize the user
        if (document.getElementById('authorize_button') == null) {
            let access_notity = document.createElement("div");
            access_notity.id = "authorize_button";
            access_notity.className = "i1K3qd onehQ";
            access_notity.innerHTML = '<div id="authorize_button" style="cursor: pointer" class="i1K3qd onehQ"><span class="ynRLnc">esCalendar: Calendar Access Required</span><div aria-hidden="true" class="bQnbhf"><div class="zR2Wpe"><div class="KaL5Wc"><div class="rSoRzd" style="font-size: 14px !important; color: #fd3d00">esCalendar: Calendar Access Required!</div></div></div></div></div>'
            access_notity.addEventListener('click', handleAuthClick);
            let element_component_year = document.getElementsByClassName('i1K3qd onehQ')[0];
            if (element_component_year) {
                element_component_year.insertAdjacentElement('afterend', access_notity);
            }
        }
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        // save the token in the session storage
        sessionStorage.setItem('token', resp.access_token);
        document.getElementById('authorize_button').innerHTML = '<span class="ynRLnc">esCalendar: Calendar Access Required</span><div aria-hidden="true" class="bQnbhf"><div class="zR2Wpe"><div class="KaL5Wc"><div class="rSoRzd" style="font-size: 14px !important; color: green">esCalendar: Access Granted!</div></div></div></div>';

        await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

function waitForElementToDisplay(selector, time) {
    event_content = document.getElementById(selector);
    if (event_content != null) {
        if (document.getElementById("event_alert") == null) {
            const general_content = document.getElementsByClassName("kMp0We OcVpRe IyS93d N1DhNb")[0];
            if (general_content != null) {
                var address_box = event_content.querySelector('.kMp0We.d6wfac.Wm6kRe.OcVpRe.URnjrb');
                if (address_box != null) {
                    var address = address_box.querySelector('.DN1TJ.fX8Pqc');
                    var address_string = address.innerHTML;
                    navigatorLocation = navigator.geolocation.getCurrentPosition(function (position) {
                        var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        var destination = address_string;
                        var service = new google.maps.DistanceMatrixService();
                        service.getDistanceMatrix(
                            {
                                origins: [origin],
                                destinations: [destination],
                                travelMode: 'DRIVING',
                                unitSystem: google.maps.UnitSystem.METRIC,
                                avoidHighways: false,
                                avoidTolls: false
                            }, callback);
                    });

                    // callback function to get the distance and duration
                    function callback(response, status) {
                        if (status == 'OK') {

                            var date_element = document.getElementById("xDetDlgWhen");
                            const date_string = date_element.querySelector(".DN1TJ.fX8Pqc.CyPPBf").innerText;

                            const year_element = document.getElementsByClassName("rSoRzd")[0].innerText;
                            const year = year_element.split(" ")[1];

                            formated_date = date_string.split(",")[1];
                            // split example to get the date and time
                            var date_time = formated_date.split("⋅");
                            const time = date_time[1]; // 12:00 – 1:00pm
                            const splitted_time = time.split("–");
                            var event_start_time = splitted_time[0].trim();
                            var event_end_time = splitted_time[1].trim();
                            if (event_start_time.includes("am")) {
                                event_start_time = event_start_time.replace("am", "");
                            } else {
                                if (event_end_time.includes("pm")) {
                                    const splitted_time = event_start_time.split(":");
                                    const parsedHour = parseInt(splitted_time[0]) + 12;
                                    event_start_time = parsedHour + ":" + splitted_time[1];
                                }
                            }
                            if (event_end_time.includes("pm")) {
                                event_end_time = event_end_time.replace("pm", "");
                                event_end_time = event_end_time.trim();
                                const splitted_time = event_end_time.split(":");
                                const parsedHour = parseInt(splitted_time[0]) + 12;
                                event_end_time = parsedHour + ":" + splitted_time[1];
                            }
                            else if (event_end_time.includes("am")) {
                                event_end_time = event_end_time.replace("am", "");
                                event_end_time = event_end_time.trim();
                            }

                            var start_time = new Date(year + " " + date_time[0] + " " + event_start_time);
                            console.log(year + " % " + date_time[0] + " % " + event_start_time);
                            var end_time = new Date(year + " " + date_time[0] + " " + event_end_time);
                            console.log(year + " % " + date_time[0] + " % " + event_end_time);

                            var duration = end_time - start_time;
                            duration = duration / 1000 / 60;
                            let event = {
                                "start_time": start_time,
                                "end_time": end_time,
                                "duration": duration,
                                "address": address_string,
                            }

                            console.log(response);
                            var distance_in_miles = response.rows[0].elements[0].distance.value * 0.000621371;
                            var duration_in_minutes = response.rows[0].elements[0].duration.value / 60;

                            const event_alert = document.createElement("div");
                            event_alert.id = "event_alert";
                            duration_display = distance_in_miles.toFixed(2) + " km";
                            time_display = duration_in_minutes.toFixed(0) + " min";
                            event_alert.className = "kMp0We OcVpRe";
                            let svg = '<svg focusable="false" width="24" height="24" viewBox="0 0 24 24" class=" NMm5M"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>';
                            const icon = '<i class="google-material-icons oXdlS EXKrbc GyffFb" aria-hidden="true">access_time</i>';
                            svg = icon
                            let text = `From your current location you will be on ${time_display} (Driving: ${duration_display})`;


                            const iconCalendar = '<img width="12" alt="Google Calendar icon (2020)" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/32px-Google_Calendar_icon_%282020%29.svg.png">'
                            let blockCalendarHTML = `<a class="IPEQnf AP8Kec" id="blockCalendar" value="${start_time}$${duration}$${event.address}$${duration_in_minutes}">${iconCalendar} Block Calendar</a>`;

                            let wazeHTML = null;
                            const geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ 'address': event.address }, function (results, status) {
                                if (status == 'OK') {
                                    const lat = results[0].geometry.location.lat();
                                    const lng = results[0].geometry.location.lng();
                                    const wazeLink = `https://waze.com/ul?ll=${lat}%2C${lng}&navigate=yes`;
                                    const icon = '<i class="fa-brands fa-waze"></i>';
                                    wazeHTML = `<a class="IPEQnf AP8Kec" id="wazeCalendar" value="${start_time}$${duration}$${event.address}$${duration_in_minutes}" href="${wazeLink}" target="_blank">${icon} Waze </a>`;
                                }
                            }).then(() => {
                                let wazeHTMLComponent = "";
                                if (wazeHTML != null) {
                                    wazeHTMLComponent = wazeHTML;
                                }
                                const evenet_alert_links = `<li>${text}</li><li>${blockCalendarHTML} ${wazeHTMLComponent} <li id="weather"></li></li>`
                                event_alert.innerHTML = `<div class="kMp0We OcVpRe"><div aria-hidden="true" class="nGJqzd OLw7vb kap9Ye"><span class="oXdlS xGfYse" aria-hidden="true">${svg}</span></div><div class="NI2kfb " id="xDetDlgNot"><ol class="oIOto" aria-label="Notificaciones">${evenet_alert_links}</ol></div></div>`;
                                address_box.insertAdjacentElement("afterend", event_alert);

                                function closeCalendarEvent() {
                                    try {
                                        console.log("closing the calendar event");
                                        const closeButton = document.getElementsByClassName("uArJ5e Y5FYJe cjq2Db QlVw3e plIjzf M9Bg4d")[0]
                                        console.log(closeButton);
                                        closeButton.click();
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }

                                document.getElementById("blockCalendar").addEventListener("click", function () {
                                    closeCalendarEvent();
                                    const value = this.getAttribute("value");
                                    const splitted_value = value.split("$");
                                    const start_time_det = splitted_value[0];
                                    const duration = splitted_value[1];
                                    const address = splitted_value[2];
                                    const routeTime = splitted_value[3];
                                    var start_time = new Date(start_time_det);
                                    var end_time = new Date(start_time_det);
                                    let mode = "relaxed"
                                    let configmode = {
                                        "strict": 0,
                                        "flexible": 10,
                                        "relaxed": 15,
                                    }
                                    let configtime = 10;
                                    try {
                                        configtime = configmode[mode];
                                    }
                                    catch (e) {
                                        console.log("error: " + e);
                                    }
                                    start_time.setMinutes(start_time.getMinutes() - (parseInt(routeTime) + configtime));

                                    var event = {
                                        'summary': 'Going to Event',
                                        'location': address,
                                        'description': 'Event',
                                        'start': {
                                            'dateTime': start_time,
                                            'timeZone': REGION,
                                        },
                                        'end': {
                                            'dateTime': end_time,
                                            'timeZone': REGION,
                                        },
                                        'reminders': {
                                            'useDefault': false,
                                            'overrides': [
                                                { 'method': 'email', 'minutes': 24 * 60 },

                                            ],
                                        },
                                    };

                                    try {
                                        getListEvents(start_time, end_time).then(function (list) {
                                            console.log(list);
                                            if (list.length > 0) {
                                                let event_in_calendar = false;
                                                for (let i = 0; i < list.length; i++) {
                                                    const element = list[i];
                                                    if (element.summary == "Event") {
                                                        event_in_calendar = true;
                                                        break;
                                                    }
                                                }
                                                if (event_in_calendar) {
                                                    console.log("event already in calendar");
                                                } else {
                                                    console.log("event not in calendar");
                                                    addEvent(event);
                                                }
                                            }
                                            else {
                                                console.log("there are no events");
                                                addEvent(event);
                                            }
                                        });


                                    } catch (error) {
                                        console.error(error);
                                    }

                                    console.log("tryng to get the calendar id");

                                    function addEvent() {
                                        var calendar_id = "primary";
                                        // get the id of the calendar of the user
                                        gapi.client.calendar.calendarList.list().then(function (response) {
                                            console.log(response);
                                            for (var i = 0; i < response.result.items.length; i++) {
                                                if (response.result.items[i].primary) {
                                                    calendar_id = response.result.items[i].id;
                                                    break;
                                                }
                                            }
                                            console.log("calendar id: " + calendar_id);
                                            var request = gapi.client.calendar.events.insert({
                                                'calendarId': calendar_id,
                                                'resource': event,
                                            });
                                            try {
                                                request.execute(function (event) {
                                                    console.log(event);
                                                    console.log('Event created: ' + event.htmlLink);
                                                });
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        });
                                    }
                                });

                                // call openweather api to get the weather

                                navigatorLocation = navigator.geolocation.getCurrentPosition(function (position) {
                                    const weather_api = "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
                                    //api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
                                    const weather_api_key = "89703565cfead1fe1ba7c90cfd7571f3";
                                    const weather_url = weather_api + "&appid=" + weather_api_key;
                                    fetch(weather_url).then(function (response) {
                                        return response.json();
                                    }).then(function (data) {
                                        const weather_temp = data.main.temp;
                                        document.getElementById("weather").innerHTML += '<i class="fa-solid fa-cloud"></i>' +  Math.round(weather_temp - 273.15) + "°C";
                                    });
                                });
                            });
                        } else {
                            console.log("Error: " + status);
                        }
                    }
                }
            } else {
                event_content.appendChild(event_alert);
            }
        }
    }

    setTimeout(function () {
        waitForElementToDisplay(selector, time);
    }, time);
}

console.log("Content script has been loaded");
fiveSenconds = 5000;
waitForElementToDisplay("xDtlDlgCt", fiveSenconds / 5);