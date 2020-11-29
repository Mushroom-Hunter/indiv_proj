// This js code output diagnosis and plots onto data_vis page (prediction page)

// ------------------- Helper functions -------------------
//helper function to get quanity and unit from an observation resource.
// function getQuantityValueAndUnit(ob) {
//     if (typeof ob != 'undefined' &&
//         typeof ob.valueQuantity != 'undefined' &&
//         typeof ob.valueQuantity.value != 'undefined' &&
//         typeof ob.valueQuantity.unit != 'undefined') {
//         return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
//     } else {
//         return undefined;
//     }
// }

function getQuantityValue(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined') {
        return Number(parseFloat((ob.valueQuantity.value)).toFixed(2));
    } else {
        return undefined;
    }
}

// calculate age based on date of birth
function getAge(dob){
    let birthYear = parseInt(dob.slice(0,4));
    let d = new Date();
    let yearNow = d.getFullYear();
    return yearNow - birthYear;
}

// Get lipid status, return true (high lipid) or false (normal lipid)
// HDL<50, or LDL>100, or total>200
function getLipidStatus(hdl_val, ldl_val, total_cholesterol_val){
    if(hdl_val<50 || ldl_val>100 || total_cholesterol_val>200){
            return true;
    } else {
        return false;
    }
}

// Plot A1C data
function plotA1C(a1c_vals) {
    let a1cValList = [];
    let a1cDateList = [];
    let upper_threshold_list = []; // 6.5%
    let lower_threshold_list = []; // 5.7%

    for (let i=0; i<a1c_vals.length; i++){
        let date = a1c_vals[i].issued.slice(0,10);
        let valueUnit = getQuantityValue(a1c_vals[i]);
        a1cValList.push(valueUnit);
        a1cDateList.push(date);
        upper_threshold_list.push(6.5);
        lower_threshold_list.push(5.7);
    }
    // Plot a1c chart
    var a1c_trace = {
        x: a1cDateList,
        y: a1cValList,
        name: 'A1C',
        type: 'scatter'
    };
    var upper_trace = {
        x: a1cDateList,
        y: upper_threshold_list,
        type: 'scatter',
        name: 'upper threshold (6.5%)',
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 1
        }
    };
    var lower_trace = {
        x: a1cDateList,
        y: lower_threshold_list,
        type: 'scatter',
        name: 'lower threshold (5.7%)',
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 1
        }
    };

    var data = [a1c_trace, upper_trace, lower_trace];
    var layout = {
        title: 'A1C history',
        showlegend: false,
        autosize: false,
        width: 400,
        height: 300,
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: 'A1C (%)',
            range: [3,9], // Set y axis to a better scale
        },
    };
    Plotly.newPlot('a1c_chart', data, layout);
}

// Plot glucose data
function plotGlucose(vals) {
    let ValList = [];
    let DateList = [];
    let upper_threshold_list = []; // 6.5%
    let lower_threshold_list = []; // 5.7%

    for (let i=0; i<vals.length; i++){
        let date = vals[i].issued.slice(0,10);
        let valueUnit = getQuantityValue(vals[i]);
        ValList.push(valueUnit);
        DateList.push(date);
        upper_threshold_list.push(200);
        lower_threshold_list.push(140);
    }
    // Plot glucose chart
    var val_trace = {
        x: DateList,
        y: ValList,
        name: 'Glucose',
        type: 'scatter'
    };
    var upper_trace = {
        x: DateList,
        y: upper_threshold_list,
        type: 'scatter',
        name: 'upper threshold (200 mg/dL)',
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 1
        }
    };
    var lower_trace = {
        x: DateList,
        y: lower_threshold_list,
        type: 'scatter',
        name: 'lower threshold (140 mg/dL)',
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 1
        }
    };

    var data = [val_trace, upper_trace, lower_trace];
    var layout = {
        title: 'Glucose history',
        showlegend: false,
        autosize: false,
        width: 400,
        height: 300,
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: 'Glucose (mg/dL)'
        },
    };
    Plotly.newPlot('glucose_chart', data, layout);
}

// Analyze lipids status
function lipidStatus(diagnosis) {
    suggested_diagnosis.innerHTML= diagnosis;
}


// Display predicted diagnosis ("diagnosis")
// function displayPredictedDiagnosis(diagnosis) {
//     suggested_diagnosis.innerHTML= diagnosis;
// }

// ------------------- End of helper functions -------------------

var birthDate; // Patient birth date to calculate age
//once fhir client is authorized then the following functions can be executed
FHIR.oauth2.ready().then(function(client) {
    // !!!! Delete or update this
    // get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then(
        function(patient) {
            birthDate = patient.birthDate;
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
        'http://loinc.org|32309-7', // total cholesterol [Mass/volume]
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
            var total_cholesterol = byCodes('32309-7');
            // var weight = byCodes('29463-7');
            // var height = byCodes('8302-2');
            var glucose = byCodes('2339-0');
            var a1c = byCodes('4548-4');
            var bmi = byCodes('39156-5');

            // Get the most recent values of below measures
            var latest_hdl = getQuantityValue(hdl[0]);
            var latest_ldl = getQuantityValue(ldl[0]);
            var latest_total_cholesterol = getQuantityValue(total_cholesterol[0]);
            var latest_glucose = getQuantityValue(glucose[0]);
            var latest_a1c = getQuantityValue(a1c[0]);
            var latest_bmi = getQuantityValue(bmi[0]);
            var age = getAge(birthDate);
            var high_lipid = getLipidStatus(latest_hdl, latest_ldl, latest_total_cholesterol); // Get true or false

            // Get diagnosis or risk level for display
            if(latest_a1c>=6.5 || latest_glucose>=200){ // Diabetes
                suggested_diagnosis.innerHTML="Diabetes";
                if(latest_a1c>=6.5){
                    reasons.innerHTML="Rationale: A1c >= 6.5%"
                }else{
                    reasons.innerHTML="Rationale: Glucose  200mg/dL"
                }

            } else if(latest_a1c>=5.7 || latest_glucose>=140) { // Not diabetes
                suggested_diagnosis.innerHTML="Pre-diabetes"
                // if(latest_a1c>=5.7){
                //     reasons.innerHTML="Rationale: A1c between 5.7% - 6.4%"
                // } else{
                //     reasons.innerHTML="Rationale: Glucose between 140mg/dL - 200mg/dL"
                // }
            } else { // Diabetes, need to evaluate the risk
                if(age>=45 && latest_bmi>=30 && high_lipid){
                    suggested_diagnosis.innerHTML="High risk"
                    // reasons.innerHTML="Rationale: Age>45years, BMI>30, high lipid level"
                } else if ((age>=45 && latest_bmi>=30) || (age>=45 && high_lipid) || (latest_bmi>=30 && high_lipid)){
                    suggested_diagnosis.innerHTML="Medium risk"
                    // if(age>=45 && latest_bmi>=30){
                    //     reasons.innerHTML="Rationale: Age>45years, BMI>30"
                    // } else if(age>=45 && high_lipid){
                    //     reasons.innerHTML="Rationale: Age>45years, high lipid level"
                    // } else {
                    //     reasons.innerHTML="Rationale: BMI>30, high lipid level"
                    // }
                } else {
                    suggested_diagnosis.innerHTML="Low risk"
                }
            }

            // Get list of a1c, glucose and BMI to plot
            plotA1C(a1c);
            plotGlucose(glucose)

        });
}).catch(console.error);