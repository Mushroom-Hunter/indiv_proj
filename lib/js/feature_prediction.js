// This code predicts glucose and A1c based on population model

// ------------------- Helper functions -------------------
//helper function to get quanity and unit from an observation resource.
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

// Plot A1C data
function plotA1C(latest_a1c, predictedA1c_prev, predictedA1c_normal) {
    var a1c_data = [
        {
            x: ['Latest A1c', 'Predicted A1c', 'Predicted A1c (normal level)'],
            y: [latest_a1c, predictedA1c_prev, predictedA1c_normal],
            type: 'bar',
            marker:{
                color: ['rgb(192,192,192)', 'rgb(255,102,102)', 'rgb(0,204,102)']
            },
        }
    ];
    var layout = {
        title: 'A1c prediction',
        showlegend: false,
        autosize: false,
        width: 450,
        height: 300,
        yaxis: {
            title: 'A1c (%)'
        }
    };
    Plotly.newPlot('a1c_chart', a1c_data, layout);
}

// Plot glucose data
function plotGlucose(latest_gluc, predictedGluc_prev, predictedGLuc_normal) {
    var gluc_data = [
        {
            x: ['Latest glucose', 'Predicted glucose', 'Predicted glucose (normal level)'],
            y: [latest_gluc, predictedGluc_prev, predictedGLuc_normal],
            type: 'bar',
            marker:{
                color: ['rgb(192,192,192)', 'rgb(255,102,102)', 'rgb(0,204,102)']
            },
        }
    ];
    var layout = {
        title: 'Glucose prediction',
        showlegend: false,
        autosize: false,
        width: 450,
        height: 300,
        yaxis: {
            title: 'Glucose (mg/dL)'
        }
    };
    Plotly.newPlot('glucose_chart', gluc_data, layout);
}

// ------------------- End of helper functions -------------------


var gender;
var birthDate;
//once fhir client is authorized then the following functions can be executed
FHIR.oauth2.ready().then(function(client) {
      // Patient birthdate to calculate age
    client.request(`Patient/${client.patient.id}`).then(
        function(patient) {
            gender = patient.gender;
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
        'http://loinc.org|2339-0', // Glucose
        'http://loinc.org|4548-4', // A1C
        'http://loinc.org|39156-5' //BMI
    ].join(","));

    // Get a1c, glucose, bmi
    client.request("Observation?" + query, {
        pageLimit: 0, // get all pages
        flat: true // return flat array of Observation resources
    }).then(
        function(ob) {
            // group all of the observation resources by type into their own
            var byCodes = client.byCodes(ob, 'code');
            var glucose = byCodes('2339-0');
            var a1c = byCodes('4548-4');
            var bmi = byCodes('39156-5');

            // Get the most recent values of below measures
            var latest_glucose = getQuantityValue(glucose[0]);
            var latest_a1c = getQuantityValue(a1c[0]);
            var latest_bmi = getQuantityValue(bmi[0]);
            var age = getAge(birthDate);

            var gender_val; // Convert gender to binary value
            if(age==="male" || age==="MALE" || age==="Male"){
                gender_val=1;
            } else {
                gender_val = 2
            }

            // Based on GLM model build in python
            // Normal A1c model: a1c = 8.156 - 0.0459*age - 3.8602*gender + 0.0448*age*gender
            // Normal glucose model: glucose = 121.6804 + 0.2966*age - 12.8500*gender - 0.2558*age*gender
            // Based on previous A1c model: a1c = 0.0808 + 5.963e-05*age - 0.0171*gender + 0.9841*prev_a1c
            // Based on previous glucose model: glucose = 41.7166 + 0.0081*age - 8.6641*gender + 0.6988*prev_glucose
            var predictedA1c_normal = 8.156 - 0.0459*age - 3.8602*gender_val + 0.0448*age*gender_val;
            var predictedGlucose_normal = 121.6804 + 0.2966*age - 12.8500*gender_val - 0.2558*age*gender_val;
            var predictedA1c_prev = 0.0808 + 5.963e-05*age - 0.0171*gender_val + 0.9841*latest_a1c;
            var predictedGluc_prev = 41.7166 + 0.0081*age - 8.6641*gender_val + 0.6988*latest_glucose;

            // Get list of a1c, glucose and BMI to plot
            plotA1C(latest_a1c, predictedA1c_prev, predictedA1c_normal);
            plotGlucose(latest_glucose, predictedGluc_prev, predictedGlucose_normal);




        });
}).catch(console.error);