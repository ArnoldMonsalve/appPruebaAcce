import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyC14vloxX_aNRhUxOvGQrzo6GzAPXY0J94",
  authDomain: "apppruebaacce.firebaseapp.com",
  projectId: "apppruebaacce",
  storageBucket: "apppruebaacce.firebasestorage.app",
  messagingSenderId: "359331865365",
  appId: "1:359331865365:web:64bf6eaba5d0671878bf1c",
  measurementId: "G-NJM4M3Q25X"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideRemoteConfig(() => getRemoteConfig()),
  ],
});
