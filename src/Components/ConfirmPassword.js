import React from 'react';
import {NavLink} from 'react-router-dom';
import ErrorBoundary from '../Data/ErrorBoundary.js';
import PasswordEncrypt from '../Data/PasswordEncrypt.js';
import FormValidate from '../Data/FormValidate.js';
import * as firebase from 'firebase';

class ConfirmPassword extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={
			username:"", password:"", confirmPassword:"", usernameValid:"", passwordValid:"", confirmPasswordValid:""
			}
		this.passwordEncrypt = new PasswordEncrypt();
		this.formValidate = new FormValidate();
		this.handleUsername = this.handleUsername.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUsername(event)
	{
		this.setState({username:event.target.value})
	}

	handlePassword(event)
	{
		this.setState({password:event.target.value})
	}

	handleConfirm(event)
	{
		this.setState({confirmPassword:event.target.value})
	}

	checkFields()
	{
		this.formValidate.initializeError();
		this.setState({
			usernameValid:this.formValidate.textError("username",this.state.username),
			passwordValid:this.formValidate.password(this.state.password),
			confirmPasswordValid:this.formValidate.password(this.state.password)
							})
		if(this.state.password!==this.state.confirmPassword)
		{
			this.setState({	confirmPasswordValid:"Password and Confirm Password need to be same"})
		}
	}

	validateUsername()
	{
		firebase.database().ref().child('login').orderByChild("username").equalTo(this.state.username).on("value",(snapshot)=>
		{
				if(snapshot.val()===null)
				{
					this.setState({usernameValid:"Username does not exist"})				
				}
		})
	}


	resetPassword()
	{
		this.validateUsername();
		if(this.state.usernameValid==="Username does not exist")
		{
			var user={
				username:this.state.username,
				password:this.passwordEncrypt.encrypt(this.state.password,this.state.username)
			}
			try
			{
				firebase.database().ref('login/'+this.state.username).set(user);
			}
			catch(e)
			{
				alert("Could not reset password. Please check your internet connection");
			}
		}
	}

	handleSubmit(event)
	{
		event.preventDefault();
		this.checkFields();
		var error = this.formValidate.getError();
		if(error.length===0)
		{
			this.resetPassword();
		}
	}

	render()
	{
		return(
			<div className="register">
			<img className="logoText" src="images/icons/logo.png" alt="logo" />
			<div className="card">
				<div className="card-body">
				<ErrorBoundary>
					<form onSubmit={this.handleSubmit}>
						<h4 className="headingRegister"> Forgot Password </h4>
						<div className="flexDiv">
							<div className="labelRegister">
								<label> Username : </label>
							</div>
							<div className="form-element-register">
								<input className="form-control" type="text" name="username" value={this.state.username} placeholder = "Enter username" onChange={this.handleUsername} />
							</div>				
						</div>
						<div className="errorRegister"> {this.state.usernameValid} </div>
						<div className="flexDiv">
							<div className="labelRegister">
								<label> New Password : </label>
							</div>
							<div className="form-element-register">
								<input className="form-control" type="password" name="password" value={this.state.password} placeholder = "Enter password" onChange={this.handlePassword} />
							</div>							
						</div>
						<div className="errorRegister">{this.state.passwordValid} </div>
						<div className="flexDiv">
							<div className="labelRegister">
								<label> Confirm New Password : </label>
							</div>
							<div className="form-element-register">
								<input className="form-control" type="password" name="confirmPassword" value={this.state.confirmPassword} placeholder = "Confirm password" onChange={this.handleConfirm} />
							</div>							
						</div>
						<div className="errorRegister">{this.state.confirmPasswordValid} </div>
						<div className="flexDiv">
							<button className="btn btn-primary submitRegister" type="submit"> Reset Password </button>
							<NavLink to="/Login"><button className="btn btn-primary"
							type="submit"> Login </button></NavLink>
						</div>
					</form>
					</ErrorBoundary>
				</div>
			</div>
			</div>

			)
	}
}

export default ConfirmPassword;