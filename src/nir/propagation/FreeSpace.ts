import { get3DDistanceKM } from '../util/Functions';
import { Point3D } from '../util/Point3D';
import { PropagationModel } from './PropagationModel';

export class FreeSpace extends PropagationModel {

	public getPathLoss(txPosition: Point3D, rxPosition: Point3D, freqMHz: number): number {
		let d_km: number = get3DDistanceKM(txPosition, rxPosition);
		// For path loss calculation, consider that 1m is the minimum distance
		if (d_km < 0.001)
			d_km = 0.001;
		return 32.44 + 20*Math.log10(freqMHz) + 20*Math.log10(d_km);
	}
}
