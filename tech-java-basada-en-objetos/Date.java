import java.time.LocalDate;

public class Date {

    private int day;
    private int month;
    private int year;

    //Constructors
    //Default constructor that inicializate date to "1/1/0001"
    public Date(){
        this(1, 1, 1);
    }; 

    public Date(int day, int month, int year){
        this.day = day;
        this.month = month;
        this.year = year;
    };

    public Date(String date, String format){};


    //Methods
    public void setDay(int day){}

    public void setMonth(int month){}

    public void setYear(int year){}

    public int getDay(){
        return day;
    }

    public int getMonth(){
        return month;
    }

    public int getYear(){
        return year;
    }

    public Date addDays(int days){
        return null;
    }

    public Date addMonths(int month){
        return null;
    }

    public Date addYears(int year){
        return null;
    }

    public String dayOfTheweek(){
        return null;
    }

    public boolean isLeapYear(){
        return false;
    }

    //Return number of days between dates
    public int difference(Date date){
        return 0;
    } 

    public Date clone(){
        return new Date(this.day, this.month, this.year);
    }

    public boolean equals(Date date){
        return this.day == date.day && this.month == date.month && this.year == date.year;
    }

   //Compares two dates and returns a value indicating whether one is less than, equal to, or greater than the other (-1, 0, 1).
    public int compareDates(Date date){
        return 0;
    }

    public String toString(){
        return this.day + "/" + this.month + "/" + this.year;
    }

    //Static methods
    public static boolean isValidDate(Date date){
        return false;
    };

	public static Date now(){
        return new Date(LocalDate.now().getDayOfMonth(),LocalDate.now().getMonthValue(),LocalDate.now().getYear());
    };
}

