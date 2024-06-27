import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardhome',
  templateUrl: './dashboardhome.component.html',
  styleUrls: ['./dashboardhome.component.scss']
})
export class DashboardhomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(Date.now())
  }

}
