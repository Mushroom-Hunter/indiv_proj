//This file is my own code to run and debug other classes

import edu.gatech.hapifhir.SimpleRead;
import edu.gatech.hapifhir.AdvancedRead;
import edu.gatech.hapifhir.AdvancedAdd;

public class test_run {
    //    This is my tmp test of SimpleRead
    public static void main(String[] args) {
//        String serverBase = "http://hapi.fhir.org/baseR4";
        // Use local Docker server for testing, online R4 server is down for a while
        String serverBase = "http://localhost:4004/hapi-fhir-jpaserver/fhir";

        // Test AdvancedRead
        AdvancedRead adv_reader = new AdvancedRead(serverBase);
        adv_reader.getObservationDateValue("4548-4", "a1c.txt");
        adv_reader.getObservationDateValue("2339-0", "glucose.txt");
        adv_reader.getObservationDateValue("39156-5", "bmi.txt");
//        adv_reader.findPatientById("181");

    }
}

