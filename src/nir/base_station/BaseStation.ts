import { Point2D } from '../util/Point2D';
import { Point3D } from '../util/Point3D';

export abstract class BaseStation {
  private id: number;
  private static lastID: number = 0;
  private name: string;
  private pos: Point2D;
  private height: number[];
  private frequency: number[];

  constructor(name: string, position: Point2D, height: number[], frequency_mhz: number[]) {
    this.setId();
    this.name = name;
    this.pos = position;
    this.height = height;
    this.frequency = frequency_mhz;
  }

	/**
	 * Returns the transmitted power in dB in the probe direction
	 */
  public abstract getEIRPdBm(probe: Point3D): number[];

  public getPosition(): Point2D {
		if (this.pos === undefined)
			this.pos = new Point2D(0, 0);
		return this.pos;
	}
	public setPosition(pos: Point2D): void {
		this.pos = pos;
	}
	public getLatitude(): number {
		return this.getPosition().latitude;
	}
	public getLongitude(): number {
		return this.getPosition().longitude;
	}
	public getNRadioSources(): number {
		return this.getFrequencyMHz().length;
	}
	public getFrequencyMHz(): number[] {
		if (this.frequency == undefined) {
			this.frequency = [];

		}
		return this.frequency;
	}
	public setFrequencyMHz(frequency: number[]): void {
		this.frequency = frequency;
	}
	public getHeight(): number[] {
		if (this.height == null) {
      this.height = [];
		}
		return this.height;
	}
	public setHeight(height: number[]): void {
		this.height = height;
	}
	public getName(): string {
		if (this.name == undefined)
			this.name = "";
		return this.name;
	}
	public setName(name: string): void {
		this.name = name;
	}

	public toString(): string {
		// String result = Parser.codeWhitespaces(getClass().getCanonicalName().toString()) + "\t"
		// 		+ Parser.codeWhitespaces(getName()) + "\t"
		// 		+ getPosition().getLatitude() + "\t"
		// 		+ getPosition().getLongitude() + "\t"
		// 		+ Parser.codeDoubleArray(getHeight()) + "\t"
		// 		+ Parser.codeDoubleArray(getFrequencyMHz()) + "\t"
		// 		+ doToString("\t");
    // return result;
    return "TESTE";
	}
	public doToString(separator: string): string {
		return "";
	}
	private setId(): void {
		BaseStation.lastID++;
		this.id = BaseStation.lastID;
	}
	public getId(): string {
		return "" + this.id;
	}
}
