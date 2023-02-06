import java.lang.Math;

public class Coordinate {
    
    private int coordinateX;
    private int coordinateY;

    //Constructors
    public Coordinate(){
        coordinateX = 0;
        coordinateY = 0;
    } 
    
    public Coordinate(int coordinateX, int coordinateY){
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
    } 

    //Methods
    public void setCoordinateX(int coordinateX) {
        this.coordinateX = coordinateX;
    }

    public void setCoordinateY(int coordinateY) {
        this.coordinateY = coordinateY;
    }

    public int getCoordinateX(){
        return coordinateX;
    }

    public int getCoordinateY(){
        return coordinateY;
    }

    public double getDistance(Coordinate coordinate){
       return Math.sqrt(Math.pow((coordinate.coordinateY - this.coordinateY), 2) + Math.pow((coordinate.coordinateX - this.coordinateX), 2));
    }

    public Coordinate moved(Coordinate coordinate){
        return new Coordinate(coordinateX + coordinate.coordinateX, coordinateY + coordinate.coordinateY);
    }

    public boolean equals(Coordinate coordinate){
        return coordinateX == coordinate.coordinateX && coordinateY == coordinate.coordinateX;
    }

    public Coordinate clone(){
        return new Coordinate(this.coordinateX, this.coordinateY);
    }
}
