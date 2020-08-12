package assignment;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.api.MethodOutcome;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.ContactPoint;
import org.hl7.fhir.dstu3.model.ContactPoint.ContactPointUse;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Quantity;

/**
 * This class contains methods for updating resources in the FHIR server.
 */
public class AdvancedUpdate {

    private IGenericClient client = null;

    public AdvancedUpdate(String baseUrl) {
        FhirContext ctx = FhirContext.forDstu3();
        client = ctx.newRestfulGenericClient(baseUrl);
    }

    /**
     * Find the patient with the given ID and update the home phone number.  If the
     * patient does not already have a home phone number, add it.  Return the ID
     * of the updated resource.
     */
    public String updatePatientHomePhone(String patientId, String homePhoneNumber) {
        //Place your code here
        return "";//just so it will compile, return nothing
    }

    /**
     * Find the observation with the given ID and update the value.  Recall that
     * observations have a unit of measure value code, units, and a value - this
     * method only updates the value.  Return the ID of the updated resource.
     */
    public String updateObservationValue(String observationId, double value) {
        //Place your code here
        return "";//just so it will compile, return nothing
    }

}
