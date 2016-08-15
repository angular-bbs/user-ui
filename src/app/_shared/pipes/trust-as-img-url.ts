import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
@Pipe({
  name: 'trustAsImgUrl'
})
export class TrustAsImgUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizationService) {
  }

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
