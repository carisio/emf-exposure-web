import { PropagationModel } from './propagation/PropagationModel';
import { BaseStation } from './base_station/BaseStation';
import { Point3D } from './util/Point3D';
import { power2electricfield, getICNIRPLimits, dB2Watt } from './util/Functions';

export class NIR {
  baseStations: BaseStation[] = [];
  private propagationModel: PropagationModel;

  constructor() {}

  public clearBaseStations(): void {
    this.baseStations = [];
  }

  public addBaseStation(bs: BaseStation): void {
    this.baseStations.push(bs);
  }
  public setPropagationModel(ps: PropagationModel): void {
    this.propagationModel = ps;
  }

  public evalEandTERAtProbe(probe: Point3D): {e: number, ter: number} {
		let E_field_total: number = 0;
		let TER: number = 0;

		for (let bs of this.baseStations) {
			const NRadioSources: number = bs.getNRadioSources();
			const freq_mhz: number[] = bs.getFrequencyMHz();
      const eirpToProbe_dBm: number[] = bs.getEIRPdBm(probe);

			for (let i = 0; i < NRadioSources; i++) {
				const txPos: Point3D = new Point3D(bs.getLatitude(),
						bs.getLongitude(), bs.getHeight()[i]);
				const rxIsotropicPower: number = eirpToProbe_dBm[i] - 30
						- this.propagationModel.getPathLoss(txPos, probe, freq_mhz[i]);

				const E_field_bs_i: number = power2electricfield(dB2Watt(rxIsotropicPower), freq_mhz[i]);
				const ER_bs_i: number = Math.pow((E_field_bs_i/getICNIRPLimits(freq_mhz[i])), 2);

				E_field_total += Math.pow(E_field_bs_i, 2);
				TER += ER_bs_i;
			}
		}
		E_field_total = Math.pow(E_field_total, 0.5);
		TER *= 100;

    return {e: E_field_total, ter: TER};
	}
}
