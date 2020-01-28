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


export class Weather extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            pageState: "loading"
        }
    };
    
    resetPage() {
        setTimeout("location.reload()", 100000000000000)
        this.setState({date: new Date()})
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
        <div>
            <img src={this.state.data.current.condition.icon} height="50%" width="50%"/> <br />
            Location: {this.state.location}, {this.state.data.location.region} <br />
            Currently: {this.state.data.current.temp_f}*, {this.state.data.current.condition.text} <br /> <br />
            Refreshed at: <br />
            Time:   {this.state.date.getHours()}:{this.state.date.getMinutes()} <br />
            Date:   {this.state.date.getMonth() + 1}/{this.state.date.getDate()}/{this.state.date.getFullYear()}
        </div>

    )
    }
}
