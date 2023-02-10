import java.lang.Math;

public class Coordinate {
    
    private int x;
    private int y;

    //Constructors
    public Coordinate(){
        this(0, 0);
    } 
    
    public Coordinate(int x, int y){
        this.x = x;
        this.y = y;
    } 

    //Methods
    public void setX(int coordinateX) {
        this.x = coordinateX;
    }

    public void setY(int coordinateY) {
        this.y = coordinateY;
    }

    public int getX(){
        return this.x;
    }

    public int getY(){
        return this.y;
    }

    public double getDistance(Coordinate coordinate){
       return Math.sqrt(Math.pow((coordinate.y - this.y), 2) + Math.pow((coordinate.x - this.x), 2));
    }

    public Coordinate moved(Coordinate coordinate){
        return new Coordinate(x + coordinate.x, y + coordinate.y);
    }

    public boolean equals(Coordinate coordinate){
        return x == coordinate.x && y == coordinate.x;
    }

    public Coordinate clone(){
        return new Coordinate(this.x, this.y);
    }
}
