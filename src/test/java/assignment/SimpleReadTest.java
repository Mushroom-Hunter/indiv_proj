package assignment;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple Connection.
 */
public class SimpleReadTest extends TestCase {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public SimpleReadTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(SimpleReadTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testSimpleRead() {
        String serverBase ="http://hapi.fhir.org/baseDstu3";
        SimpleRead reader = new SimpleRead(serverBase);
        //do something with the reader to make sure it works...
        String patientID = "";//find a good patient
        String expected_name = "";
        String actual_name = reader.getNameByPatientID(patientID);
        assertEquals(expected_name, actual_name);
    }
}
