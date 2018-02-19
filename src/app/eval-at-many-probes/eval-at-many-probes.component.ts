import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Point3D } from '../../nir/util/Point3D';

@Component({
  selector: 'app-eval-at-many-probes',
  templateUrl: './eval-at-many-probes.component.html',
  styleUrls: ['./eval-at-many-probes.component.css']
})
export class EvalAtManyProbesComponent implements OnInit {
  probes_list: string = "";
  circle_radius: string = "20";
  result_ter = [];

  progress: number = 0;
  showProgress: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EvalAtManyProbesComponent>) { }

  ngOnInit() {
  }

  /**
   * Based on:
   * https://stackoverflow.com/questions/28400223/angularjs-force-dom-update-during-long-running-loop-i-e-progress-indicator
   */
  startCalculation() {
    this.progress = 0;
    this.showProgress = true;

    this.result_ter = [];
    let nir = this.data.nir;
    let result = "";
    let lines = this.probes_list.split(/\r\n|\r|\n/);

    this.evalProbesRecursively(lines, result, 0, 100);
  }
  evalProbesRecursively(lines, result, initial_idx, final_idx) {
    setTimeout(() => {

      this.progress = 100 * initial_idx / lines.length;
      for (let i = initial_idx; i < final_idx && i < lines.length; i++) {
        let line = lines[i].trim();
        result = result + this.evalNirAtProbe(line);
      }
      this.progress = 100 * final_idx / lines.length;
      if (final_idx >= lines.length - 1) {
        this.probes_list = result;
        this.progress = 100;
      }
      else
        this.evalProbesRecursively(lines, result, final_idx, final_idx + 100);
    }), 0;
  }
  evalNirAtProbe(line: string) {
    let probe_info = line.split(/\s+|\t+/);
    let line_result = line + "\t";
    if (probe_info.length !== 3) {
      line_result = line_result + this.data.dict['invalid_probe'] + "\n";
    } else {
      let latitude = Number(probe_info[0]);
      let longitude = Number(probe_info[1]);
      let height = Number(probe_info[2]);

      if (isNaN(latitude) || isNaN(latitude) || isNaN(latitude)) {
        line_result = line_result + "\t" + this.data.dict['invalid_probe'] + "\n";
      } else {
        let probe = new Point3D(latitude, longitude, height);
        let ter = this.data.nir.evalEandTERAtProbe(probe).ter;
        this.result_ter.push({probe: probe, ter: ter});
        line_result = line_result + "\t" + ter + "\n";
      }
    }
    return line_result;
  }

  // calculate() {
  //   this.result_ter = [];
  //   let nir = this.data.nir;
  //   let result = "";
  //   let lines = this.probes_list.split(/\r\n|\r|\n/);
      
  //   // this.progress = 0;
  //   // this.show_progress = true;
  //   let total_lines = lines.length;
  //   let line_idx = 0;
  //   for (let line of lines) {
  //     if (line_idx % 50 === 0)
  //       console.log(100*line_idx/total_lines, "%");
  //     line_idx++;
  //     line = line.trim();
  //     let probe_info = line.split(/\s+|\t+/);
  //     if (probe_info.length !== 3) {
  //       result = result + line + " " + this.data.dict['invalid_probe'] + "\n";
  //     } else {
  //       let latitude = Number(probe_info[0]);
  //       let longitude = Number(probe_info[1]);
  //       let height = Number(probe_info[2]);

  //       if (isNaN(latitude) || isNaN(latitude) || isNaN(latitude)) {
  //         result = result + line + " " + this.data.dict['invalid_probe'] + "\n";
  //       } else {
  //         let probe = new Point3D(latitude, longitude, height);
  //         let ter = nir.evalEandTERAtProbe(probe).ter;
  //         this.result_ter.push({probe: probe, ter: ter});
  //         result = result + line + "\t" + ter + "\n";
  //       }
  //     }
  //   }
  //   this.probes_list = result;
  // }
  showResultsOnMap() {
    let radius = Number(this.circle_radius);
    radius = isNaN(radius) ? 20 : radius;
    this.dialogRef.close({result_ter: this.result_ter, circleRadius: radius});
  }
}