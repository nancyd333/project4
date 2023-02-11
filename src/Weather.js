import React, {Component} from 'react'
import axios from 'axios'
import { Grommet } from 'grommet'

export default class Weather extends Component{

    state = {
        city: '',
        cityInfo: [],
        selectedCityInfo: [],
        selectCityCurrentWeatherData: {},
        // selectCityHistoricalWeatherDataDate: [],
        // selectCityHistoricalWeatherDataTemp: [],
        historicalWeatherDateCombo: [],
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
           
            this.setState({
                cityInfo: cityInfo,
                city: e.target.value

               
            })
            
        } catch (err){
            console.log(err)
        }
    }

    handleChange = e => {       
        console.log("target value", e.target.value)
        //console.log("handle this change")
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
            console.log('getweatherdata', e.target.value)
            // console.log(this.state.cityInfo)
            const selectedCity = this.state.cityInfo.find(x => x.id == e.target.value)
            // console.log(selectedCity.longitude)

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=temperature_2m&current_weather=true&timezone=${selectedCity.timezone}&temperature_unit=fahrenheit`

            const response = await axios.get(url,options);
            
            const weatherData = response.data.current_weather
            // console.log('url', url)
            console.log('weatherdata', weatherData)


            const urlHistorical = `https://archive-api.open-meteo.com/v1/archive?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&start_date=${this.fullTenYearsAgoDate}&end_date=${this.fullOneYearAgoDate}&daily=temperature_2m_mean&timezone=${selectedCity.timezone}&temperature_unit=fahrenheit`
        
            const responseHistorical = await axios.get(urlHistorical,options);
                
            const historicalWeatherDataDates = responseHistorical.data.daily.time
            const historicalWeatherDataTemp = responseHistorical.data.daily.temperature_2m_mean
            
            let result = []
            historicalWeatherDataDates.forEach((key, i)=> result[key] = historicalWeatherDataTemp[i])
            console.log(result)
            // console.log(this.fullOneYearAgoDate)
            console.log(result[this.fullOneYearAgoDate])
            // let newArray = historicalWeatherDataDates.map((e,i)=> e + ',' + historicalWeatherDataTemp[i])
            // console.log(newArray)
            // const historicalWeatherDateCombo = [historicalWeatherDataDates, historicalWeatherDataTemp]
            // console.log('url', url)
            // console.log('weatherdataHistorical', historicalWeatherDataDates)
            // console.log('weatherdataHistorical', historicalWeatherDataTemp)
           
            this.setState({
                selectedCityInfo: selectedCity,
                selectCityCurrentWeatherData: weatherData ,
                // selectCityHistoricalWeatherDataDate: historicalWeatherDataDates,
                // selectCityHistoricalWeatherDataTemp: historicalWeatherDataTemp,
                historicalWeatherDateCombo: result,          
            })
            
        } catch (err){
            console.log(err)
        }
    }
  

    

    render(){      
        const cityInfo = this.state.cityInfo.map((info)=>
            // console.log('render citydata', info)
            <div key={`id-${info.id}`}>
                <form>
                    <button value={info.id} onClick={this.getWeatherData} type="submit">{info.name}, {info.admin1}, {info.country}</button>

                </form>
            
            </div>
        )
        //note: index is -1 until the user select city and api returns historical data
        // oneYearAgoIndex = this.state.selectCityHistoricalWeatherDataDate.indexOf(this.fullOneYearAgoDate)
        // oneYearAgoTemp = this.state.selectCityHistoricalWeatherDataTemp[oneYearAgoIndex]
        // const fiveYearsAgoIndex = this.state.selectCityHistoricalWeatherDataDate.indexOf(this.fullFiveYearsAgoDate)
        // const fiveYearsAgoTemp = this.state.selectCityHistoricalWeatherDataTemp[fiveYearsAgoIndex]
        // const tenYearsAgoIndex = this.state.selectCityHistoricalWeatherDataDate.indexOf(this.fullTenYearsAgoDate)
        // const tenYearsAgoTemp = this.state.selectCityHistoricalWeatherDataTemp[tenYearsAgoIndex]
        // const thirtyYearsAgoIndex = this.state.selectCityHistoricalWeatherDataDate.indexOf(this.fullThirtyYearsAgoDate)
        // const thrityYearsAgoTemp = this.state.selectCityHistoricalWeatherDataTemp[thirtyYearsAgoIndex]


        // function getTempFromDate(date){
        //     const dataIndex = this.state.selectCityHistoricalWeatherDataDate.indexOf(this.fullOneYearAgoDate)
        //     if(dataIndex != -1){
        //         return this.state.selectCityHistoricalWeatherDataTemp[dataIndex]
        //     }
        // }
        // tempOneYearAgo = getTempFromDate(this.fullOneYearAgoDate)
        


        return(
        <div>
            <h1>Weather</h1>

            <form>
            <label>
                <input type="text" name="name" value={this.state.city} onChange={this.handleChange} autoComplete="off"/>
                </label>
            </form>
            <button onClick={(this.getCityData)} type="submit">search cities</button>
            
            <h2>City List</h2>
            {cityInfo}

            <h2>Selected City Data</h2>
            {this.state.selectCityCurrentWeatherData.temperature}

            <h2>Selected City Historical Data</h2>
            <p>Today's date: {`${this.fullCurrentDate}`}</p>
            <p>Today's current temp: {this.state.selectCityCurrentWeatherData.temperature}</p>
            <p>Year ago today date: {`${this.fullOneYearAgoDate}`}</p>
            <p>Year ago today temp: {this.state.historicalWeatherDateCombo[this.fullOneYearAgoDate] ? `${this.state.historicalWeatherDateCombo[this.fullOneYearAgoDate]}` : ''}</p>

            

      </div>

    )
  }
}
