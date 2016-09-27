import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'html-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [
    './viewer.component.scss'
  ],
})
export class HtmlViewerComponent implements OnChanges {
  @Input() content: string;
  private html: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change: SimpleChange = changes['content'];
    if (change.currentValue) {
      this.html = this.sanitizer.bypassSecurityTrustHtml(change.currentValue);
    }
  }
}
