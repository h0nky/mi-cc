import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { VideosTableComponent } from 'src/app/components/videos-table/videos-table.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { AddVideoComponent } from 'src/app/components/add-video/add-video.component';
import { EditVideoComponent } from 'src/app/components/edit-video/edit-video.component';
import { DataService } from './services/dataservice/data.service';
import { VideoService } from './services/videoservice/video.service';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AppComponent, ButtonComponent, VideosTableComponent, InputComponent, HomeComponent, AddVideoComponent, EditVideoComponent, DeleteConfirmationComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, MatDialogModule],
  providers: [DataService, VideoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
