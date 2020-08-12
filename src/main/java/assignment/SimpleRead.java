package assignment;

import java.util.List;
import java.util.ArrayList;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.Bundle.BundleEntryComponent;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;

/**
 * This class contains methods for reading resources from the FHIR server.
 */
public class SimpleRead {

    IGenericClient client = null;

    public SimpleRead(String baseUrl) {
        FhirContext ctx = FhirContext.forDstu3();
        client = ctx.newRestfulGenericClient(baseUrl);
    }

    /**
     * Find the patient with the given ID and return the full name as a
     * single string.
     */
    public String getNameByPatientID(String id) {
        // Hint, there is a method that will return the full name including
        // prefix, first, last, and suffix
        //Place your code here
        return "";//just so it will compile, return nothing
    }

    /**
     * Find all the patients that have the provided name and return a list
     * of the IDs for those patients.  The search should include matches
     * where any part of the patient name (family, given, prefix, etc.)
     * matches the method 'name' parameter.
     */
    public List<String> getIDByPatientName(String name) {
        //Place your code here
        return new ArrayList<String>();//just so it will compile, return nothing
    }

}