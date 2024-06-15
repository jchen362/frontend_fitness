import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider, styled} from '@mui/material/styles';
import { Link, useNavigate, navigate, useLocation } from "react-router-dom";
import "./navbar.css";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';


function Navbar(props) {

    const theme = createTheme({
        typography: {
            fontFamily: "Roboto",
            fontSize: 20,
            color: "red",
        }
    });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        textAlign: "center",
      };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx = {{ flexGrow: 1}}>
            <AppBar position = "static" class = "anim_gradient">
                <Toolbar>
                        <Button variant="text" sx = {{fontSize: 25, color: "white"}} onClick = {() => {
                            props.navigation("/homepage", {state: {
                                token: props.location.state.token,
                            }});
                        }}>
                            MyFitnessCompanion
                        </Button>
                        <div style = {{flexGrow: "1"}}></div>
                        <Button variant="text" sx = {{fontSize: 15, color: "white"}} onClick = {handleOpen}>
                            About
                        </Button>
                        <Modal open = {open} onClose = {handleClose}>
                            <Box sx = {style}>
                                <b>About MyFitnessCompanion</b>
                                <br></br>
                                <text>
                                    This project was made because the creator, me, has recently got into fitness. Since I
                                    use MyFitnessPal quite often, I thought that maybe I should try to replicate it! This 
                                    project is made with React, Express, Mongoose, MongoDB, and Love :).
                                </text>
                            </Box>
                        </Modal>
                        <Button variant="text" sx = {{fontSize: 15, color: "white"}} onClick = {() => {
                            props.navigation("/", {state: {
                                token: props.location.state.token,
                            }});
                        }}>
                            Sign Out
                        </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar