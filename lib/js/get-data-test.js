//adapted from the cerner smart on fhir guide. updated to utalize client.js v2 library and FHIR R4

//create a fhir client based on the sandbox enviroment and test paitnet.
const client = new FHIR.client({
  serverUrl: "https://r4.smarthealthit.org",
  tokenResponse: {
    patient: "a6889c6d-6915-4fac-9d2f-fc6c42b3a82e"
  }
});

// helper function to process fhir resource to get the patient name.
function getPatientName(pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family;
    });
    return names.join(" / ")
  } else {
    return "anonymous";
  }
}

// display the patient name gender and dob in the index page
function displayPatient(pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
  document.getElementById('gender').innerHTML = pt.gender;
  document.getElementById('dob').innerHTML = pt.birthDate;
}


// ==================== !! Here need some change ==================
// helper function to process fhir resource to get the MedicationResults.
function getMedicationRequest(meds) {

  // typeof meds.MedicationRequest.medication;
  return meds.MedicationRequest.medication;
  // if (pt.name) {
  //   var names = pt.name.map(function(name) {
  //     return name.given.join(" ") + " " + name.family;
  //   });
  //   return names.join(" / ")
  // } else {
  //   return "anonymous";
  // }
}

//function to display list of medications
function displayMedication(meds) {
  med_list.innerHTML += "<li> " + meds + "</li>";
}

//helper function to get quanity and unit from an observation resoruce.
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

// helper function to get both systolic and diastolic bp
function getBloodPressureValue(BPObservations, typeOfPressure) {
  var formattedBPObservations = [];
  BPObservations.forEach(function(observation) {
    var BP = observation.component.find(function(component) {
      return component.code.coding.find(function(coding) {
        return coding.code == typeOfPressure;
      });
    });
    if (BP) {
      observation.valueQuantity = BP.valueQuantity;
      formattedBPObservations.push(observation);
    }
  });

  return getQuantityValueAndUnit(formattedBPObservations[0]);
}

// create a patient object to initalize the patient
function defaultPatient() {
  return {
    height: {
      value: ''
    },
    weight: {
      value: ''
    },
    sys: {
      value: ''
    },
    dia: {
      value: ''
    },
    ldl: {
      value: ''
    },
    hdl: {
      value: ''
    },
    note: 'No Annotation',
  };
}

//helper function to display the annotation on the index page
function displayAnnotation(annotation) {
  note.innerHTML = annotation;
}

//function to display the observation values you will need to update this
function displayObservation(obs) {
  hdl.innerHTML = obs.hdl;
  ldl.innerHTML = obs.ldl;
  sys.innerHTML = obs.sys;
  dia.innerHTML = obs.dia;

  // ==================== !! Here need some change ==================
  height.innerHTML = obs.height;
  weight.innerHTML = obs.weight;
  // med_list.innerHTML = "TBAJLKJKLJ\nhjlkajdklf"
}

// get patient object and then display its demographics info in the banner
client.request(`Patient/${client.patient.id}`).then(
  function(patient) {
    displayPatient(patient);
    console.log(patient);
  }
);

// get observation resoruce values
// you will need to update the below to retrive the weight and height values
// ==================== !! Here need some change ==================
var query = new URLSearchParams();

query.set("patient", client.patient.id);
query.set("_count", 100);
query.set("_sort", "-date");
query.set("code", [
  'http://loinc.org|8462-4',
  'http://loinc.org|8480-6',
  'http://loinc.org|2085-9',
  'http://loinc.org|2089-1',
  'http://loinc.org|55284-4',
  'http://loinc.org|3141-9',
  'http://loinc.org|29463-7',
  'http://loinc.org|8302-2'
].join(","));

client.request("Observation?" + query, {
  pageLimit: 0,
  flat: true
}).then(
  function(ob) {

    // group all of the observation resoruces by type into their own
    var byCodes = client.byCodes(ob, 'code');
    var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
    var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
    var hdl = byCodes('2085-9');
    var ldl = byCodes('2089-1');

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


      // ---------------------------- Mini project 3 features -----------------------------
      var query_mp3 = new URLSearchParams(); // Construct a new query
      query_mp3.set("patient", client.patient.id);
      query_mp3.set("_count", 100);
      query_mp3.set("_sort", "-date");
      query_mp3.set("code", [
          'http://loinc.org|2085-9', // HDL
          'http://loinc.org|18262-6', // LDL
          'http://loinc.org|29463-7', // body weight
          'http://loinc.org|74774-1' // Glucose
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

              // glucose_list.innerHTML = '<li> ' + 'hdl: ' + '</li>';
              glucose_list.innerHTML = '<li> ' + 'hdl: '+ hdl.length + '</li>';
              glucose_list.innerHTML = '<li> ' + 'ldl: '+ ldl.length + '</li>';
              glucose_list.innerHTML = '<li> ' + 'weight: '+weight.length + '</li>';
              glucose_list.innerHTML = '<li> ' + 'glucose: '+glucose.length + '</li>';
              // var i;
              //
              // for (i=0;i<glucose.length;i++){
              //     // glucose_list.innerHTML = '<li> ' + getQuantityValueAndUnit(glucose[i]) + '</li>'
              //     glucose_list.innerHTML = '<li> ' + 'test' + '</li>'
              //
              // }



              // create patient object
              // var patient_mp3 = defaultPatient();

              // set patient value parameters to the data pulled from the observation resoruce
              // if (typeof systolicbp != 'undefined') {
              //     patient_mp3.sys = systolicbp;
              // } else {
              //     patient_mp3.sys = 'undefined'
              // }
              //
              // if (typeof diastolicbp != 'undefined') {
              //     patient_mp3.dia = diastolicbp;
              // } else {
              //     patient_mp3.dia = 'undefined'
              // }

              // patient_mp3.hdl = getQuantityValueAndUnit(hdl[0]);
              // patient_mp3.ldl = getQuantityValueAndUnit(ldl[0]);
              // patient_mp3.weight = getQuantityValueAndUnit(weight[0]);
              // patient_mp3.height = getQuantityValueAndUnit(height[0]);

              // displayObservation(p)

          });
  });

// dummy data for medrequests
// var medResults = ["SAMPLE Lasix 40mg","SAMPLE Naproxen sodium 220 MG Oral Tablet","SAMPLE Amoxicillin 250 MG"]
// get medication request resources this will need to be updated
// the goal is to pull all the medication requests and display it in the app. It can be both active and stopped medications

// medResults.forEach(function(med) {
//     displayMedication(med);
// })

// ==================== !! Here need some change ==================s
// --------------------- My note: check here https://docs.smarthealthit.org/tutorials/javascript/
// Also here: https://docs.smarthealthit.org, http://docs.smarthealthit.org/client-js/request.html
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
        //result.entry[i].resource.medicationCodeableConcept.text
        // document.getElementById("note").innerText = JSON.stringify(meds, null, 4);
        // document.getElementById("note").innerText = meds[1].resource.medicationCodeableConcept.text;
        for(let i = 0; i < meds.length; i++){
            // medResults.push(meds[i].resource.medicationCodeableConcept.text);
            // Above is not working somehow...

            // displayMedication(meds[i].resource.medicationCodeableConcept.text)
            displayMedication(meds[i].resource.medicationCodeableConcept.text)

        }
    },
    function(error) {
        document.getElementById("meds").innerText = error.stack;
    },

);

//update function to take in text input from the app and add the note for the latest weight observation annotation
//you should include text and the author can be set to anything of your choice. keep in mind that this data will
// be posted to a public sandbox
function addWeightAnnotation() {
  var annotation = "test annotation"
  displayAnnotation(annotation);

}


// ---------------------------- Mini project 3 features -----------------------------
var query_mp3 = new URLSearchParams(); // Construct a new query
query_mp3.set("patient", client.patient.id);
query_mp3.set("_count", 100);
query_mp3.set("_sort", "-date");
query_mp3.set("code", [
    'http://loinc.org|2085-9', // HDL
    'http://loinc.org|18262-6', // LDL
    'http://loinc.org|29463-7', // body weight
    'http://loinc.org|2339-0' // Glucose
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

        // Construct and update glucose list, and dates of measurements (for plotting)
        var i;
        var glucList = [];
        var glucDates = [];
        for (i=0; i<glucose.length; i++){
            glucose_list.innerHTML += "<li> " + glucose[i].issued.slice(0,10) + '\t|\t' + getQuantityValueAndUnit(glucose[i]) + "</li>";
            glucList.push(getQuantityValueAndUnit(glucose[i]));
            glucDates = glucDates.push(glucose[i].issued.slice(0,10));

        }
        hdl_list.innerHTML = glucList;
        ldl_list.innerHTML = glucDates;

    });

//event listner when the add button is clicked to call the function that will add the note to the weight observation
document.getElementById('add').addEventListener('click', addWeightAnnotation);
