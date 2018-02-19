import { Constants } from './Constants';
import { Point3D } from './Point3D';

export function between(min: number, val: number, max: number): boolean {
  return val >= min && val <= max;
}

export function dB2Watt(db: number): number {
  return Math.pow(10, db / 10);
}

export function dB2WattArray(db: number[]): number[] {
  let watt: number[] = [];
  for (let i = 0; i < db.length; i++)
    watt.push(Math.pow(10, db[i] / 10));
  return watt;
}

export function watt2dB(watt: number): number {
  return 10*Math.log10(watt);
}

export function watt2dBArray(watt: number[]): number[] {
  let db: number[] = [];
  for (let i = 0; i < watt.length; i++)
    db[i] = 10*Math.log10(watt[i]);
  return db;
}

export function power2electricfield(powerWatt: number, freqMHz: number): number {
  let lambda: number = Constants.C/(freqMHz*1e6);
  const aff = (lambda*lambda)/(4*Math.PI);
  return Math.sqrt(377*powerWatt/aff);
}

export function deg2rad(deg: number): number {
  return deg * Constants.DEGREE_TO_RAD;
}

export function deg2radArray(deg: number[]): number[] {
  let rad: number[] = [];
  for (let i = 0; i < deg.length; i++)
    rad.push(deg[i] * Constants.DEGREE_TO_RAD);
  return rad;
}

export function rad2deg(rad: number): number {
  return rad * Constants.RAD_TO_DEGREE;
}

export function rad2degArray(rad: number[]): number[] {
  let deg: number[] = [];
  for (let i = 0; i < rad.length; i++)
    deg.push(rad[i] * Constants.RAD_TO_DEGREE);
  return deg;
}

export function getICNIRPLimits(f: number): number {
  if (f < 10) return 83;
  if (f < 400) return 28;
  if (f < 2000) return 1.375 * Math.pow(f, 0.5);
  if (f < 300000) return 61;
  return 61;
}

export function get2DDistanceKM(p1: Point3D, p2: Point3D): number {
  const lat1: number = p1.latitude;
  const long1: number = p1.longitude;

  const lat2: number = p2.latitude;
  const long2: number = p2.longitude;

  return 6371*Math.acos(Math.cos((90-lat2)*Constants.DEGREE_TO_RAD)*Math.cos((90-lat1)*Constants.DEGREE_TO_RAD)+Math.sin((90-lat2)*Constants.DEGREE_TO_RAD)*Math.sin((90-lat1)*Constants.DEGREE_TO_RAD)*Math.cos((long1-long2)*Constants.DEGREE_TO_RAD));
}

export function get3DDistanceKM(p1: Point3D, p2: Point3D): number {
  const d_2d: number = get2DDistanceKM(p1, p2);
  const height: number = Math.abs(p1.height - p2.height);
  return Math.sqrt(d_2d*d_2d + Math.pow((height)/1000,2));
}

export function toDecimalDegree(degree: number, minutes: number, seconds: number): number {
  const posNeg: number = (degree < 0) ? -1 : 1;
  return posNeg*(Math.abs(degree) + minutes/60 + seconds/3600);
}

	/**
	 * Returns the elevation angle (theta) between the point bs and the point probe. Theta is the angle
	 * between the horizon and the line of sign between the points bs and probe. If htx is the height
	 * of the point bs and hrx is the height of the point probe, the elevation angle is given by:
	 *
	 *
	 * teta_degree = atan2(htx-hrx, d_2d) * 180 / PI
	 *
	 * 		^
	 * 		|
	 * 		|
	 * 	htx	x\----------------------> Horizon
	 * 		| \
	 * 		|  \
	 * 		|   \   -----> Line of sign between bs and probe
	 * 		|    \
	 * 	hrx	|     \x---> Probe
	 * 		0------|------------------> x
	 *           d_2d
	 *
	 *
	 */
export function getThetaDegree(bs: Point3D, probe: Point3D): number {
  const htx: number = bs.height;
  const hrx: number = probe.height;
  const d_2d: number = get2DDistanceKM(bs, probe);
  const teta_degree: number = Math.atan2(htx-hrx, d_2d*1000) * Constants.RAD_TO_DEGREE;

  return teta_degree;
}
export function getThetaRad(bs: Point3D, probe: Point3D): number {
  const htx = bs.height;
  const hrx = probe.height;
  const d_2d = get2DDistanceKM(bs, probe);
  const teta_degree = Math.atan2(htx-hrx, d_2d*1000);

  return teta_degree;
}

/**
	 * Returns the azimuth angle between the points bs and probe. The reference (0 degree) is the north
	 * and the angle increases clockwise until reachs the line connecting the points bs and probe (see figure).
	 * The angle alfa is given by:
	 *
	 * alfa_degree = atan2(probe's longitude - bs' longitude, probe's latitude - bs' latitude) * 180/PI
	 * phi_degree = 90 - alfa_degree
	 *
	 * Note: The arguments of atan2 should be given in length units. So, the difference must be converted to distance
	 * before computing the operations
	 *
	 * Note2: Because of the translation of alpha to get phi, the result of the operation in quadrant IV can be negative.
	 * The result should be converted to positive [if (phi_degree < 0) then (phi_degree = 360 + phi_degree)] before
	 * return.
	 *
	 * 		North (latitude)
	 * 			^
	 * 			|       o
	 * 			|      /
	 * 			|_phi /
	 * 			|  \ /
	 * 			|   /
	 * 			|  /
	 * 			| /_  alfa
	 * 			|/   \
	 * 	--------X-------------------------------> East (longitude)
	 * 			|
	 * 			|
	 * Note: The point bs is the orign, represented with an 'X'. The point probe is represented with an 'o'.
	 */
export function getPhiDegree(bs: Point3D, probe: Point3D): number {
  const probeSameLat: Point3D = new Point3D(bs.latitude, probe.longitude, 0);
  const probeSameLong: Point3D = new Point3D(probe.latitude, bs.longitude, 0);

  let longDistance: number = get2DDistanceKM(bs, probeSameLat);
  let latDistance: number = get2DDistanceKM(bs, probeSameLong);

  if (probe.longitude < bs.longitude)
    longDistance *= -1;
  if (probe.latitude < bs.latitude)
    latDistance *= -1;

  // atan2(y, x)
  let phi_degree: number = 90.0 - Math.atan2(latDistance, longDistance) * Constants.RAD_TO_DEGREE;
  if (phi_degree < 0)
    phi_degree = 360 + phi_degree;

  return phi_degree;
}
