import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './core/components/page-not-found/pagenotfound.component';
import { AboutComponent } from './features/about/about.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { CyberSecurityComponent } from './features/cyber-security/cyber-security.component';
import { RegisterComponent } from './features/register/register.component';
import { ResourcesComponent } from './features/resources/resources.component';
import { UserAccountComponent } from './features/user-account/user-account.component';
import { ImpactDataComponent } from './features/impact-data/impact-data.component';
import { BackgroundCheckingComponent } from './features/background-checking/background-checking.component';
import { BankingComponent } from './features/banking/banking.component';
import { CapitalRaisingComponent } from './features/capital-raising/capital-raising.component';
import { EContractsComponent } from './features/e-contracts/e-contracts.component';
import { KnowledgeHubComponent } from './features/knowledge-hub/knowledge-hub.component';
  
const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'about', component: AboutComponent},
    { path: 'cyber-security', component: CyberSecurityComponent},
    { path: 'resources', component: ResourcesComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'user-account', component: UserAccountComponent},
    { path: 'background-checking', component: BackgroundCheckingComponent},
    { path: 'banking', component: BankingComponent},
    { path: 'capital-raising', component: CapitalRaisingComponent},
    { path: 'e-contracts', component: EContractsComponent},
    { path: 'knowledge-hub', component: KnowledgeHubComponent},
    { path: 'impact-data', component: ImpactDataComponent},
  
    //Wild Card Route for 404 request
    { path: '**', pathMatch: 'full', 
        component: PageNotFoundComponent},
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }