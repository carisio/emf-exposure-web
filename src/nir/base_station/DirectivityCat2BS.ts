import { BaseStation } from './BaseStation';
import { Point2D } from '../util/Point2D';
import { Point3D } from '../util/Point3D';
import { between, getThetaRad, deg2rad, deg2radArray, watt2dB } from '../util/Functions';

export class DirectivityCat2BS extends BaseStation {
	private tilt_degree: number[];
	private theta_bw_vertical_degree: number[];
	private eirp_max_dbm: number[];
	private envelope_db: number[];

	constructor(name: string, position: Point2D,
			height: number[], frequency_mhz: number[],
			tilt_degree: number[], theta_bw_vertical_degree: number[],
			eirp_max_dbm: number[], max_envelope_side_lobe_db: number[]) {
		super(name, position, height, frequency_mhz);
		this.setEirpMaxdBm(eirp_max_dbm);
		this.setTiltDegree(tilt_degree);
		this.setMaxSideLobeEnvelopedB(max_envelope_side_lobe_db);
		this.setThetaBwVerticalDegree(theta_bw_vertical_degree);
	}
	public getEIRPdBm(probe: Point3D): number[] {
		const NRadioSources: number = this.getNRadioSources();
		let eirp: number[] = [];
		for (let i = 0; i < NRadioSources; i++) {
			const radioSource: Point3D = new Point3D(
					this.getLatitude(),
					this.getLongitude(),
					this.getHeight()[i]);
			const theta_vertical_rad: number =
					getThetaRad(radioSource, probe);
			const F = this.getFdB(theta_vertical_rad,
					deg2rad(this.tilt_degree[i]),
					deg2rad(this.theta_bw_vertical_degree[i]),
					this.envelope_db[i]);
			eirp.push(this.eirp_max_dbm[i] + F);
		}
		return eirp;
	}

	private getFdB(theta_rad: number, tilt_rad: number,
			theta_bw_vertical_rad: number, envelope_db: number): number {
		const firstNull: number = 2.257*theta_bw_vertical_rad/2;
		const firstNullMin: number = tilt_rad - firstNull;
		const firstNullMax: number = tilt_rad + firstNull;
		const mainBeam = between(firstNullMin,
				theta_rad, firstNullMax);

		if (between(tilt_rad - 0.00175,
				theta_rad, tilt_rad + 0.00175)) {
			return 0;
		}

		if (mainBeam) {
			const c: number = 1.392/Math.sin(theta_bw_vertical_rad/2);
			const aux: number = c*Math.sin(theta_rad-tilt_rad);
			const FLinear: number = Math.pow(Math.sin(aux)/aux, 2);

			let FdB = watt2dB(FLinear);
			if (FdB < envelope_db)
				FdB = envelope_db;
			return FdB;
		} else {
			return envelope_db;
		}
	}

	public doToString(separator: string): string {
		// String result = Parser.codeDoubleArray(getTiltDegree()) + separator +
		// 		Parser.codeDoubleArray(getThetaBwVerticalDegree()) + separator +
		// 		Parser.codeDoubleArray(getEirpMaxdBm()) + separator +
		// 		Parser.codeDoubleArray(getMaxSideLobeEnvelopedB()) + separator;
    // return result;
    return "";
	}
	public setMaxSideLobeEnvelopedB(envelope: number[]): void {
		this.envelope_db = envelope;
	}
	public getMaxSideLobeEnvelopedB(): number[] {
		if (this.envelope_db === undefined)
			this.envelope_db = [];
		return this.envelope_db;
	}
	public getEirpMaxdBm(): number[] {
		if (this.eirp_max_dbm === undefined)
			this.eirp_max_dbm = [];
		return this.eirp_max_dbm;
	}
	public setEirpMaxdBm(eirpMaxdbm: number[]): void {
  	this.eirp_max_dbm = eirpMaxdbm;
	}
	public setThetaBwVerticalDegree(thetaDeg: number[]): void {
		this.theta_bw_vertical_degree = thetaDeg;
	}
	public getThetaBwVerticalDegree(): number[] {
		if (this.theta_bw_vertical_degree == null)
			this.theta_bw_vertical_degree = [];

		return this.theta_bw_vertical_degree;
	}
	public getTiltDegree(): number[] {
		if (this.tilt_degree === undefined)
			this.tilt_degree = [];

		return this.tilt_degree;
	}
	public setTiltDegree(tiltDegree: number[]): void {
		this.tilt_degree = tiltDegree;
  }
}
