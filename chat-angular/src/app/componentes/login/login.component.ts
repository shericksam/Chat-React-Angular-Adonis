import { Component, OnInit } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { LoginObject } from "./shared/login-object.model";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../servicios/authentication/authentication.service";
import { StorageService } from "../../servicios/storage/storage.service";
import {MatCardModule} from '@angular/material/card';

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

  constructor(private formBuilder: FormBuilder,
              private formBuilderR: FormBuilder,
              private authenticationService: AuthenticationService,
              private storageService: StorageService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
    this.registerForm = this.formBuilderR.group({
      username: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  public submitLogin(): void {
    this.submitted = true;
    this.error = null;
    if(this.loginForm.valid){
      this.authenticationService.login(new LoginObject(this.loginForm.value)).subscribe(
        data => this.correctLogin(data),
        error => this.error = JSON.parse(error._body)
      )
    }
  }
  
  private correctLogin(data: Session){
    this.storageService.setCurrentSession(data);
    this.router.navigate(['/home']);
  }

  public data;
  selectImage(){
    var input = document.createElement('input');
    input.type = 'file';
    var dataa;
    input.addEventListener("change", function(){
      let dataArray = new FormData();
      dataArray.append('file', input.files[0]);
      // console.log("in fun", dataArray);
      // console.log("in fun", input.files[0]);
      var reader = new FileReader();

      reader.onload = function(e) {
        // $('#blah').attr('src', );
        
        console.log(e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
      dataa = reader.result;
      console.log("reader", reader.result);
    });
    this.data = dataa;
    input.click();
  }

}