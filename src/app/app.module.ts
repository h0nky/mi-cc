import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { VideosTableComponent } from './components/videos-table/videos-table.component';
import { InputComponent } from './components/input/input.component';
import { HomeComponent } from './components/home/home.component';
import { AddVideoComponent } from './components/form/add-video.component';

@NgModule({
  declarations: [AppComponent, ButtonComponent, VideosTableComponent, InputComponent, HomeComponent, AddVideoComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
