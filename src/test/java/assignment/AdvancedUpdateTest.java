package assignment;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import java.util.List;
import org.hl7.fhir.instance.model.api.IBaseOperationOutcome;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;

/**
 * Unit test for simple SimpleGetPatientById.
 */
public class AdvancedUpdateTest extends TestCase {

    private String serverBase ="http://hapi.fhir.org/baseDstu3";

    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AdvancedUpdateTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(AdvancedUpdateTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testUpdatePatientHomePhone() {

        AdvancedUpdate updater = new AdvancedUpdate(serverBase);
        String homePhone = "856-555-1212";
        String patientID = "";//find a good patient to work with
        updater.updatePatientHomePhone(patientID, homePhone);
        //add assertions or visually inspect server

    }

    public void testUpdateObservationValue() {

        AdvancedUpdate updater = new AdvancedUpdate(serverBase);
        String obsID = "";//find a good observation to update
        double value = 121.23;
        updater.updateObservationValue(obsID, value);
        //add assertions or visually inspect server

    }
}
