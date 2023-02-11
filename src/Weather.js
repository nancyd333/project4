import React, {Component} from 'react'
import axios from 'axios'

export default class Weather extends Component{

    state = {
        city: '',
        cityInfo: [],
        // selectCityId: '',
        selectedCity: [],
        selectCityCurrentWeatherData: {},
        selectCityHistoricalWeatherData: {},
    }

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

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=temperature_2m&current_weather=true&timezone=${selectedCity.timezone}`

            const response = await axios.get(url,options);
            
            const weatherData = response.data.current_weather
            // console.log('url', url)
            console.log('weatherdata', weatherData)

            const urlHistorical = `https://archive-api.open-meteo.com/v1/archive?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&start_date=2000-01-01&end_date=2023-02-06&daily=temperature_2m_mean&timezone=${selectedCity.timezone}`
        
            const responseHistorical = await axios.get(urlHistorical,options);
                
            const historicalWeatherData = responseHistorical.data
            // console.log('url', url)
            console.log('weatherdataHistorical', historicalWeatherData)
           
            this.setState({
                selectCityCurrentWeatherData: weatherData ,
                selectCityHistoricalWeatherData: historicalWeatherData              
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




        return(
        <div>
            <h1>Weather</h1>

            <form>
            <label>
                <input type="text" name="name" value={this.state.city} onChange={this.handleChange} autoComplete="off"/>
                </label>
            </form>
            <button onClick={(
                this.getCityData
                // this.gethistoricalWeatherData
            )} type="submit">search cities</button>
            
            <h2>City List</h2>
            {cityInfo}

            <h2>Selected City Data</h2>
            {this.state.selectCityCurrentWeatherData.temperature}

            <h2>Selected City Historical Data</h2>
            {this.state.selectCityHistoricalWeatherData.elevation}

      </div>

    )
  }
}