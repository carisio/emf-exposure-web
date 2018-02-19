import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-base-station-dialog',
  templateUrl: './base-station-dialog.component.html',
  styleUrls: ['./base-station-dialog.component.css']
})
export class BaseStationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  formatArray(array, decimals) {
    let result = "";
    for (let num of array) {
      result = result + " " + num.toFixed(decimals);
    }
    return "[" + result.trim() + "]";
  }
}