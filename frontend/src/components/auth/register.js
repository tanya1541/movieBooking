import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";

function Register() {
    var [name, setName] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [passwordConf, setPasswordConf] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    var navigate = useNavigate();
    function registerUser(){
        var user = {
            name: name,
            email: email,
            password: password,
            passwordConf: passwordConf
        }
        axios.post('http://localhost:8080/auth/register',user).then(response=>{
            setErrorMessage('');
            navigate('/login');
        }).catch(error=>{
            if (error.response && error.response.data) {
                if (error.response.data) {
                setErrorMessage(Object.values(error.response.data).map((message, index)=> {
                   return <div key={index}>{message}</div>
                }))
                } else {
                  setErrorMessage('An error occurred during registration.');
                }
              } else {
                setErrorMessage('Failed to connect to the API');
              }
        })
    }
    return <div>
        <Navbar/>
        <div className="container">
            <div className="row">
                <div className="col-8 offset-2">
                    <h1>Register</h1>
                    {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text"
                        className="form-control"
                        value={name}
                        onInput={(event)=>setName(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text"
                        className="form-control"
                        value={email}
                        onInput={(event)=>setEmail(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password"
                        className="form-control"
                        value={password}
                        onInput={(event)=>setPassword(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password"
                        className="form-control"
                        value={passwordConf}
                        onInput={(event)=>setPasswordConf(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary float-right" onClick={registerUser}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Register;
