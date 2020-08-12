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
public class AdvancedDeleteTest extends TestCase {

    private String serverBase ="http://hapi.fhir.org/baseDstu3";

    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AdvancedDeleteTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(AdvancedDeleteTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testDeletePatient() {

        AdvancedDelete deleter = new AdvancedDelete(serverBase);

        String patientID = "";//set this to a valid id
        deleter.deletePatient(patientID);

    }

    public void testDeleteObservation() {

        AdvancedDelete deleter = new AdvancedDelete(serverBase);
        String obsID = "";//set this to a valid id
        deleter.deleteObservation(obsID);

    }
}
