export class Point3D {
  public latitude: number = 0;
  public longitude: number = 0;
  public height: number = 0;
  constructor(latitude: number, longitude: number, height?: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    if (height !== undefined)
      this.height = height;
  }
}
