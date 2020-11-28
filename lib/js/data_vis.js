// This js code output diagnosis and plots onto data_vis page (prediction page)

// ------------------- Helper functions -------------------

//helper function to get quanity and unit from an observation resource.
function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
        return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
    } else {
        return undefined;
    }
}

// Get A1C data
function getA1Cdata(diagnosis) {
    suggested_diagnosis.innerHTML= diagnosis;
}

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



//once fhir client is authorized then the following functions can be executed
FHIR.oauth2.ready().then(function(client) {

    // !!!! Delete or update this
    // get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then(
        function(patient) {
            displayPredictedDiagnosis("diagnosis")
            console.log(patient);
        }
    );

    // Get observation resource values
    // Construct a query to get all following info of the current patient
    // The query will look like:
    // https://r4.smarthealthit.org/Observation?_sort:asc=date&code=http://loinc.org|4548-4....
    var query = new URLSearchParams();
    query.set("patient", client.patient.id);
    query.set("_count", 100);
    query.set("_sort", "-date");
    query.set("code", [
        'http://loinc.org|2085-9', // HDL [Mass/volume]
        'http://loinc.org|18262-6', // LDL [Mass/volume]
        'http://loinc.org|13458-5', // VLDL [Mass/volume]
        // 'http://loinc.org|29463-7', // Body weight
        // 'http://loinc.org|8302-2', // Height
        'http://loinc.org|2339-0', // Glucose
        'http://loinc.org|4548-4', // A1C
        'http://loinc.org|39156-5' //BMI
    ].join(","));

    // Get height, weight, HDL, LDL, etc.
    client.request("Observation?" + query, {
        pageLimit: 0, // get all pages
        flat: true // return flat array of Observation resources
    }).then(
        function(ob) {
            // group all of the observation resources by type into their own
            var byCodes = client.byCodes(ob, 'code');
            var hdl = byCodes('2085-9');
            var ldl = byCodes('18262-6');
            var vldl = byCodes('13458-5');
            // var weight = byCodes('29463-7');
            // var height = byCodes('8302-2');
            var glucose = byCodes('2339-0');
            var a1c = byCodes('4548-4');
            var bmi = byCodes('39156-5');


            // Get the most recent values of below measures
            var latest_hdl = getQuantityValueAndUnit(hdl[0]);
            var latest_ldl = getQuantityValueAndUnit(ldl[0]);
            var latest_vldl = getQuantityValueAndUnit(vldl[0]);
            // var latest_weight = getQuantityValueAndUnit(weight[0]);
            // var latest_height = getQuantityValueAndUnit(height[0]);
            var latest_glucose = getQuantityValueAndUnit(glucose[0]);
            var latest_a1c = getQuantityValueAndUnit(a1c[0]);
            var latest_bmi = getQuantityValueAndUnit(bmi[0]);
            suggested_diagnosis.innerHTML= latest_bmi;

        });

  /*
    // --------------------- My note: check here https://docs.smarthealthit.org/tutorials/javascript/
    // Also here: https://docs.smarthealthit.org, http://docs.smarthealthit.org/client-js/request.html
    // Display a1c data
    var query_a1c = new URLSearchParams(); // Construct a new query
    query_a1c.set("patient", client.patient.id);
    query_a1c.set("_count", 100);
    query_a1c.set("_sort", "-date");
    query_a1c.set("code", [
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

        });*/

}).catch(console.error);