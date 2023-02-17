import React, {Component, useState} from 'react'
import axios from 'axios'
import Chart from './Chart'

export default class Data extends Component{

    state = {
        city: '',
        cityInfo: [],
        selectedCityInfo: [],
        selectCityCurrentWeatherData: {},
        historicalWeatherDateCombo: [],
        todayMonthString: '',
        todayDay: '',
        todayYear: '',
        currentTemp: 0,
        oneYearAgoTemp: 0,
        fiveYearsAgoTemp: 0,
        tenYearsAgoTemp: 0,
        thirtyYearsAgoTemp: 0,

    }

    today = new Date()

    //formats js date to month with leading zero 1 becomes 01; 12 remains 12
    formattedMonth = () =>{
        if(this.month.length != 2){
            return `0${this.month}`
        } else{
            return `${this.month}`
        }
    }

    //takes js date month, numberic from 0-11 and returns the text. 0 returns Jan
    monthNumberToText = (num) => {
        switch(num){
            case 0:
                return 'Jan';
            case 1:
                return 'Feb';
            case 2:
                return 'Mar';
            case 3:
                return 'Apr';
            case 4:
                return 'May';
            case 5:
                return 'Jun';
            case 6:
                return 'July';
            case 7:
                return 'Aug';
            case 8:
                return 'Sep';
            case 9:
                return 'Oct';
            case 10:
                return 'Nov';
            case 11:
                return 'Dec';
        }

    }

    //these are saved in state and passed as props to Chart
    todayMonthString =  this.monthNumberToText(this.today.getMonth())
    todayDay = this.today.getDate()
    todayYear = this.today.getFullYear()

    //these are used as parameters in variables which are then passed to the API
    day = this.today.getDate()
    month = this.today.getMonth() + 1 //this converts the js month number system 0-11 to the number systems users use 1-12
    currentYear = this.today.getFullYear()
    oneYearAgo = this.currentYear - 1
    fiveYearsAgo = this.currentYear - 5
    tenYearsAgo = this.currentYear - 10
    thirtyYearsAgo = this.currentYear - 30

    //these variables are used as parameters in the API and the function getTempDate() to get the temperature for a particular date which is passed to react state
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

            console.log("today date setState test", this.todayMonthString, this.todayDay, this.todayYear)

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
            const historicalWeatherDataTemp = responseHistorical.data.daily.temperature_2m_mean
            
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

            function getTempAvg(month, day){
                const tempsThisMonth = []
                let sum = 0;
                for(let i = 0; i < result.length; i++){
                    if (result[i].date.substr(5,2) == month && result[i].date.substr(8,3) == day){
                        tempsThisMonth.push(result[i].temp)
                    }
                }
                tempsThisMonth.forEach(function(item){
                    sum+= item
                })

                return (
                    sum/tempsThisMonth.length
                    )
            }
            const avgTempMonthDay = Math.round(getTempAvg(this.formattedMonth(), this.day))
            // console.log("DATES", this.formattedMonth(), this.day)
            // console.log("GET AVG", avgTempMonthDay)


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
                todayMonthString:  this.todayMonthString,
                todayDay: this.todayDay,
                todayYear: this.todayYear,
                avgTempMonthDay: avgTempMonthDay
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
            {"date": this.currentYear, "temp": this.state.currentTemp},
            {"date": this.oneYearAgo, "temp": this.state.oneYearAgoTemp},
            {"date": this.fiveYearsAgo, "temp": this.state.fiveYearsAgoTemp},
            {"date": this.tenYearsAgo, "temp": this.state.tenYearsAgoTemp},
            {"date": this.thirtyYearsAgo, "temp": this.state.thirtyYearsAgoTemp},
        ]
        
        // console.log("data to pass to props", data)
        
        return(
        <div>
            <h2>the weather on this day</h2>

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
                todayMonthString = {this.todayMonthString}
                todayDay={this.todayDay}
                todayYear={this.todayYear}
                avgTempMonthDay={this.state.avgTempMonthDay}
                /> : ''}
            </div>
      </div>
    )
  }
}
