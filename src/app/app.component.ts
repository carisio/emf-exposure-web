import { Component, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material';

import { EvalAtManyProbesComponent } from './eval-at-many-probes/eval-at-many-probes.component';
import { BaseStationDialogComponent } from './base-station-dialog/base-station-dialog.component';

import { NIR } from '../nir/NIR';
import { FreeSpace } from '../nir/propagation/FreeSpace';
import { Point3D } from '../nir/util/Point3D';
import { DataBase } from './../nir/util/DataBase';

import { Dict } from './../shared/dict/dict';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Dictionary (used in labels)
  dict: {};

  // Configuration Form
  form: FormGroup;

  // Local
  states = [];
  cities = [];

  // Probe settings
  probeHeight = 1.5;

  // App mode
  advancedMode: boolean = false;

  nir: NIR = new NIR();
  ter: string = "0";
  base_stations = [];
  lat: number = 51.678418;
  lng: number = 7.809007;

  show_probe: boolean = false;
  probe: Point3D = new Point3D(0, 0, 1.5);

  ter_on_map = [];
  circleRadius = 20;

  constructor(private zone: NgZone,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.initializeAppMode();
    this.initializeDict();
    this.loadDefaultLocation();
    this.loadStateList();
    this.buildForm();
    this.nir.setPropagationModel(new FreeSpace());
  }
  initializeAppMode() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.advancedMode = params['advanced'] !== undefined;
    });
  }
  initializeDict() {
    this.activatedRoute.queryParams.subscribe((params) => {
      let language = params['lang'];
      this.dict = Dict.getDict(language);
    });
  }
  loadStateList() {
    this.states = [];
    for (let state_city of DataBase.STATE_CITIES) {
      this.states.push(state_city["state"]);
    }
  }
  loadCityList(state) {
    for (let state_city of DataBase.STATE_CITIES) {
      if (state_city.state === state) {
        this.cities = state_city.cities;
        break;
      }
    }
  }
  loadDefaultLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.zone.run(
            () => {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
            }
          )
        }
        );
    }
  }
  buildForm() {
    let form_controls = {};
    form_controls["state"] = new FormControl("DF", Validators.required);
    form_controls["city"] = new FormControl("Brasília", Validators.required);
    this.form = new FormGroup(form_controls);
    this.loadCityList("DF");
  }
  loadBaseStations() {
    this.nir.baseStations = DataBase.getERBs(this.form.value["state"], this.form.value["city"]);
    if (this.nir.baseStations.length > 0) {
      this.lat = this.nir.baseStations[0].getPosition().latitude;
      this.lng = this.nir.baseStations[0].getPosition().longitude;
    }
  }
  calculateTERAtProbe(probe : Point3D) {
    return this.nir.evalEandTERAtProbe(probe).ter;
  }
  calculateTERAtPoint(event) {
    this.show_probe = true;
    this.probe.latitude = event.coords.lat;
    this.probe.longitude = event.coords.lng;

    let ter = 0;
    if (! this.advancedMode) {
      this.probe.height = 1.1;
      let ter1 = this.calculateTERAtProbe(this.probe);
      this.probe.height = 1.5;
      let ter2 = this.calculateTERAtProbe(this.probe);
      this.probe.height = 1.7;
      let ter3 = this.calculateTERAtProbe(this.probe);
      ter = Math.max(ter1, ter2, ter3);
    } else {
      let height_typed = Number(this.probeHeight);
      if (!isNaN(height_typed))
        this.probe.height = height_typed;
      else
        this.probe.height = 1.5;

      ter = this.calculateTERAtProbe(this.probe);
    }
    
    this.ter = "<p><b>" + this.dict['probe']  + ": </b>"
              + "<p>" + this.dict['latitude']  + ": " + this.probe.latitude.toFixed(10) + "\xB0</p>"
              + "<p>" + this.dict['longitude']  + ": " + this.probe.longitude.toFixed(10) + "\xB0</p>"
              + (this.advancedMode ? "<p>" + this.dict['height']  + ": " + this.probe.height.toFixed(2) + " m</p>" : "")
              + "<hr>"
              + "<p><b>" + this.dict['total_exposure_ratio'] + ": </b>" + this.nir.evalEandTERAtProbe(this.probe).ter.toFixed(2) + " %</p>";
  }
  openManyProbesDialog() {
    this.dialog.open(EvalAtManyProbesComponent,{
      height: '500px',
      width: '600px',
      data: {
        dict: this.dict,
        nir: this.nir
      }
    }).afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.ter_on_map = data.result_ter;
          this.circleRadius = data.circleRadius;
        }
      }
    );
  }
  showBSInfo(bs) {
    this.dialog.open(BaseStationDialogComponent,{
      height: '460px',
      width: '600px',
      data: {
        dict: this.dict,
        bs: bs
      }
    });
  }
  getColor(ter) {
    // K.113 scale
    if (ter <= 1) {
      return "#73c2fb";
    } else if (ter <= 2) {
      return "#1e90ff";
    } else if (ter <= 4) {
      return "#2a52b3";
    } else if (ter <= 8) {
      return "#90ee90";
    } else if (ter <= 15) {
      return "#32cd32";
    } else if (ter <= 20) {
      return "#008000";
    } else if (ter <= 35) {
      return "#ffdf00";
    } else if (ter <= 50) {
      return "#ffa500";
    } else if (ter <= 100) {
      return "#ff4500";
    } else {
      return "#ff0000";
    }
  }
}