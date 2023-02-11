import React, {Component} from 'react'
import axios from 'axios'

export default class Weather extends Component{

    state = {
        city: '',
    }

 

    handleGetWeather = async (e) =>{
        e.preventDefault()
        try{
            const options = {
                headers: {
                    Accept: 'application/json'
                }
            }
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.city}`

            const response = await axios.get(url,options);
            
            const city_info = response.data.results.map(item => {
                // console.log(`${item.name} , ${item.admin1}, ${item.country}, ${item.timezone}, ${item.latitude}, ${item.longitude}`)  
                
                return [item.id, item.name, item.admin1, item.country, item.timezone, item.latitude, item.longitude]
            })
     
            console.log(city_info)
           
            this.setState({
                city_info: city_info
               
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
  
    render(){
        return(
        <div>
            <h1>Weather</h1>
            {/* <p>{this.state.city_info}</p> */}
            <form>
            <label>
                <input type="text" name="name" value={this.state.city} onChange={this.handleChange} />
                </label>
            </form>
            {/* <button onClick={this.handleGetWeather} type="submit">click me</button> */}


      </div>

    )
  }
}