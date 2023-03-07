package es.pbover.master.model.menu.option;

import es.pbover.master.model.ServicesContract;
import es.pbover.master.utils.date.Date;
import es.pbover.master.utils.io.Console;

public class EnlargeServicesContractOption extends ServicesContractOption {

    public EnlargeServicesContractOption(ServicesContract servicesContract) {
        super("Alargar Contrato de Servicios", servicesContract);
    }

    @Override
    public void interact() {
        Date date = new Date(Console.getInstance().readString("Introduzca la fecha en formato dd/mm/yyyy:"));
        Double factor = Console.getInstance().readDouble("Introduzca el factor:");
        Console.getInstance().writeln();
        servicesContract.enlarge(date, factor);
    }

}
