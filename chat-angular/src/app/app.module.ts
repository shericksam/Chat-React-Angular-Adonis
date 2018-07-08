import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './componentes/app/app.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
    // Routing,
    // BrowserAnimationsModule,
    // CoreModule,
    // ReactiveFormsModule,
    // MdInputModule,
    // MdButtonModule,
    // MdCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
