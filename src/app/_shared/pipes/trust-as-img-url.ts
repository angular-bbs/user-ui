import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Pipe({
  name: 'trustAsImgUrl'
})
export class TrustAsImgUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
