import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';



@Component({
  selector: 'barra-superior',
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.css'],
})
export class BarraSuperiorComponent implements OnInit {
  private url : string

  constructor(private auth : AuthService,
              private carritoService : CarritoService,
              private activatedRoute : ActivatedRoute
            ) { }

  ngOnInit() {
      this.url =  this.activatedRoute.snapshot.url[0].path;
      return this.url;
  }

  cerrarSesion(){
    this.auth.logout();
  }

}
