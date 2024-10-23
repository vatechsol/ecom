import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');


const handleSubmit = (e) => {
    e.preventDefault();
    if (email.toLowerCase() == "vikash@gmail.com" && password == "Vikash@1234") {
        navigate('/dashboard'); 
    } else {
        console.log("login fail")
    }
};

const handleEmailChange = (e) => {
    setEmail(e.target.value)
}

const handlePasswordChange = (e) => {
    setPassword(e.target.value)
}
    
    return (
        <div className="wrapper signIn">
            <div className="illustration">
            </div>
            <div className="form">
                <div className="heading">VENDOR LOGIN</div>
                <form onSubmit={handleSubmit} method='get'>
                    <div>
                        <label htmlFor="name">Email</label>
                        <input type="text" id="email" name="email" value={email} placeholder="Enter your email" onChange={handleEmailChange} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} placeholder="Enter your password" onChange={handlePasswordChange} />
                    </div>
                    <button type="submit">
                        Submit
                    </button>
                </form>
                <p>
                    Don't have an account ? <Link to="/signup"> Sign Up </Link>
                </p>
            </div>
        </div>
    );
}
