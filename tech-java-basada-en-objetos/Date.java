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

    public void addDays(int days){}

    public void addMonths(int month){}

    public void addYears(int year){}

    public String dayOfTheeek(){}

    public boolean isLeapYear(){}

    public int difference(Date date){} //Return number of second between dates

    public Date clone(){}

    public boolean equals(Date date){}

    public int compareDates(Date date){}
}

