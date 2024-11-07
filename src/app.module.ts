import {NG_EVENT_PLUGINS} from "@taiga-ui/event-plugins";
import {TuiRoot} from "@taiga-ui/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {environment} from "./enviroments/enviroments";
import {AppComponent} from "./app/app.component";
import {PhotoUploadComponent} from "./photo-upload/photo-upload.component";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import InputFilesComponent from "./input-files/input-files.component";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    PhotoUploadComponent,
    BrowserAnimationsModule,
    TuiRoot,
    InputFilesComponent
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), NG_EVENT_PLUGINS]
})
export class AppModule {
}
