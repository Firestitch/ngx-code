import { Directive, Input, HostListener, OnDestroy } from '@angular/core';
import { FsShareService } from '../services/share.service';
import { Platform } from '../enums/platform.emun';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Directive({
  selector: '[fsShare]',
})
export class FsShareDirective implements OnDestroy {

  @Input() platform: Platform;
  @Input() config: any;

  @HostListener('click', ['$event']) onClick($event) {
    this._share();
  }

  private _destory$ = new Subject();

  constructor(
    public shareService: FsShareService
  ) {}


  private _share() {
    this.shareService.open(this.platform, this.config)
    .pipe(
      takeUntil(this._destory$)
    )
    .subscribe(response => {
      if (this.config.success) {
        this.config.success({ platform: this.platform });
      }
    },
    (error) => {
      if (this.config.error) {
        this.config.error({ platform: this.platform, error: error });
      }
    });
  }

  ngOnDestroy() {
    this._destory$.next();
    this._destory$.complete();
  }
}
