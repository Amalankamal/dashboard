import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { EncryptSessionService } from '../service/encryptsession.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressbarComponent implements OnInit {
  mShowLoadingText: boolean = false;
  constructor(public aProgressbarDialogRef: MatDialogRef<ProgressbarComponent>, public cEncryptSessionService: EncryptSessionService) {
    this.mShowLoadingText = false;
  }

  ngOnInit() {
  }

}
