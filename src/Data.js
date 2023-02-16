import React, {Component, useState} from 'react'
// import {Link} from 'react-router-dom'
import axios from 'axios'
import Chart2 from './Chart2'
import Chart from './Chart'
import Chart3 from './Chart3'
import * as d3 from 'd3'

export default class Data extends Component{

    state = {
        city: '',
        cityInfo: [],
        selectedCityInfo: [],
        selectCityCurrentWeatherData: {},
        historicalWeatherDateCombo: [],
        currentTemp: 0,
        oneYearAgoTemp: 0,
        fiveYearsAgoTemp: 0,
        tenYearsAgoTemp: 0,
        thirtyYearsAgoTemp: 0,

    }

    today = new Date()
    currentYear = this.today.getFullYear()
    oneYearAgo = this.currentYear - 1
    fiveYearsAgo = this.currentYear - 5
    tenYearsAgo = this.currentYear - 10
    thirtyYearsAgo = this.currentYear - 30
    month = this.today.getMonth() + 1
    formattedMonth = () =>{
        if(this.month.length != 2){
            return `0${this.month}`
        } else{
            return `${this.month}`
        }
    }
    day = this.today.getDate()
    
    todayDate = this.today.toLocaleDateString()
    oneYearAgoFormatted = `${this.formattedMonth()}/${this.day}/${this.oneYearAgo}`
    fiveYearsAgoFormatted =  `${this.formattedMonth()}/${this.day}/${this.fiveYearsAgo}`
    tenYearsAgoFormatted =  `${this.formattedMonth()}/${this.day}/${this.tenYearsAgo}`
    thirtyYearsAgoFormatted =  `${this.formattedMonth()}/${this.day}/${this.thirtyYearsAgo}`

    fullCurrentDate = `${this.currentYear}-${this.formattedMonth()}-${this.day}`
    fullOneYearAgoDate = `${this.oneYearAgo}-${this.formattedMonth()}-${this.day}`
    fullFiveYearsAgoDate = `${this.fiveYearsAgo}-${this.formattedMonth()}-${this.day}`
    fullTenYearsAgoDate = `${this.tenYearsAgo}-${this.formattedMonth()}-${this.day}`
    fullThirtyYearsAgoDate = `${this.thirtyYearsAgo}-${this.formattedMonth()}-${this.day}`

    
    getCityData = async (e) => {
        e.preventDefault()
        
        try{
           
            const options = {
                headers: {
                    Accept: 'application/json'
                }
            }
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.city}`

            const response = await axios.get(url,options);
            
            const cityInfo = response.data.results
            console.log(cityInfo)
           
            this.setState({
                cityInfo: cityInfo,
                city: e.target.value,
                currentTemp: 0,
            })    

        } catch (err){
            console.log(err)
        }
    }



    handleChange = e => {       
        console.log("target value", e.target.value)
        this.setState({
          city: e.target.value
        })
      }
    
    getWeatherData = async (e) =>{
        e.preventDefault()
        try{
            const options = {
                headers: {
                    Accept: 'application/json'
                }
            }
            // console.log('getweatherdata e.target.value', e.target.value)
            const selectedCity = this.state.cityInfo.find(x => x.id == e.target.value)
            // console.log("this city info id",selectedCity.id)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=temperature_2m&current_weather=true&timezone=${selectedCity.timezone}&temperature_unit=fahrenheit`

            const response = await axios.get(url,options);
            
            const weatherData = response.data.current_weather
  
            // console.log('weatherdata', weatherData)

            const urlHistorical = `https://archive-api.open-meteo.com/v1/archive?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&start_date=${this.fullThirtyYearsAgoDate}&end_date=${this.fullOneYearAgoDate}&daily=temperature_2m_mean&timezone=${selectedCity.timezone}&temperature_unit=fahrenheit`
        
            const responseHistorical = await axios.get(urlHistorical,options);
                
            const historicalWeatherDataDates = responseHistorical.data.daily.time
            // const historicalWeatherDataDates = historicalWeatherDataDates2.map(i => new Date(i))
            const historicalWeatherDataTemp = responseHistorical.data.daily.temperature_2m_mean
            
            // let result = []
            // historicalWeatherDataDates.forEach((key, i)=> result[key] = historicalWeatherDataTemp[i])
            // console.log("result", result)
            let result = historicalWeatherDataTemp.map((item, index)=> {
                return {date: historicalWeatherDataDates[index], temp: item}
            })
            console.log("result", result)
            function getTempDate(dt){
                for(let i = 0; i < result.length; i++){
                    if (result[i].date == dt){
                        return result[i].temp;
                    }
                }
            }
            // console.log("one historical data", getTempDate(this.fullOneYearAgoDate))

            this.setState({
                historicalWeatherDateCombo: result, 
                selectedCityInfo: selectedCity,
                selectCityCurrentWeatherData: weatherData ,
                cityInfo: [],
                currentTemp: weatherData.temperature,
                oneYearAgoTemp: getTempDate(this.fullOneYearAgoDate),
                fiveYearsAgoTemp: getTempDate(this.fullFiveYearsAgoDate),
                tenYearsAgoTemp: getTempDate(this.fullTenYearsAgoDate),
                thirtyYearsAgoTemp: getTempDate(this.fullThirtyYearsAgoDate),
            }, () => {
                // console.log("result test in this.setState", result)
            })
            // console.log("result test after this.setState", result)
            // console.log("historicalWeatherDateCombo test after this.setState", this.historicalWeatherDateCombo) 
            
        } catch (err){
            console.log(err)
        }
    }
  
    render(){      
        <span>Select your city</span>
        const cityInfo = this.state.cityInfo.map((info)=>
            // console.log('render citydata', info)             
            <div key={`id-${info.id}`}>
                <form>
                    <button className="btn city" value={info.id} onClick={(this.getWeatherData)} type="submit">{info.name}, {info.admin1}, {info.country}</button>
                </form>
            </div>

        )

        const data = [
            {"date": 'Current', "actual_date": this.todayDate ,"temp": this.state.currentTemp},
            {"date": '1 yr ago', "actual_date": this.oneYearAgoFormatted ,"temp": this.state.oneYearAgoTemp},
            {"date": '5 yrs ago', "actual_date": this.fiveYearsAgoFormatted ,"temp": this.state.fiveYearsAgoTemp},
            {"date": '10 yrs ago', "actual_date": this.tenYearsAgoFormatted ,"temp": this.state.tenYearsAgoTemp},
            {"date": '30 yrs ago', "actual_date": this.thirtyYearsAgoFormatted ,"temp": this.state.thirtyYearsAgoTemp},
        ]
        
        console.log("data to pass to props", data)
        return(
        <div>
            <h2>weather over time</h2>

            <form >
            <label>
                <input placeholder="enter city name " type="text" name="name" value={this.state.city} onChange={this.handleChange} autoComplete="off"/>
            </label>
            <button className="btn default" onClick={(this.getCityData)}  type="submit">submit</button>
            </form>
            {cityInfo}
            <div> {this.state.currentTemp ?
                <Chart 
                tempData = {this.state.oneYearAgoTemp ? data : []}
                citySelected = {`${this.state.selectedCityInfo.name} , ${this.state.selectedCityInfo.admin1} , ${this.state.selectedCityInfo.country}`}
                hasCitySelected = {this.state.selectedCityInfo.name}
                /> : ''}
            </div>
      </div>
    )
  }
}
