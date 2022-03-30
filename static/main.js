console.log("Running the Application")

async function getFirebase() {
    let res = await fetch("/fb");
    let result = await res.json()

    let element = document.getElementById("main-ele");
    // console.log(result)
    let parent = "";
    for (let i = 0; i < result.length; i++) {
        let template = `<table class="table table-hover table-bordered table-striped"><thead class="thead-dark"><th>Property</th><th>Data</th></thead>`;
        let uid = null;
        let formId = null;
        let message = "";
        if ("media_location_latitude" in result[i]) {
            result[i]["map"] = parseLocation(result[i]["media_location_latitude"], result[i]["media_location_longitude"])
            console.log(result[i]["map"])
        }
        Object.keys(result[i]).forEach(function (key) {
            let value = result[i][key];
            if (key === "uid") {
                uid = value
            }
            else if (key === "token") {
                let token = value;
            }
            else if (key === "formId") {
                formId = value
            }
            else {
                let ins = `<tr><td>${key}</td><td>${parseValue(value)}</td></tr>`;


                template += ins;
            }
        });
        template += "</table>"
        if (!message) {
            template += `<div class="box"><input class="btn btn-default" type="button" value="Accept" onclick="accept_claim('${uid}','${formId}')">
                          <input class="btn btn-danger" type="button" value="Reject" onclick="reject_claim('${uid}','${formId}')"></div>`
        }
        template += "<hr/>"
        parent += template
        // console.log(template)
    }
    element.innerHTML = parent;
}

async function accept_claim(uid, formId) {
    console.log("Accept btn", uid)
    console.log("Accept form id", formId)
    let res = await fetch("/fb", {
        method: "POST",
        body: JSON.stringify({ uid: uid, formId: formId, message: "Accepted" }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    console.log(res)
}

async function reject_claim(uid, formId) {
    console.log("Rejected btn ", uid)
    let res = await fetch("/fb", {
        method: "POST",
        body: JSON.stringify({ uid: uid, formId: formId, message: "Rejected" }),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    console.log(res)
}

function parseLocation(lat, long) {
    function displayMap() {
        // TO MAKE THE MAP APPEAR YOU MUST
        // ADD YOUR ACCESS TOKEN FROM
        // https://account.mapbox.com
        mapboxgl.accessToken = 'pk.eyJ1IjoicnVtZXNoIiwiYSI6ImNqcnQydGJxaDJna2k0NW4zZWwxeGZoaDcifQ.4eE55gr1IFRmMYYcxHV-yg';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [long, lat], // starting position [lng, lat]
            zoom: 12 // starting zoom
        });
        // Create a default Marker and add it to the map.
        const marker1 = new mapboxgl.Marker()
            .setLngLat([long, lat])
            .addTo(map);
        console.log(lat, long)
    }
    setTimeout(displayMap, 3000, lat, long)
    return `<div id="map" style="width: 500px;height: 500px"></div>`
}

function parseValue(value) {
    if (value === null) {
        return ""
    }
    value = value.toString();

    if (value.includes("map")) {
        return value
    }
    value = value.toString();
    if (value.includes("http")) {
        if (value.includes("video")) {
            return `<video width="320" height="240" controls>
                <source src="${value}" type="video/mp4">
                        Your browser does not support the video tag.
            </video>`
        } else {
            return `<img src="${value}">`
        }
    } else {
        return value
    }
}

async function getDropdown() {
    let res = await fetch("/fb");
    let result = await res.json()
    // var values = []
    var select = document.createElement("select");
    select.name = "UserNames";
    select.id = "dropdownList"
    for (let i = 0; i < result.length; i++) {
        // console.log(result[i].fullName+' : '+result[i].nic);
        const dropdownItem = result[i].fullName + ' : ' + result[i].nic;
        // values.push(result[i].fullName+' : '+result[i].nic);
        var option = document.createElement("option");
        option.value = result[i].uid;
        // option.text = dropdownItem.charAt(0).toUpperCase() + dropdownItem.slice(1);
        option.text = dropdownItem;
        select.appendChild(option);
    }
    // var select = document.createElement("select");
    // select.name = "pets";
    // select.id = "pets"

    // for (const val of values) {
    //     var option = document.createElement("option");
    //     option.value = val;
    //     option.text = val.charAt(0).toUpperCase() + val.slice(1);
    //     select.appendChild(option);
    // }

    var label = document.createElement("label");
    label.innerHTML = "Select username/nic: "
    label.htmlFor = "username";

    document.getElementById("container").appendChild(label).appendChild(select);

    document.getElementById('generate').onclick = function () {
        // console.log("Button Click");
        var dropdownValue = document.getElementById("dropdownList").value;
        // var dropdownUid = document.getElementById("dropdownList").text;
        // var getvalue = dropdownValue.options[dropdownValue.selectedIndex].value;
        // var gettext = value.options[value.selectedIndex].text;

        // console.log(dropdownValue);

        // console.log(dropdownUid);
        // console.log(gettext);

        let element = document.getElementById("main-ele");
        // console.log(result)
        let parent = "";
        for (let i = 0; i < result.length; i++) {
            if (result[i]["uid"] === dropdownValue) {
                let template = `<table class="table table-hover table-bordered table-striped"><thead class="thead-dark"><th>Property</th><th>Data</th></thead>`;
                let uid = null;
                let formId = null;
                let message = "";
                if ("media_location_latitude" in result[i]) {
                    result[i]["map"] = parseLocation(result[i]["media_location_latitude"], result[i]["media_location_longitude"])
                    console.log(result[i]["map"])
                }
                Object.keys(result[i]).forEach(function (key) {

                    let value = result[i][key];


                    if (key === "uid") {
                        uid = value
                    }
                    else if (key === "token") {
                        let token = value;
                    }
                    else if (key === "formId") {
                        formId = value
                    }
                    else {
                        let ins = `<tr><td>${key}</td><td>${parseValue(value)}</td></tr>`;


                        template += ins;
                    }

                });
                template += "</table>"
                if (!message) {
                    template += `<div class="box"><input class="btn btn-default" type="button" value="Accept" onclick="accept_claim('${uid}','${formId}')">
                          <input class="btn btn-danger" type="button" value="Reject" onclick="reject_claim('${uid}','${formId}')"></div>`
                }
                template += "<hr/>"
                parent += template
                // console.log(template)
            }
        }
        element.innerHTML = parent;




    }
}

// getFirebase()
getDropdown()