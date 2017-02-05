import { BasePageComponent } from './base/page.component';
import { HtmlViewerComponent } from './html/viewer.component';
import { LayoutNavComponent } from './layout/nav.component';
import { MenuListComponent } from './menu/list.component';
export * from './base/page.component';
export * from './html/viewer.component';
export * from './layout/nav.component';
export * from './menu/list.component';

export const SHARED_COMPONENTS = [
    // BasePageComponent,
    HtmlViewerComponent,
    LayoutNavComponent,
    MenuListComponent
];
