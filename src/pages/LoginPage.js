import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import { Link, useNavigate, navigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./LoginPage.css";
import Paper from '@mui/material/Paper';

const port = "http://54.90.186.160:3001";
class LoginPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            password: "password",
            usernameContent: "",
            passwordContent: "",
        };
    }

    async submit() {
        let user = this.state.usernameContent;
        let pass = this.state.passwordContent;
        console.log("attempting to login");
        const response = await fetch(`${port}/api/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user,
                pass
            }),
        });

        const data = await response.json();

        if (data.user) {
            console.log("logged in successfully");
            this.props.navigation("homepage", {state:{
                token: data.user,
            }});
        } else {
            console.log("failed to log in");
        }
    }
    

    render() {

        /**Function to handle password visibility button */
        const handlePasswordVisibility = () => {
            if (this.state.password === "password") {
                this.setState({password: "text"});
            } else {
                this.setState({password: "password"});
            }
        }


    return(
        <motion.div style = {{width: "100%", height: "100%", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center", alignItems: "center"}}
            initial = {{opacity: 0}}
            animate = {{opacity: 1}}
            exit = {{opacity: 0}}
        >
            {/**Title screen and blank space */}
            <div style = {{minWidth: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center"}} class = "anim_gradient">
            <div style = {{width: "100%", height: "80px"}}></div>
            <div style = {{width: "40%", height: "70%", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center", borderRadius: "40px",  backgroundColor: "white"}}>
                <Paper elevation = {10} sx = {{width: "100%", height: "100%", justifyContent: "center", flexDirection: "column", display: "flex", justifyItems: "center", borderRadius: "40px"}}>
                <div style = {{width:"100%", height:"50px"}}></div>
                <div style = {{width: "100%", height: "50px", textAlign: "center", fontSize: "45px", fontFamily: "Roboto", color: "rgba(113, 176, 255, 0.8)"}}>
                    MyFitnessCompanion
                </div>
                <div style = {{width: "100%", height: "50px"}}></div>
                <div style = {{width:"100%", height:"50px", textAlign: "center", fontSize: "30px", fontFamily: "Roboto"}}>
                    Let's get Jacked Together!
                </div>
                {/**Username textfield */}
                <TextField label = "Enter Email" id="outlined-basic" variant="outlined" style = {{margin:"auto", width: "600px"}} value = {this.state.usernameContent}
                    onChange = {(e) => {
                        this.setState({usernameContent: e.target.value})
                    }}/>
                <div style = {{width: "100%", height: "20px"}}></div>
                {/**Password textfield */}
                <TextField label = "Enter Password" id="outlined-basic" variant="outlined" style = {{margin:"auto", width: "600px"}} 
                    InputProps = {{
                        endAdornment: (
                        <InputAdornment position = "start" onClick = {handlePasswordVisibility}>
                            <KeyIcon/>
                        </InputAdornment>),
                    }}
                type = {this.state.password} value = {this.state.passwordContent} onChange = {(e) => {
                    this.setState({passwordContent: e.target.value})
                }}></TextField>
                {/**Button for Sign up and Log in */}
                <div style = {{width: "100%", height: "20px"}}></div>
                <div style = {{width: "100%", height: "40px", display:"flex", justifyContent: "center", flexDirection: "row"}}>
                    <Button variant="contained" sx = {{width: "100px", backgroundColor: "rgba(113, 176, 255, 0.8)"}} onClick = {() => {
                        this.submit();
                    }}>Log in</Button>
                    <div style = {{width: "20px", height: "100%"}}></div>
                    <Link to = "signup" style = {{display: "flex", alignItems: "center", justifyContent: "center"}}>Sign up</Link>
                </div>
                <div style = {{width:"100%", height:"20px"}}></div>
                <div style = {{width: "100%", height: "100px", textAlign: "center"}}>
                    If you want to test the website, a test user account has been made already!
                    <br></br>
                    <b>Username: test@gmail.com</b>
                    <br></br>
                    <b>Password: test</b>
                    <br></br>
                    Enjoy trying out MyFitnessCompanion!
                </div> 
                <div style = {{width: "100%", height: "20px"}}></div>
                </Paper>          
            </div>
            </div>
        </motion.div>
    );}
}

export function LoginWithRouter(props) {
    const navigation = useNavigate();
    return (<LoginPage navigation = {navigation}/>);
}

export default LoginPage