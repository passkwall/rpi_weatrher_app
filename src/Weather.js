import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const WEATHER_API = "" // weatherapi key goes here
const ZIP_CODE = "" // yup that too

console.log(WEATHER_API); 

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
        setTimeout("location.reload()", 1000000)
        this.setState({date: new Date(Date.now()).toString()})
    }
    
    componentWillMount() {        
        var currentWeatherData = getApiData("current")
        var forecastWeatherData = getApiData("forecast")
        
        Promise.all([currentWeatherData, forecastWeatherData]).then((results) => {

            console.log(results);
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
                    date: new Date(Date.now()).toString()
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
            <img src={this.state.data.current.condition.icon} /> <br />
            Location: {this.state.location}, {this.state.data.location.region} <br />
            Currently: {this.state.data.current.temp_f}*, {this.state.data.current.condition.text} <br />
            Refreshed at: {this.state.date}
        </div>

    )
    }
}
