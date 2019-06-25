import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AuthService} from "./services/auth.service";
import { TiendaService } from './services/tienda.service';
import { CarritoService } from './services/carrito.service'
import { AppComponent } from './app.component';
import { TiendaRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { BarraSuperiorComponent } from './components/barra-superior/barra-superior.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DetalleProductoComponent } from './components/tienda/detalle-producto/detalle-producto.component';


export const firebaseConfig = {
    apiKey: "AIzaSyDXJxIUVtx6HzOOOHO4s1ZS7-FEiqg9hcs",
    authDomain: "surtymax-32aa5.firebaseapp.com",
    databaseURL: "https://surtymax-32aa5.firebaseio.com",
    projectId: "surtymax-32aa5",
    storageBucket: "surtymax-32aa5.appspot.com",
    messagingSenderId: "608988681663"

};

@NgModule({
  declarations: [
    AppComponent,
    BarraSuperiorComponent,
    LoginComponent,
    TiendaComponent,
    CarritoComponent,
    DetalleProductoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ReactiveFormsModule,
    TiendaRoutingModule
  ],
  providers: [AuthService, TiendaService, CarritoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
