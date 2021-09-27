import { NeutrinosAuthGuardService } from 'neutrinos-oauth-client';
import { PageNotFoundComponent } from '../not-found.component';
import { LayoutComponent } from '../layout/layout.component';
import { ImgSrcDirective } from '../directives/imgSrc.directive';
import { APP_INITIALIZER } from '@angular/core';
import { NDataSourceService } from '../n-services/n-dataSorce.service';
import { environment } from '../../environments/environment';
import { NLocaleResource } from '../n-services/n-localeResources.service';
import { NAuthGuardService } from 'neutrinos-seed-services';
import { ArtImgSrcDirective } from '../directives/artImgSrc.directive';


window['neutrinos'] = {
  environments: environment
}

//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-createfilesService
import { createfilesService } from '../services/createfiles/createfiles.service';
//CORE_REFERENCE_IMPORT-base_layoutComponent
import { base_layoutComponent } from '../components/base_layoutComponent/base_layout.component';
//CORE_REFERENCE_IMPORT-admin_containerComponent
import { admin_containerComponent } from '../components/admin_containerComponent/admin_container.component';
//CORE_REFERENCE_IMPORT-generic_dialogueComponent
import { generic_dialogueComponent } from '../components/generic_dialogueComponent/generic_dialogue.component';
//CORE_REFERENCE_IMPORT-attendance_dashboardComponent
import { attendance_dashboardComponent } from '../components/attendance_dashboardComponent/attendance_dashboard.component';
//CORE_REFERENCE_IMPORT-apiService
import { apiService } from '../services/api/api.service';
//CORE_REFERENCE_IMPORT-markregisterComponent
import { markregisterComponent } from '../components/markregisterComponent/markregister.component';

/**
 * Reads datasource object and injects the datasource object into window object
 * Injects the imported environment object into the window object
 *
 */
export function startupServiceFactory(startupService: NDataSourceService) {
  return () => startupService.getDataSource();
}

/**
*bootstrap for @NgModule
*/
export const appBootstrap: any = [
  LayoutComponent,
];


/**
*declarations for @NgModule
*/
export const appDeclarations = [
  ImgSrcDirective,
  LayoutComponent,
  PageNotFoundComponent,
  ArtImgSrcDirective,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-base_layoutComponent
base_layoutComponent,
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-admin_containerComponent
admin_containerComponent,
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-generic_dialogueComponent
generic_dialogueComponent,
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-attendance_dashboardComponent
attendance_dashboardComponent,
//CORE_REFERENCE_PUSH_TO_DEC_ARRAY-markregisterComponent
markregisterComponent,

];

/**
* provider for @NgModuke
*/
export const appProviders = [
  NDataSourceService,
  NLocaleResource,
  {
    // Provider for APP_INITIALIZER
    provide: APP_INITIALIZER,
    useFactory: startupServiceFactory,
    deps: [NDataSourceService],
    multi: true
  },
  NAuthGuardService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY
//CORE_REFERENCE_PUSH_TO_PRO_ARRAY-createfilesService
createfilesService,
//CORE_REFERENCE_PUSH_TO_PRO_ARRAY-apiService
apiService,

];

/**
* Routes available for bApp
*/

// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_START
export const appRoutes = [{path: 'home', component: base_layoutComponent,
children: [{path: '', component: markregisterComponent}]},{path: 'admin', component: base_layoutComponent,
children: [{path: '', component: admin_containerComponent}]},{path: '', redirectTo: '/home', pathMatch: 'full'},{path: '**', component: PageNotFoundComponent}]
// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_END
