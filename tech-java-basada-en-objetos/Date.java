public class Date {

    private int Day;
    private int Month;
    private int Year;

    //Constructors
    public Date(){}; //Default constructor that inicializate date to "1/1/0001"

    public Date(int day, int month, int year){};

    public Date(String date, String format){};


    //Methods
    public void setDay(int day){}

    public void setMonth(int month){}

    public void setYear(int year){}

    public int getDay(){}

    public int getMonth(){}

    public int getYear(){}

    public Date addDays(int days){}

    public Date addMonths(int month){}

    public Date addYears(int year){}

    public String dayOfTheweek(){}

    public boolean isLeapYear(){}

    public int difference(Date date){} //Return number of second between dates

    public Date clone(){}

    public boolean equals(Date date){}

    public int compareDates(Date date){} //Compares two dates and returns a value indicating whether one is less than, equal to, or greater than the other (-1, 0, 1).
}

