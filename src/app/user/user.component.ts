import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserRegisterModel} from '../model/UserRegisterModel';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpClient } from '@angular/common/http';
import { userservice } from '../service/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'user-root',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  title = 'carbookingsystem';
  registerForm: FormGroup;
  submitted = false;
  reCAPTCHAToken: string = "";
  tokenVisible: boolean = false;
  
  
  
  // recaptchaV3Service: any;
  private siteKey ='6LeFrxcnAAAAADMJPixdURmMCKwR2B_uZmy1EKrL'
  formData: any;
   body: any;
   
  
  constructor(private formBuilder: FormBuilder, private recaptchaV3Service: userservice, private http: HttpClient) {}
  ngOnInit() {
    
      this.registerForm = this.formBuilder.group({
        UserName: [null, Validators.required],
        UserEmailId: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required]
      });
      this.recaptchaV3Service.init(this.siteKey);
  }

  isFieldInvalid(field: string) {
    return !this.registerForm.get(field).valid && this.registerForm.get(field).touched;
  }

  isFieldValid(field: string) {
    return this.registerForm.get(field).valid && this.registerForm.get(field).touched;
  }

  onSubmit() {

    this.validateAllFormFields(this.registerForm);
    if (this.registerForm.valid) {
      this.recaptchaV3Service.getToken().then(token => {
        this.formData = this.registerForm.value;
        this.formData.recaptchaToken = token;

         this.body = {
          token: token,
          formData: this.formData
        };
        // Handle saving form data
        // this.myHttpService.login(this.formData).subscribe(response => {
        //
        // });
        
        console.log(this.body)
        this.http.post('http://localhost:3000/api/register', this.body,{ responseType: 'text' }).subscribe(
        
        (response: any) => {
            // Handle the response here
            console.log(response);
            this.destroyRecaptcha();
          },
          error => {
            // Handle any errors here test
            console.log(this.body);
            console.error(error);
          }
        );


      }, error => {
		  console.log('err ',error)
	  });
  }
}
destroyRecaptcha() {
  this.recaptchaV3Service.destroy();
}

validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}
    

      // this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      //   const formData = this.registerForm.value;
      //   this.tokenVisible = true;
      //   this.reCAPTCHAToken = `Token [${token}] generated`;
      //   // this.http.post(formData);
          
      // }
      
      // );
  
    }
    


