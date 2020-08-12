package assignment;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import java.util.List;
import java.util.ArrayList;
import org.hl7.fhir.instance.model.api.IBaseOperationOutcome;
import ca.uhn.fhir.model.primitive.IdDt;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;

/**
 * Unit test for simple SimpleGetPatientById.
 */
public class AdvancedAddTest extends TestCase {

    private String serverBase ="http://hapi.fhir.org/baseDstu3";

    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AdvancedAddTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(AdvancedAddTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testAddPatient() {
        AdvancedAdd adder = new AdvancedAdd(serverBase);

        String pid = adder.addPatient("Don", "Juan");

        //do some tests
        //your SimpleRead class might be helpful to read back the patient you just added and validate

        //e.g. assertEquals(expected_name, actual_name);
    }

    public void testAddObservation() {
        AdvancedAdd adder = new AdvancedAdd(serverBase);

        String pid = adder.addPatient("Don", "Juan");
        
        String loincCode = "2339-0";
        String loincDisplayName = "Glucose";
        double value = 118;
        String valueUnit = "mg/dL";
        String valueCode = "mg/dL";
        String oid = adder.addObservation(pid, loincCode, loincDisplayName, value, valueUnit, valueCode);

        //with the oid you should be able to read back that observation and do some assertions
        //or even look at the web server via a web browser and visually inspect
    }
}
