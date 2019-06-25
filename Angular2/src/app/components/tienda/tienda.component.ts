import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common'
import { OnChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { CarritoService} from '../../services/carrito.service';
import { TiendaService} from '../../services/tienda.service';
import { ProductoCarrito } from '../../models/ProductoCarrito';
import { Producto } from '../../models/Producto';

@Component({
  selector: 'tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css'],
})

export class TiendaComponent implements OnInit {

  private formulario : FormGroup;
  private listaProductos : Producto[];
  public productoCarrito : ProductoCarrito;
  private titulo : string;
  public session : string;

  constructor(private detectChanges:ChangeDetectorRef,
              private router : Router,
              private tiendaService : TiendaService,
              private auth : AuthService,
              private carritoService : CarritoService) { this.titulo = 'Catálogo de Productos'}


  ngOnInit() {
    if (!this.auth.checkSession()){
      this.router.navigate(['/login'])
    }else{
    this.session = sessionStorage.getItem("Carrito")
      this.formulario = new FormGroup(
        {
          'descripcion' : new FormControl(),
          'imagen': new FormControl(),
          'precio': new FormControl(),
          'cantidad': new FormControl(),
        }
      )
      this.mostrarProductos()
    }
  }

  mostrarProductos(){
    if(!this.tiendaService.productosCatalogo){
      this.tiendaService.getProductos().subscribe(
        ()=>{
          this.listaProductos = this.tiendaService.catalogo;
          this.checkCarrito();
        }
      )
    }else{
          this.listaProductos = this.tiendaService.productosCatalogo;
    }
  }

  agregarProducto(id:number, value:number){
    for (let item of this.tiendaService.productosCatalogo){
      if(item.id == id){
        if(item.disponible < value){
          window.alert('Máxima existencia es: '+ item.disponible);
        }else{
          let cantidadActual = item.disponible;
          this.productoCarrito = {
            "id": item.id,
            "descripcion": item.descripcion,
            "imagen": item.imagen,
            "precio": item.precio,
            "cantidad": value
          }
          this.carritoService.verificarCarrito(this.productoCarrito);
          item.disponible = cantidadActual - value;
        }
      }
    }
  }

    filtrarCatalogo(filtro:string){
      this.listaProductos = this.tiendaService.filtrarProducto(filtro);
    }

    checkCarrito(){
      for(let itemCarrito of this.carritoService.listaCarrito){
        this.tiendaService.actualizarDisponible(itemCarrito.id, itemCarrito.cantidad)
      }
    }

  obtenerCantidad(id:number){
    for(let item of this.carritoService.listaCarrito){
      if(item.id == id){
        return item.cantidad
      }
    }
    return null
  }

}
