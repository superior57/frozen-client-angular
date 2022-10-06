import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdcTopAppBarModule } from '@angular-mdc/web/top-app-bar';
import { MdcListModule } from '@angular-mdc/web/list';
import { MdcMenuModule } from '@angular-mdc/web/menu';
import { MdcIconModule } from '@angular-mdc/web/icon';
import { MdcTabModule } from '@angular-mdc/web/tab';
import { MdcTabBarModule } from '@angular-mdc/web/tab-bar';
import { MdcMenuSurfaceModule } from '@angular-mdc/web/menu-surface';
import { MdcTabScrollerModule } from '@angular-mdc/web/tab-scroller';
import { MdcDrawerModule } from '@angular-mdc/web/drawer';
import { MdcTypographyModule } from '@angular-mdc/web/typography';
import { MdcButtonModule } from '@angular-mdc/web/button';
import { MdcIconButtonModule } from '@angular-mdc/web/icon-button';
import { MdcLinearProgressModule } from '@angular-mdc/web/linear-progress';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MdcTopAppBarModule,
    MdcListModule,
    MdcMenuModule,
    MdcIconModule,
    MdcTabModule,
    MdcTabBarModule,
    MdcMenuSurfaceModule,
    MdcTabScrollerModule,
    MdcDrawerModule,
    MdcTypographyModule,
    MdcButtonModule,
    MdcIconButtonModule,
    MdcLinearProgressModule,
  ],
})
export class MdcModule {}
