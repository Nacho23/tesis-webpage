import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministratorRouteGuardService } from '../../services/administratorRouteGuard/administrator-route-guard-service';

import { CardsComponent } from './cards.component';
import { FormsComponent } from './forms.component';
import { SwitchesComponent } from './switches.component';
import { TablesComponent } from './tables.component';
import { TabsComponent } from './tabs.component';
import { CarouselsComponent } from './carousels.component';
import { CollapsesComponent } from './collapses.component';
import { PaginationsComponent } from './paginations.component';
import { PopoversComponent } from './popovers.component';
import { ProgressComponent } from './progress.component';
import { TooltipsComponent } from './tooltips.component';
import { SettingsComponent } from './settings.component';
import { GodFathersComponent }  from './godfathers.component';
import { GodSonsComponent } from './godsons.component';
import { ProfileComponent } from './profile.component';
import { DetailsUserComponent } from './details-user.component';
import { QuestionComponent } from './question.component';
import { NoticeComponent } from './notice.component';
import { DetailsAlertsComponent } from './details-alert.component';
import { MessagesComponent } from './messages.component';
import { HistoryComponent } from './history.component';
import { DepartmentComponent }  from './department.component';
import { SubadministratorComponent } from './subadministrator.component';
import { CategoryComponent } from './category.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base'
    },
    children: [
      {
        path: 'godfathers',
        component: GodFathersComponent,
        data: {
          title: 'Padrinos'
        }
      },
      {
        path: 'godsons',
        component: GodSonsComponent,
        data: {
          title: 'Ahijados'
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          title: 'Configuraciones'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Perfil'
        }
      },
      {
        path: 'details-user/:id',
        component: DetailsUserComponent,
        data: {
          title: 'Detalle de Usuario'
        }
      },
      {
        path: 'details-alert/:uid',
        component: DetailsAlertsComponent,
        data: {
          title: 'Detalle de Alerta'
        }
      },
      {
        path: 'questions',
        component: QuestionComponent,
        data: {
          title: 'Preguntas'
        }
      },
      {
        path: 'notice',
        component: NoticeComponent,
        data: {
          title: 'Avisos'
        }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: {
          title: 'Mensajes'
        }
      },
      {
        path: 'subadministrator',
        component: SubadministratorComponent,
        data: {
          title: 'Subadministración'
        },
        canActivate: [AdministratorRouteGuardService]
      },
      {
        path: 'department',
        component: DepartmentComponent,
        data: {
          title: 'Unidades'
        },
        canActivate: [AdministratorRouteGuardService]
      },
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: 'Categorías'
        }
      },
      {
        path: 'history',
        component: HistoryComponent,
        data: {
          title: 'Historial'
        }
      },
      {
        path: 'tables',
        component: TablesComponent,
        data: {
          title: 'Tables'
        }
      },
      {
        path: 'tabs',
        component: TabsComponent,
        data: {
          title: 'Tabs'
        }
      },
      {
        path: 'carousels',
        component: CarouselsComponent,
        data: {
          title: 'Carousels'
        }
      },
      {
        path: 'collapses',
        component: CollapsesComponent,
        data: {
          title: 'Collapses'
        }
      },
      {
        path: 'paginations',
        component: PaginationsComponent,
        data: {
          title: 'Pagination'
        }
      },
      {
        path: 'popovers',
        component: PopoversComponent,
        data: {
          title: 'Popover'
        }
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: {
          title: 'Progress'
        }
      },
      {
        path: 'tooltips',
        component: TooltipsComponent,
        data: {
          title: 'Tooltips'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
