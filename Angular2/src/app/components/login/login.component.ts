import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  mensaje:string;
  loginForm : FormGroup;
  items: FirebaseListObservable<any[]>;
  email : string;
  password: string;


  constructor(private db: AngularFire, private auth : AuthService, private router: Router) {
    if(this.auth.checkSession()){
       this.router.navigate(['tienda'])
     }
  };

  ngOnInit() {
    this.email = "";
    this.password = "";
    if(this.auth.checkSession()){
      this.router.navigate( ['/tienda'])
    }
    this.loginForm = new FormGroup(
      {
        'email' : new FormControl('', Validators.required),
        'password': new FormControl('', Validators.required),
      }
    )
  }

  checkLogin(){
    if(this.loginForm.valid){

      this.email = this.loginForm.value.email.toLowerCase().replace(/[^a-zA-Z 0-9.]+/g,'').replace(/\./g,'');
      this.password = this.loginForm.value.password;
      console.log(this.email)


      let loginUser = `/usuarios/${this.email}`
      const user = this.db.database.object(loginUser);
      user.subscribe(data => {
        if(data.$exists()){
          console.log ('Email correcto: ' + data.email)
          if (data.password == this.password){
            this.mensaje = "Iniciando Sesión";
            sessionStorage.setItem("Session", this.loginForm.value.email);
            console.log(this.mensaje);
            this.router.navigate(['tienda']);
          }else{
            this.mensaje = 'Contraseña incorrecta';
            console.log(this.mensaje);
          }
        }else{
          this.mensaje = "El usuario " + this.loginForm.value.email + " no existe";
          console.log(this.mensaje)
        }
      });
    }
  }
}
