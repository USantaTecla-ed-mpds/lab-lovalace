package es.pbover.master.model.menu.option;

import es.pbover.master.model.ServicesContract;
import es.pbover.master.utils.date.Date;
import es.pbover.master.utils.io.Console;

public class ShiftServicesContractOption extends ServicesContractOption {

    public ShiftServicesContractOption(ServicesContract servicesContract) {
        super("Desplazar Contrato de Servicios", servicesContract);
    }

    @Override
    public void interact() {
        Date date = new Date(Console.getInstance().readString("Introduzca la fecha en formato dd/mm/yyyy:"));
        Double shiftment = Console.getInstance().readDouble("Introduzca el desplazamiento:");
        Console.getInstance().writeln();
        servicesContract.desplazar(date, shiftment);
    }

}
