import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const WEATHER_API = "" // weatherapi key goes here
const ZIP_CODE = "" // yup that too

async function getApiData(param) {
    var WEATHER_URL = ` http://api.weatherapi.com/v1/${param}.json?key=${WEATHER_API}`
    var response = await fetch(WEATHER_URL+`&q=${ZIP_CODE}`, {method: "GET"})
    var jsonBody = await response.json()
    return jsonBody
}

function pickBackgroundColor (temp) {

    console.log(temp);

    if (temp >= 100) {
        return "#9c1c2f"
    }
    if (temp <= 100 && temp >= 75) {
        return "#2e8c38"
    }
    if (temp <= 75 && temp >= 50) {
        return "#2e8c73"
    }
    if (temp < 50 && temp > 25) {
        return "#2e5d8c"
    }
    if (temp <= 25 && temp >= 0) {
        return "#427db8"
    }
}


export class Weather extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            pageState: "loading"
        }
    };
    
    resetPage() {
        // location.reload();
        var newTime = new Date()
        
        setTimeout("location.reload()", 35000)
    }
    
    componentWillMount() {        
        var currentWeatherData = getApiData("current")
        var forecastWeatherData = getApiData("forecast")
        
        Promise.all([currentWeatherData, forecastWeatherData]).then((results) => {
            
            if (results[0].error) {
                this.setState({
                    pageState: "err"
                })
            } else {
                this.setState({ 
                    data: results[0],
                    pageState: "resolved",
                    location: results[0].location.name,
                    forecast: results[1],
                    date: new Date()
                })
                this.resetPage()
            }
            console.log(document.getElementsByClassName("App")[0].style.backgroundColor);      
            document.getElementsByClassName("App-header")[0].style.backgroundColor = pickBackgroundColor(this.state.data.current.temp_f)
        })
    } 
    
    render() {
    if (this.state.pageState === "loading") {
        return (
            <h2>Loading....</h2>
        )
    }

    if(this.state.pageState === "err") {
        return (
            <h2>Ooops... weather broke.</h2>
        )
    }
    return ( 
        <div className="rendered" onClick={this.resetPage}>
            <div float="left" width="40%" position="relative">
            Location: {this.state.location}, {this.state.data.location.region} <br />
            Currently: {this.state.data.current.temp_f}*, {this.state.data.current.condition.text} <br />
            Refreshed at: <br />
            Time:   {this.state.date.getHours()}:{this.state.date.getMinutes()} <br />
            Date:   {this.state.date.getMonth() + 1}/{this.state.date.getDate()}/{this.state.date.getFullYear()}
            </div>
            <div float="right" width="40%" >
                <img src={this.state.data.current.condition.icon} float="right" height="50%" width="50%"/> <br />
            </div>
        </div>

    )
    }
}
