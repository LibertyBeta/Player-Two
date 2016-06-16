import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: 'imports/components/account/login.html',
  directives: [ROUTER_DIRECTIVES]
})
export class Login {
  public user:string = '';
  public password:string = '';
  constructor (private router: Router) {}

  submit () {
    Meteor.loginWithPassword(this.user, this.password, function(error, result){
			if(result){
				console.log('Login success');
			} else {
				console.log('Login error - ', error);
				this.router.navigate(['/home']);
			}
		});
  }
}


@Component({
  selector: 'register-page',
  templateUrl: 'imports/components/account/register.html',
  directives: [ROUTER_DIRECTIVES]
})
export class Register {
  public user:string = '';
  public password:string = '';

  constructor (private router: Router) {}

  submit () {
    let context = this;
    Accounts.createUser({
			username: this.user,
			// email:'example@gmail.com',
			password: this.password

		}, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log(result);
        context.router.navigate(['/home']);
      }
    });
  }
}
