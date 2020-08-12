package assignment;

import ca.uhn.fhir.model.primitive.IdDt;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Observation.ObservationStatus;
import org.hl7.fhir.dstu3.model.Quantity;
import org.hl7.fhir.dstu3.model.Reference;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.context.FhirContext;

/**
 * This class contains methods for adding resoruces to the FHIR server.
 */
public class AdvancedAdd {

    private IGenericClient client = null;

    public AdvancedAdd(String baseUrl) {
        FhirContext ctx = FhirContext.forDstu3();
        client = ctx.newRestfulGenericClient(baseUrl);
    }

    /**
     * Add a new patient to the FHIR server with the given first and last name.
     * Return the ID of the newly created patient.
     */
    public String addPatient(String firstName, String lastName) {
        //Place your code here
        return "";
    }

    /**
     * Add a new observation to the FHIR server with a reference to the specified patient ID.
     * Assume the patient already exists in the FHIR server.
     * The observation will have a loinc code and display name, a unit of measure value code,
     * units, and value for the observation.
     * Return the ID of the newly created observation.
     */
    public String addObservation(String patientId, String loincCode, String loincDisplayName,
                                double value, String valueUnit, String valueCode) {
        //Place your code here
        return "";
    }

}
