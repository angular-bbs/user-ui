import {Component, OnInit, Input} from '@angular/core';
import {Partner} from '../../_shared';

@Component({
  selector: 'partner-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss'
  ],


})
export class PartnerDetailsComponent implements OnInit {

  @Input() item: Partner;

  constructor() {
  }

  ngOnInit() {
  }

}
