import java.io.Console;

public class program {
    
    public static void main(String[] args) {
        Date date1 = new Date();
        Date dateNow = Date.now();

        //white(date1);
        //white(dateNow);

        int num = 852;

        String numString = String.valueOf(num);

        white(numString);

       String[] nose = numString.split("");
        

        char[] aux = new char[4];

    }

    public static void white(Object obj){
        System.out.println(obj);
    }
}
