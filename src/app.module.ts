import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {environment} from "./enviroments/enviroments";
import {AppComponent} from "./app/app.component";
import {PhotoUploadComponent} from "./app/photo-upload/photo-upload.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        PhotoUploadComponent,
        PhotoUploadComponent], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
