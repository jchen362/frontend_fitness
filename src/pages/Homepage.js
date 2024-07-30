import React from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import Navbar from "./components/navbar";
import { motion } from "framer-motion";
import { Line, Doughnut } from 'react-chartjs-2';
import {userData, userDataSec} from "./components/data";
import {Chart as ChartJS} from "chart.js/auto";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import 'chartjs-adapter-date-fns';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import exerciseImg from "./imgs/girl-doing-yoga.svg";
import "./Homepage.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import {
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';

const port = "https://54.175.45.127:3001";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.location.state.token,
            weightData: {
                labels: userDataSec.map(row => row.x),
                datasets: [{
                    labels: "Weight Data",
                    data: userDataSec.map(row => row.y)
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Weight Tracking Chart"
                    }
                },
                scales: {
                    x: {
                        type: "time",
                    }
                },
            },
            optionsNutrition: {
                responsive: true,
                aspectRatio: 1,
            },
            nutritionData:{
                labels: ["protein", "fat"],
                datasets: [{
                    label: "Nutrition",
                    data: [100, 200],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ]
                }],
                hoverOffset: 4,
            },
            addWeight: 0,
            name: "PlaceHolder",
            exerciseInfo: {name: "dumbell curl", instructions: "curl the weight", difficulty: "beginner", muscle: "biceps", equipment: "barbell", type: "strength"},
            foodName: "",
            foodCalories: "",
            foodProtein: "",
            foodFat: "",
            nutritionList: [],
            sumCalories: 0,
            sumProtein: 0,
            sumFats: 0,
            
        };

    }

    async verifySession(p) {
        if (p === undefined) {
            console.log("props is undefined");
            return;
        }
        let token = p.location.state.token;
        const response = await fetch(`${port}/api/verify`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        });

        const data = await response.json();
        if (data.user === false) { //session expired
            console.log("session expired");
            p.navigation("/");
        }
        
    }

    async uploadData(p) {
        let token = p.location.state.token;
        let weight = this.state.addWeight;
        const response = await fetch(`${port}/api/upload`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                weight,
            }),
        });

        const data = await response.json();
        if (data.user === false) { //didn't upload
            console.log("weight failed to upload");
        } else {
            console.log("weight uploaded successfully");
            this.downloadData(p);
        }
    }


    async downloadData(p) {
        let token = p.location.state.token;
        const response = await fetch(`${port}/api/download`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        });

        const data = await response.json();
        let dataset = []
        if (data.data === false) {
            console.log("failed to get data");
            return
        }
        const parsed = data.data[0];
        for (let i = 0; i < parsed.times.length; i++) {
            dataset.push({x: parsed.epochs[i], y: parseInt(parsed.weight[i])})
        }
        this.setState({weightData: {
            datasets: [
                {
                    label: "Weight Chart",
                    data: dataset,
                }
            ]
        }});
    }

    async downloadExercises(p) {
        //https://api-ninjas.com/profile
        const response = await fetch('https://api.api-ninjas.com/v1/exercises?muscle=', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': 'gXjBVRIQhqEqD6hjUFUj+A==8Pe2On2DBqTw5Jep',
            },
        });

        const exerciseData = await response.json();
        const num = Math.floor(Math.random() * 10);
        const exercise = exerciseData[num];
        this.setState({exerciseInfo: exercise});
    }

    async getName(p) {
        let token = p.location.state.token;
        const response = await fetch(`${port}/api/getName`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        });

        const data = await response.json();
        if (data.name != false) {
            this.setState({name: data.name});
        }
    }

    async submitFood(p) {
        let token = p.location.state.token;
        let name = this.state.foodName;
        let calories = this.state.foodCalories;
        let protein = this.state.foodProtein;
        let fat = this.state.foodFat;
        const response = await fetch(`${port}/api/submitFood`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                name,
                calories,
                protein,
                fat,
            }),
        });
        const data = await response.json();

        if (data.user == false) {
            console.log("failed to upload nutrition data");
        } else {
            console.log("uploaded data successfully");
            await this.downloadNutrition(p);
        }
    }

    async downloadNutrition(p) {
        let token = p.location.state.token;
        const response = await fetch(`${port}/api/downloadNutrition`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        });

        const data = await response.json();
        if (data.user == false) {
            console.log("downloaded nutrition data");
            return;
        }
        //Add nutrition data
        const nutrition = data.data[0].food;
        let sumCalories = 0;
        let sumProtein = 0;
        let sumFats = 0;
        for (let i = 0; i < nutrition.length; i++) {
            sumCalories = sumCalories + nutrition[i].calories;
            sumProtein = sumProtein + nutrition[i].protein;
            sumFats = sumFats + nutrition[i].fat;
        }
        this.setState({nutritionList: nutrition, sumCalories: sumCalories, sumProtein: sumProtein, sumFats: sumFats});
        return;
    }

    analyzeWeightTrend() {
        let weightArray = this.state.weightData.datasets[0].data;
        let beginWeight = weightArray[0].y;
        let endWeight = weightArray[weightArray.length - 1].y;
        let difference = Math.abs(endWeight - beginWeight);
        if (beginWeight == endWeight) {
            return <text style = {{paddingTop: "10px"}}>You have remained the same weight since the beginning of your fitness goal!</text>
        }
        else if (beginWeight < endWeight) {
            return <text style = {{paddingTop: "5px"}}>
                {"You have gained " + difference + " pounds since the beginning of your fitness goal!"}
                <ArrowUpwardIcon color = "success"/>
                </text>
        }
        else {
            return <text style = {{paddingTop: "5px"}}>
                {"You have lost " + difference + " pounds since the beginning of your fitness goal!"}
                <ArrowDownwardIcon color = "error"></ArrowDownwardIcon>
                </text>
        }

    }

    async componentDidMount() {
        await this.downloadData(this.props);
        await this.getName(this.props);
        await this.downloadExercises(this.props);
        await this.downloadNutrition(this.props);
        //this.interval = setInterval(this.verifySession, 60000, this.props);
    }

    componentWillUnmount() {
        //TODO: call server to end session
        //clearInterval(this.interval);
    }
    render() {

        return(
            <motion.div style = {{width: "100%", height: "100vh", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center"}}
                initial = {{opacity: 0}}
                animate = {{opacity: 1}}
                exit = {{opacity: 0}}
                >
                {/**Navigation Bar at the Top */}
                <Navbar location = {this.props.location} navigation = {this.props.navigation}/>
                {/**Container for rest of things */}
                <div style = {{width: "100%", height: "740px", flexDirection: "row", display: "flex"}}>
                    {/**Left Side */}
                    <div style = {{width: "45%", height: "100%", flexDirection: "column", display: "flex", justifyItems: "center"}}>
                        <div style = {{width: "100%", height: "15px"}}></div>
                        <Paper elevation = {5} sx = {{borderRadius: "20px"}}>
                            <div style = {{wdith: "100%", height: "40%"}}>
                                <div style = {{width: "100%", height: "300px", display: "flex", justifyContent: "center"}}>
                                    <Line data = {this.state.weightData} options = {this.state.options}></Line>
                                </div>
                                <div style = {{width: "100%", height: "40px", display: "flex", flexDirection: "row", marginTop: "10px", marginLeft: "10px"}}>
                                    <TextField variant = "outlined" label = "Enter Weight" size = "small" sx = {{width: "120px", height: "15px"}} value = {this.state.addWeight} onChange = {(e)=> {
                                        this.setState({addWeight: e.target.value})
                                    }}/>
                                    <IconButton onClick = {() => {
                                        this.uploadData(this.props);
                                    }}>
                                        <AddCircleIcon/>
                                    </IconButton>
                                    {this.analyzeWeightTrend()}
                                </div>
                                <div style = {{width: "100%", height: "10px"}}></div>
                            </div>
                        </Paper>
                        <div style = {{width: "100%", height: "10px"}}></div>
                        <Paper elevation = {5} sx = {{borderRadius: "20px"}}>
                            <div style = {{width: "100%", height: "343px", display: "flex", flexDirection: "row"}}>
                                <div style = {{width: "50%", height: "100%", borderRadius: "20px", flexDirection: "column", display: "flex", alignItems: "center"}}>
                                    <b style = {{width: "100%", textAlign: "center"}}>Nutrition Summary</b>
                                    <div style = {{width: "60%", height: "70%", display: "flex", alignItems: "center"}}>
                                        <Doughnut data = {this.state.nutritionData}></Doughnut>
                                    </div>
                                    <text style = {{width: "100%", textAlign: "center"}}>{"Calories: " + this.state.sumCalories}</text>
                                    <text style = {{width: "100%", textAlign: "center"}}>{"Protein: " + this.state.sumProtein + " g"}</text>
                                    <text style = {{width: "100%", textAlign: "center"}}>{"Fat: " + this.state.sumFats + " g"}</text>
                                </div>
                                <div style = {{width: "50%", height: "100%", borderRadius: "20px", display: "flex", flexDirection: "column"}}>
                                    <b style = {{width: "100%", textAlign: "center", paddingLeft: "15px"}}>Track Your Food Here</b>
                                    <div style = {{width: "100%", height: "5px"}}></div>
                                    <div style = {{width: "100%", height: "45px", display: "flex", flexDirection: "row", gap: "5px", justifyContent: "center"}}>
                                        <TextField variant = "outlined" label = "Food" size = "small" sx = {{width: "90px", height: "10px", fontSize: "7px", paddingBottom: "5px"}} value = {this.state.foodName} onChange = {(e) => {
                                            this.setState({foodName: e.target.value})
                                        }}></TextField>
                                        <TextField variant = "outlined" label = "Calories" size = "small" sx = {{width: "90px", height: "10px", fontSize: "7px", paddingBottom: "5px"}} value = {this.state.foodCalories} onChange = {(e) => {
                                            this.setState({foodCalories: e.target.value})
                                        }}></TextField>
                                        <TextField variant = "outlined" label = "Protein" size = "small" sx = {{width: "90px", height: "10px", fontSize: "7px", paddingBottom: "5px"}} value = {this.state.foodProtein} onChange = {(e) => {
                                            this.setState({foodProtein: e.target.value})
                                        }}></TextField>
                                        <TextField variant = "outlined" label = "Fats" size = "small" sx = {{width: "90px", height: "10px", fontSize: "7px", paddingBottom: "5px"}} value = {this.state.foodFat} onChange = {(e) => {
                                            this.setState({foodFat: e.target.value})
                                        }}></TextField>
                                        <IconButton onClick = {() => {
                                            this.submitFood(this.props);
                                        }}>
                                            <AddCircleIcon/>
                                        </IconButton>
                                    </div>
                                    <div style = {{width: "95%", height: "240px", display: "flex", flexDirection: "column", alignItems: "center"}} id = "hideScroll">
                                        <TableContainer component = {Paper}>
                                            <Table sx= {{minWidth: 200}} size = "small" aria-label = "a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Food</TableCell>
                                                        <TableCell align = "right">Calories</TableCell>
                                                        <TableCell align = "right">Protein</TableCell>
                                                        <TableCell align = "right">Fat</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.nutritionList.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                        {row.name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.calories}</TableCell>
                                                        <TableCell align="right">{row.protein}</TableCell>
                                                        <TableCell align="right">{row.fat}</TableCell>
                                                    </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </div>
                    <div style = {{width: "0.5%", height: "100%"}}></div>
                    {/**Right side */}
                    <div style = {{width: "54.5%", height: "95%"}}>
                        <div style = {{width: "100%", height: "15px"}}></div>
                        <Paper elevation = {5} sx = {{borderRadius: "20px"}}>
                            <div style = {{width: "100%", height: "40%", display: "flex", flexDirection: "column", backgroundImage: `url(${exerciseImg})`, backgroundRepeat: "no-repeat", backgroundPosition: "right 20px bottom 30px"}}>
                                <p style = {{fontWeight: "bold", paddingLeft: "10px", fontSize: "30px"}}>
                                    {"Welcome, " + this.state.name}
                                </p>
                                <p style = {{paddingLeft: "10px", fontSize: "18px"}}>
                                    Remember to track all your workouts, weight, and nutrition to see your daily progress towards your fitness goals!
                                </p>
                            </div>
                        </Paper>
                        <div style = {{width: "100%", height: "15px"}}></div>
                        <Paper elevation = {5} sx = {{borderRadius: "20px"}}>
                            <div style = {{width: "100%", height: "540px", display: "flex", flexDirection: "column", overflowY: "scroll", overflow: "hidden"}}>
                                <p style = {{fontWeight: "bold", paddingLeft: "10px", fontSize: "30px"}}>
                                    Workout of the Day
                                </p>
                                <p style = {{paddingLeft: "10px", fontSize: "15px"}}>
                                    {"Name: " + this.state.exerciseInfo.name}
                                    <br></br>
                                    {"Difficulty: " + this.state.exerciseInfo.difficulty}
                                    <br></br>
                                    {"Muscle Targetted: " + this.state.exerciseInfo.muscle}
                                    <br></br>
                                    {"Equipment: " + this.state.exerciseInfo.equipment}
                                    <br></br>
                                </p>
                                <p style = {{paddingLeft: "10px", fontSize: "15px"}}>
                                    {"Instructions: " + this.state.exerciseInfo.instructions}
                                </p>
                            </div>
                        </Paper>
                    </div>
                </div>
            </motion.div>
        );
    }
}

export function HomePageWithRouter() {
    const location = useLocation();
    const navigation = useNavigate();
    return(<Homepage location = {location} navigation = {navigation}/>);
}

export default Homepage