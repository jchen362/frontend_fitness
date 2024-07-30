import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import KeyIcon from '@mui/icons-material/Key';
import Button from '@mui/material/Button';
import { useInRouterContext, useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";
import { motion } from "framer-motion";
import Paper from '@mui/material/Paper';

const port = "https://54.175.45.127:3001";

class SignUpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "password",
            usernameContent: "",
            passwordContent: "",
            nameContent: "",
        };
    }
    
    async submit() {
        let user = this.state.usernameContent;
        let pass = this.state.passwordContent;
        let name = this.state.nameContent;
        console.log("attempting to send sign up info");
        const response = await fetch(`${port}/api/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user,
                pass,
                name
            }),
        });

        const data = await response.json();
        console.log(data);
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
        <motion.div style = {{width: "100%", height: "100%", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center"}}
            initial = {{opacity: 0}}
            animate = {{opacity: 1}}
            exit = {{opacity: 0}}
        >
            <div style = {{minWidth: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center"}} class = "anim_gradient">
                <div style = {{width:"100%", height:"80px"}}></div>
                <div style = {{width: "40%", height: "70%", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center", borderRadius: "40px",  backgroundColor: "white"}}>
                <Paper elevation = {10} sx = {{width: "100%", height: "100%", justifyContent: "center", flexDirection: "column", display: "flex", justifyItems: "center", borderRadius: "40px"}}>
                    <div style = {{width:"100%", height:"50px"}}></div>
                    <div style = {{width: "100%", height: "50px", textAlign: "center", fontSize: "45px", fontFamily: "Roboto", color: "rgba(113, 176, 255, 0.8)"}}>
                        MyFitnessCompanion
                    </div>
                    <div style = {{width: "100%", height: "50px"}}></div>
                    <div style = {{width:"100%", height:"50px", textAlign: "center", fontSize: "30px", fontFamily: "Roboto"}}>
                        Create Your Account Below
                    </div>
                    <TextField label = "Enter Email" id="outlined-basic" variant="outlined" style = {{margin:"auto", width: "600px", maxWidth: "100%"}} value = {this.state.usernameContent} onChange = {(e) => {
                        this.setState({usernameContent: e.target.value})
                    }}/>
                    <div style = {{width: "100%", height: "20px"}}></div>
                    <TextField label = "Enter Name" id="outlined-basic" variant="outlined" style = {{margin:"auto", width: "600px", maxWidth: "100%"}} value = {this.state.nameContent} onChange = {(e) => {
                        this.setState({nameContent: e.target.value})
                        }}/>
                    <div style = {{width: "100%", height: "20px"}}></div>
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
                    <div style = {{width: "100%", height: "20px"}}></div>
                    <div style = {{width: "100%", height: "40px", display:"flex", justifyContent: "center", flexDirection: "row"}}>
                        <Button variant="contained" sx = {{width: "100px", backgroundColor: "rgba(113, 176, 255, 0.8)"}} onClick = {() => {
                            this.submit();
                        }}>Sign up</Button>
                        <div style = {{width: "20px", height: "100%"}}></div>
                        <Link to = "/" style = {{display: "flex", alignItems: "center", justifyContent: "center"}}>Back to Login</Link>
                    </div>
                    <div style = {{width:"100%", height:"20px"}}></div>
                    <div style = {{width: "100%", height: "100px", textAlign: "center"}}>
                        If you want to test the website, there is already a test account for you to use!
                        <br></br>
                        No new account needed!
                        <br></br>
                        <b>Username: test@gmail.com</b>
                        <br></br>
                        <b>Password: test</b>
                        <br></br>
                        Enjoy trying out MyFitnessCompanion!
                    </div> 
                    <div style = {{width: "100%", height: "40px"}}></div>
                </Paper>
                </div>
            </div>

        </motion.div>
    );}
}

export function SignUpWithRouter() {
    const navigate = useNavigate();
    return (<SignUpPage navigate = {navigate}/>);
}

export default SignUpPage