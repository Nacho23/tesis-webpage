// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CardsComponent } from './cards.component';

// Charts Module
import { ChartsModule } from 'ng2-charts/ng2-charts';

// Forms Component
import { FormsComponent } from './forms.component';

import { SwitchesComponent } from './switches.component';
import { TablesComponent } from './tables.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TabsComponent } from './tabs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselsComponent } from './carousels.component';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CollapsesComponent } from './collapses.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoversComponent } from './popovers.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationsComponent } from './paginations.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ProgressComponent } from './progress.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TooltipsComponent } from './tooltips.component';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';


// Components Routing
import { BaseRoutingModule } from './base-routing.module';

//Settings Components
import { SettingsComponent } from './settings.component';

//GodFathers Components
import { GodFathersComponent } from './godfathers.component';

//Settings Components
import { GodSonsComponent } from './godsons.component';

//Profile Components
import { ProfileComponent } from './profile.component';

// Details User Components
import { DetailsUserComponent } from './details-user.component';

// Question Components
import { QuestionComponent } from './question.component';

// Notice Components
import { NoticeComponent } from './notice.component';

// Details Alerts Component
import { DetailsAlertsComponent } from './details-alert.component';

// Messages Component
import { MessagesComponent } from './messages.component';

// History Component
import { HistoryComponent } from './history.component';

// Departments Component
import { DepartmentComponent } from './department.component';

// History Component
import { SubadministratorComponent } from './subadministrator.component';

// Category Component
import { CategoryComponent } from './category.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgbModule,
    ModalModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    CardsComponent,
    FormsComponent,
    SwitchesComponent,
    TablesComponent,
    TabsComponent,
    CarouselsComponent,
    CollapsesComponent,
    PaginationsComponent,
    PopoversComponent,
    ProgressComponent,
    TooltipsComponent,
    SettingsComponent,
    GodFathersComponent,
    GodSonsComponent,
    ProfileComponent,
    DetailsUserComponent,
    QuestionComponent,
    NoticeComponent,
    DetailsAlertsComponent,
    MessagesComponent,
    HistoryComponent,
    DepartmentComponent,
    SubadministratorComponent,
    CategoryComponent
  ]
})
export class BaseModule { }
