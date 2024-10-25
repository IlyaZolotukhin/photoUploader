import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {environment} from "./enviroments/enviroments";
import {AppComponent} from "./app/app.component";
import {PhotoUploadComponent} from "./app/photo-upload/photo-upload.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    PhotoUploadComponent,
    PhotoUploadComponent,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
