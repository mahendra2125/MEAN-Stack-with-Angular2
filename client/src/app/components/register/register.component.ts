import { Component, OnInit, group } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm')});
  }

  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
    } else {
      return { 'validateEmail': true};
    }
  }

  validateUsername(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    } else {
      return { 'validateUsername': true};
    }
  }

  validatePassword(controls){
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if(regExp.test(controls.value)){
      return null;
    } else {
      return { 'validatePassword': true};
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if(group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true };
      }
    }
  }

  disabledForm() {
    this.registerForm.controls['email'].disable();
    this.registerForm.controls['username'].disable();
    this.registerForm.controls['password'].disable();
    this.registerForm.controls['confirm'].disable();
  }

  enabledForm() {
    this.registerForm.controls['email'].enable();
    this.registerForm.controls['username'].enable();
    this.registerForm.controls['password'].enable();
    this.registerForm.controls['confirm'].enable();
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disabledForm();
    const user = {
      email: this.registerForm.get('email').value,
      username: this.registerForm.get('username').value,
      password: this.registerForm.get('password').value
    }
    this.authService.registerUser(user).subscribe( data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enabledForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      }
    });
  }

  checkEmail() {
    this.authService.checkEmail(this.registerForm.get('email').value).subscribe(data => {
      if(!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername() {
    this.authService.checkUsername(this.registerForm.get('username').value).subscribe(data => {
      if(!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }

  ngOnInit() {
  }

}
