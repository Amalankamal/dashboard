import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

export enum Keyboard_KEY {
  F2_ADD = 113,
  F4 = 114,
  F7_SAVE = 118,
  F8_ENTRY_DIALOG_SAVE = 119,
  F9_CANCEL = 120,
  ESCAPE_DIALOG_CLOSE = 27,
  ENTER_MESSAGE_DIALOG_OK = 13,
  HOME_PAGE_START = 36,
  PAGEUP_NEXT_PAGE = 33,
  PAGEDOWN_PRE_PAGE = 34,
  END_PAGE_END = 35
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MessageDialogComponent implements OnInit {
  MessageTitle: string = "New Message";
  MessageDetails: string = "Message";
  Cancellabel: string = "Cancel";
  Oklabel: string = "Ok";
  CancelButtonVisible: Boolean;
  OkButtonVisible: Boolean;
  @HostListener('keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log("MessageDialog : "+event.key+' ' +event.keyCode);
    if (event.keyCode === Keyboard_KEY.ENTER_MESSAGE_DIALOG_OK && this.OkButtonVisible) {
      this.aMessageDialogRef.close(['Ok']);
    } else if (event.keyCode === Keyboard_KEY.ESCAPE_DIALOG_CLOSE && this.CancelButtonVisible) {
      this.aMessageDialogRef.close(['Cancel']);
    }
  }

  constructor( public aMessageDialogRef: MatDialogRef<MessageDialogComponent>) {

  }

  ngOnInit() {
    
  }

}
