export class RectangularCoordinates {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  minus(rectangularCoordinates) {
    return new RectangularCoordinates(
      this.x - rectangularCoordinates.x,
      this.y - rectangularCoordinates.y,
      this.z - rectangularCoordinates.z,
    );
  }
}
