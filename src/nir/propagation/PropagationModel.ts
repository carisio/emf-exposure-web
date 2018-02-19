import { Point3D } from '../util/Point3D';

export abstract class PropagationModel {
	public abstract getPathLoss(txPosition: Point3D, rxPosition: Point3D, freqMHz: number): number;
}
