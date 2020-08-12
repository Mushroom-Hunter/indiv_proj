package assignment;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

/**
 * Unit test for simple SimpleGetPatientById.
 */
public class AdvancedReadTest extends TestCase {

    private String serverBase ="http://hapi.fhir.org/baseDstu3";

    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AdvancedReadTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(AdvancedReadTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void testGetTotalNumPatientsByObservation() {

        AdvancedRead getter = new AdvancedRead(serverBase);
        String loincCode = "6299-2";//pick what you like here
        int expected_count = 0;//fix this to right number
        int actual_count = getter.getTotalNumPatientsByObservation("6299-2");

        assertEquals(expected_count, actual_count);
    }

}
