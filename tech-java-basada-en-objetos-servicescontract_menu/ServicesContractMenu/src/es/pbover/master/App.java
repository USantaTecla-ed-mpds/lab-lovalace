package es.pbover.master;

import es.pbover.master.utils.io.Console;
import es.pbover.master.model.menu.*;
import es.pbover.master.model.*;

public class App {
  public static void main(String[] args) {
    new ServicesContractMenu(new ServicesContract(new Console().readInt("Introduzca el anyo(yyyy) :"))).interact();
  }
}
