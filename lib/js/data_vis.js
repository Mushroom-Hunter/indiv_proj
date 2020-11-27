// This js code output diagnosis and plots onto data_vis page (prediction page)

// ------------------- Helper functions -------------------
// Analyze lipids status
function lipidStatus(diagnosis) {
    suggested_diagnosis.innerHTML= diagnosis;
}




// Display predicted diagnosis ("diagnosis")
function displayPredictedDiagnosis(diagnosis) {
    suggested_diagnosis.innerHTML= diagnosis;
}


// Helper functions
// Get diagnosis based on glucose and lipid data
// function plotBMI(bmiList, dateList){
//     var data = [
//         {
//             x: dateList,
//             y: bmiList,
//             mode: 'lines+markers',
//             type: 'scatter'
//         }
//     ];
//     var layout = {
//         title: 'BMI history',
//         showlegend: false,
//         xaxis: {
//             title: 'Date'
//         },
//         yaxix: {
//             title: 'BMI'
//         }
//     };
//
//     Plotly.newPlot('bmi_chart', data, layout);
// }

// ------------------- End of helper functions -------------------





displayPredictedDiagnosis("diagnosis")
//once fhir client is authorized then the following functions can be executed
FHIR.oauth2.ready().then(function(client) {
    // get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then(
        function(patient) {
            displayPatient(patient);
            console.log(patient);
        }
    );

    // get observation resource values
    // you will need to update the below to retrieve the weight and height values
    var query = new URLSearchParams();

    query.set("patient", client.patient.id);
    query.set("_count", 100);
    query.set("_sort", "-date");
    query.set("code", [
        'http://loinc.org|2085-9', // HDL [Mass/volume]
        'http://loinc.org|18262-6', // LDL [Mass/volume]
        'http://loinc.org|13458-5', // VLDL [Mass/volume]
        'http://loinc.org|29463-7', // Body weight
        'http://loinc.org|8302-2', // Height
        'http://loinc.org|2339-0', // Glucose
        'http://loinc.org|4548-4' // A1C
    ].join(","));

    // Display blood pressure, height, weight, HDL, LDL (lab3-2 requirements)
    client.request("Observation?" + query, {
        pageLimit: 0, // get all pages
        flat: true // return flat array of Observation resources
    }).then(
        function(ob) {

            // group all of the observation resoruces by type into their own
            var byCodes = client.byCodes(ob, 'code');
            var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
            var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
            var hdl = byCodes('2085-9');
            var ldl = byCodes('18262-6');

            // ==================== !! Here need some change ==================
            var weight = byCodes('29463-7');
            var height = byCodes('8302-2');

            // create patient object
            var p = defaultPatient();

            // set patient value parameters to the data pulled from the observation resoruce
            if (typeof systolicbp != 'undefined') {
                p.sys = systolicbp;
            } else {
                p.sys = 'undefined'
            }

            if (typeof diastolicbp != 'undefined') {
                p.dia = diastolicbp;
            } else {
                p.dia = 'undefined'
            }

            p.hdl = getQuantityValueAndUnit(hdl[0]);
            p.ldl = getQuantityValueAndUnit(ldl[0]);
            p.weight = getQuantityValueAndUnit(weight[0]);
            p.height = getQuantityValueAndUnit(height[0]);

            displayObservation(p)

        });

    // --------------------- My note: check here https://docs.smarthealthit.org/tutorials/javascript/
    // Also here: https://docs.smarthealthit.org, http://docs.smarthealthit.org/client-js/request.html
    // Display medicine request
    client.request("/MedicationRequest?patient=" + client.patient.id, {
        resolveReferences: "medicationReference"
    }).then(function(data) {
        if (!data.entry || !data.entry.length) {
            throw new Error("No medications found for the selected patient");
        }
        return data.entry;
    })
        .then(
            function(meds) {
                // Notice that meds is a list, need to iterate through
                // result.entry[i].resource.medicationCodeableConcept.text
                // document.getElementById("note").innerText = meds[1].resource.medicationCodeableConcept.text;
                for(let i = 0; i < meds.length; i++){
                    // medResults.push(meds[i].resource.medicationCodeableConcept.text);
                    // Above is not working somehow...
                    displayMedication(meds[i].resource.medicationCodeableConcept.text)
                }
            },
            function(error) {
                document.getElementById("meds").innerText = error.stack;
            },
        );

    // ---------------------------- Mini project 3 features -----------------------------
    var query_mp3 = new URLSearchParams(); // Construct a new query
    query_mp3.set("patient", client.patient.id);
    query_mp3.set("_count", 100);
    query_mp3.set("_sort", "-date");
    query_mp3.set("code", [
        'http://loinc.org|2085-9', // HDL
        'http://loinc.org|18262-6', // LDL
        'http://loinc.org|29463-7', // body weight
        'http://loinc.org|2339-0', // Glucose
        'http://loinc.org|8302-2' //height
    ].join(","));
    // Display history of body weight, Glucose, HDL, LDL (mini project 3 requirements)
    // Get observation values
    client.request("Observation?" + query_mp3, {
        pageLimit: 0, // get all pages
        flat: true // return flat array of Observation resources
    }).then(
        function(ob) {
            // group all of the observation resource by type into their own
            // http://docs.smarthealthit.org/client-js/typedoc/modules/_lib_.html#bycode
            // Bycode() will return a map by code
            var byCodes = client.byCodes(ob, 'code');
            // var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
            // var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
            var hdl = byCodes('2085-9');
            var ldl = byCodes('18262-6');
            var weight = byCodes('29463-7');
            var glucose = byCodes('2339-0');
            var height = byCodes('8302-2');
            var heightValUnit = getQuantityValueAndUnit(height[0]); // Need height for BMI calculation

            // Construct and update glucose list, and dates of measurements (for plotting)
            let i;
            // alert(glucose.length)
            for (i=0; i<glucose.length; i++){
                glucose_list.innerHTML += "<li> " + glucose[i].issued.slice(0,10) + '\t|\t' + getQuantityValueAndUnit(glucose[i]) + "</li>";
            }

            // Construct and update HDL, LDL, weight list, and dates of measurements (for plotting)
            for (i=0; i<hdl.length; i++){
                hdl_list.innerHTML += "<li> " + hdl[i].issued.slice(0,10) + '\t|\t' + getQuantityValueAndUnit(hdl[i]) + "</li>";
            }

            for (i=0; i<ldl.length; i++){
                ldl_list.innerHTML += "<li> " + ldl[i].issued.slice(0,10) + '\t|\t' + getQuantityValueAndUnit(ldl[i]) + "</li>";
            }

            // Get a list of weights to calculate BMI, maybe for plot also
            var weightValList = [];
            var weightDateList = [];

            for (i=0; i<weight.length; i++){
                let date = weight[i].issued.slice(0,10);
                let valueUnit = getQuantityValueAndUnit(weight[i]);
                // bodyWeight_list.innerHTML += "<li> " + date + '\t|\t' + valueUnit + "</li>";
                weightValList.push(valueUnit);
                weightDateList.push(date);
            }

            // Calculate BMI and plot BMI chart
            let bmiLst = calculateBMI(weightValList, heightValUnit);
            plotBMI(bmiLst, weightDateList);

        });

}).catch(console.error);