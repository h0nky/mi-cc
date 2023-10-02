import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { EditVideoComponent } from './components/edit-video/edit-video.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-video', component: AddVideoComponent },
  { path: 'edit-video/${id}', component: EditVideoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
