// This js code output diagnosis and plots onto data_vis page (prediction page)


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

// End of helper functions




//

client.request("Observation?" + query, {
    pageLimit: 0, // get all pages
    flat: true // return flat array of Observation resources
}).then(
    displayPredictedDiagnosis("testing")
);