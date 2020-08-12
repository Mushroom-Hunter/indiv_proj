package assignment;

import java.util.HashSet;
import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Bundle.BundleEntryComponent;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Resource;
import ca.uhn.fhir.rest.client.api.IGenericClient;

/**
 * This class contains methods for reading resoruces from the FHIR server.
 */
public class AdvancedRead {

    private IGenericClient client = null;

    public AdvancedRead(String baseUrl) {
        FhirContext ctx = FhirContext.forDstu3();
        client = ctx.newRestfulGenericClient(baseUrl);
    }

    /**
     * Find all observations with the givin loinc code and return the total
     * number of patients referenced.  Note that patients may have multiple 
     * observations, so the number of observations >= number of patients.
     */
    public int getTotalNumPatientsByObservation(String loincCode) {
        //Place your code here
        return 0;
    }

}
