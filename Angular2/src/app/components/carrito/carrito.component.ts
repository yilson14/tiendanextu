import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { AuthService } from "../../services/auth.service";
import { CarritoService } from '../../services/carrito.service';
import { TiendaService } from '../../services/tienda.service';
import { Producto } from '../../models/Producto';
import { ProductoCarrito } from '../../models/ProductoCarrito';


@Component({
  selector: 'carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  public listaCarrito : ProductoCarrito[] = [];
  public catalogo : Producto[] = [];
  public titulo: string;

  constructor(private carritoService : CarritoService,
              private detectChanges:ChangeDetectorRef,
              private tiendaService : TiendaService,
              private auth : AuthService,
              private http : Http, private router : Router
            ) {
    this.titulo = 'Carrito de compras';
   }

  ngOnInit() {
    if (!this.auth.checkSession()){
      console.log(sessionStorage.getItem("Session"))
      this.router.navigate(['/login'])
    }else{
      this.listaCarrito = this.carritoService.itemsCarrito();
    }
  }

  //Calcular total
    total(){
      let total :number = 0
      let items = this.carritoService.listaCarrito;
      for(let subtotal of items ){
       total += subtotal.cantidad * subtotal.precio;
      }
      return total;
    }
  //Pagar
  pagarCarrito(){
    this.http.get('https://surtymax-32aa5.firebaseio.com/productos/.json')
    .map((response : Response) => {
        this.catalogo =  response.json()
      }
    ).subscribe(
      ()=>{
        for (let itemCatalogo of this.catalogo){
          for (let item of this.listaCarrito){
            if ( itemCatalogo.id == item.id ){
              let cantidad = Number(item.cantidad);
              itemCatalogo.disponible = itemCatalogo.disponible - cantidad
              this.actualizarDisponible(item.id, itemCatalogo).subscribe(
                (response) => {
                  this.vaciarCarrito()
                }
              )
            }
          }
        }
        this.router.navigate(['/tienda'])
      }
    )
  }
  actualizarDisponible(id:number, itemCatalogo:Producto){
    return this.http.put(`https://surtymax-32aa5.firebaseio.com/productos/${id}.json`, itemCatalogo)
    .map((response : Response) => {
        return this.catalogo =  response.json()
      }
    )
  }
  //Vaciar carrito
    vaciarCarrito(){
    sessionStorage.setItem('Carrito', '[]')
    this.listaCarrito = [];
    this.carritoService.eliminarCarrito(this.listaCarrito);
    this.carritoService.listaCarrito = [];
    this.tiendaService.getProductos().subscribe()
    }

    eliminarProducto(id:number, value:number){

      for(let item of this.listaCarrito){
        if(item.id == id){
          let index = this.listaCarrito.indexOf(item);
          if(value == null){
            this.listaCarrito.splice(index, 1);
            this.carritoService.eliminarCarrito(this.listaCarrito);
            this.total();
            this.tiendaService.actualizarDisponible(id, Number(item.cantidad), true);
          }else{
            if(value > 0){

              let validar = (Number(item.cantidad) - value);
              if(validar < 0){
                window.alert('La cantidad excede la cantidad del carrito.');
              }else{
                item.cantidad = validar;
                if (item.cantidad == 0) {

                  this.listaCarrito.splice(index, 1);
                }

                this.carritoService.eliminarCarrito(this.listaCarrito);
                this.tiendaService.actualizarDisponible(id, Number(value), true);
              }
            }else{
            window.alert('La cantidad no es correcta, especifique una válida');
            }
          }
        }
      }this.detectChanges.detectChanges();
    }

}
