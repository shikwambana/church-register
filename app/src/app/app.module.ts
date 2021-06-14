import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appDeclarations, appBootstrap, appProviders } from './config/declarations';
import { appImportModules } from './config/import-modules';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

const config = {
  apiKey: "AIzaSyAsZZK4qSBgIOFhvkCtnSC76LpE_ECssEY",
  authDomain: "volt3c.firebaseapp.com",
  projectId: "volt3c",
  storageBucket: "volt3c.appspot.com",
  messagingSenderId: "549874893675",
  appId: "1:549874893675:web:3b0cd697de12ea34f5822e",
  measurementId: "G-05QZ2SVY4W"
};
@NgModule({
  declarations: [...appDeclarations],
  imports: [...appImportModules,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule,
    BrowserModule,
    BrowserAnimationsModule], // auth
  providers: [...appProviders],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [...appBootstrap]
})
export class AppModule { }
