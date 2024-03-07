import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import checkGuest from "./checkGuest";

function Login() {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    var navigate = useNavigate();
    const dispatch = useDispatch();
    function attemptLogin() {
        axios.post('http://localhost:8080/auth/login',{
            email:email,
            password:password
        }).then(response=>{
            setErrorMessage('')
            var user = {
                email:email,
                token:response.data.token
            }
            dispatch(setUser(user));  
            navigate('/');
        }).catch(error=>{
            console.log(error.response.data.errors);
            // if(error.response.data.errors){
            //     setErrorMessage(Object.values(error.response.data.errors).join(' '))
            // }else if(error.response.data.message){
            //     setErrorMessage(error.response.data.message)
            // }else{
            //     setErrorMessage('Failed to login user. Please contact admin')
            // }
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
            // console.log(error)
        })
    }
    return (<div>
        <Navbar/>
        <div className="container">
            <div className="row">
                <div className="col-8 offset-2">
                    <h1>Login</h1>
                    {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
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
                        <button className="btn btn-primary float-right" onClick={attemptLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default checkGuest(Login);