package assignment;

import org.hl7.fhir.instance.model.api.IBaseOperationOutcome;

import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.context.FhirContext;

/**
 * This class contains methods for removing resoruces from the FHIR server.
 */
public class AdvancedDelete {

    private IGenericClient client = null;

    public AdvancedDelete(String baseUrl) {
        FhirContext ctx = FhirContext.forDstu3();
        client = ctx.newRestfulGenericClient(baseUrl);
    }

    /**
     * Delete the patient with the given ID from the FHIR server.
     */
    public void deletePatient(String patientId) {
        //Place your code here
    }

    /**
     * Delete the observation with the given ID from the FHIR server.
     */
    public void deleteObservation(String observationId) {
        //Place your code here
    }

}
