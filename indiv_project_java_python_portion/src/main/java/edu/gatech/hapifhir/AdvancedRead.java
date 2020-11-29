package edu.gatech.hapifhir;

import java.io.FileWriter;   // Import the FileWriter class
import java.io.IOException;  // Import the IOException class to handle errors

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Resource;
import org.hl7.fhir.instance.model.api.IBaseBundle;
import org.hl7.fhir.instance.model.api.IBaseResource;
import ca.uhn.fhir.util.BundleUtil;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * This class contains methods for reading resoruces from the FHIR server.
 */
public class AdvancedRead {

    FhirContext ctx;
    IGenericClient client;

    public AdvancedRead(String baseUrl) {
        ctx = FhirContext.forR4();
        client = ctx.newRestfulGenericClient(baseUrl);
    }

    /**
     * Helper function
     * Implement the BundlePager class here, since it is not available on INGinious grader
     * Sample implementation of paging based on https://hapifhir.io/hapi-fhir/docs/client/examples.html#fetch-all-pages-of-a-bundle
     */
    static public <T extends IBaseResource> ArrayList<T> getCompleteBundleAsList(Bundle bundle, IGenericClient client, Class<T> resourceClass) {
        // Create List to hold our resources.
        ArrayList<T> list = new ArrayList<T>();

        // The bundle starts on page 1, so before moving forward add all of those Resources to the list.
        list.addAll(BundleUtil.toListOfResourcesOfType(client.getFhirContext(), bundle, resourceClass));

        // Loop through the Bundle based on the presence of a link element with a relation of next.
        while (bundle.getLink(IBaseBundle.LINK_NEXT) != null) {
            // Load the next page.
            bundle = client.loadPage().next(bundle).execute();
            // Add those resources to the list.
            list.addAll(BundleUtil.toListOfResourcesOfType(client.getFhirContext(), bundle, resourceClass));
        }
        return list;
    }

    /**
     * Find all observations with the given loinc code and
     * output values, date, patient ID, DOB, gender to a .txt file
     */
    //   Loinc code: a1c (4548-4), glucose (2339-0), bmi (39156-5), age (30525-0)
    public void getObservationDateValue(String loincCode, String outputFileName) {
        Bundle bundle = client.search()
                .forResource(Observation.class)
                .where(Observation.CODE.exactly().code(loincCode))
                .include(Observation.INCLUDE_SUBJECT)
                .returnBundle(Bundle.class)
                .execute();

        List<Observation> observationList = new ArrayList<Observation>();

        observationList.addAll(getCompleteBundleAsList(bundle, client, Observation.class));

            // Output pulled results to a .txt file
            try {
                FileWriter myWriter = new FileWriter(outputFileName);
                myWriter.write("obs_value\tyear_of_obs\tbirth_year\tgender\tpatient_ID"+"\n");
                for (Observation obs : observationList) {
                    String patientID = obs.getSubject().getReference().split("/")[1]; //Get patient ID
                    String BirthYear_Gender = findPatientById(patientID.trim()); // Remove potential whitespace to avoid error
                    myWriter.write(obs.getValueQuantity().getValue().toString()+"\t"); // Get value of that observation
                    myWriter.write(obs.getIssued().toString().split(" ")[5]+"\t"); // list date (year) of that observation
                    myWriter.write(BirthYear_Gender+"\t");
                    myWriter.write(patientID+"\n");

//                    System.out.println(obs.getSubject().getReference()); // list patient of that observation
//                    System.out.println(obs.getSubject().getReference());
                }
                myWriter.close();
                System.out.println("Successfully wrote to "+outputFileName);
            } catch (IOException e) {
                System.out.println("An error occurred.");
                e.printStackTrace();
            }
    }

    // Find a patient by given ID
    // Return year of birth and gender, separated by tab (\t)
    public String findPatientById(String patientId){
        Patient patient = client.read()
                .resource(Patient.class)
                .withId(patientId)
                .execute();
//        System.out.println(patient.getBirthDate().toString().split(" ")[5]);
//        System.out.println(patient.getGender().toString());
        String yearOfBirth = patient.getBirthDate().toString().split(" ")[5];
        String gender = patient.getGender().toString();
        return yearOfBirth+"\t"+gender;
    }
}