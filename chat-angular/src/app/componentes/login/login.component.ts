import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { LoginObject } from "./shared/login-object.model";
import { RegisterObject } from "./shared/register-object.model";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../servicios/authentication/authentication.service";
import { StorageService } from "../../servicios/storage/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public submitted: Boolean = false;
  public submittedReg: Boolean = false;
  public crear: Boolean = false;
  public error: {code: number, message: string} = null;
  public imagen = false;

  constructor(private formBuilder: FormBuilder,
              private formBuilderR: FormBuilder,
              private authenticationService: AuthenticationService,
              private storageService: StorageService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
    this.registerForm = this.formBuilderR.group({
      username: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      foto: ['']
    })
  }

  public submitLogin(): void {
    // console.log("EEEY");
    this.submitted = true;
    this.error = null;
    if(this.loginForm.valid){
      this.authenticationService.login(new LoginObject(this.loginForm.value)).subscribe(
        data =>{ 
          this.correctLogin(data)
        },
        error => {
          console.log(error.error[0]);
          if(error.error[0].field == "email")
            this.error = { code: 1, message: "No existe usuario con ese mail"};
          if(error.error[0].field == "password")
            this.error = { code: 2, message: "Contraseña invalida"};
        }
      )
    }
  }
  
  public submitRegister(): void {
    this.submittedReg = true;
    this.error = null;
    this.registerForm.value.foto = this.imagen;
    if(this.registerForm.valid){
      this.authenticationService.register(new RegisterObject(this.registerForm.value)).subscribe(
        data => {
          this.correctLogin(data)
          // this.error = {code : 2, message : data.data };
          console.log("ESTO ES LA DATAAAA!!!!: ",data);
        },
        error => {
          this.error = error.error;
          // console.log("Error register: ",this.error);
        }
      )
    }
  }
  
  private correctLogin(data: Session){
    this.storageService.setCurrentSession(data);
    
    localStorage.setItem("token",data.token);
    this.router.navigate(['/home']);
  }

  selectImage(input){
    // console.log(input);
    
    let dataArray = new FormData();
      dataArray.append('file', input.files[0]);
      var reader = new FileReader();
      var funn= function(e) {
        this.imagen = e.target.result;
      }
      reader.onload = funn.bind(this);
      reader.readAsDataURL(input.files[0]);
  }

}