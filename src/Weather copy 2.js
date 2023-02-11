import React, {Component} from 'react';
import Starship from './Starship'
import axios from 'axios'


export default class Starships extends Component {
    state = {
        starships: []
      }
    async componentDidMount() {
        try {
            const url = 'https://swapi.dev/api/starships'
            const response = await axios.get(url)
            this.setState({
                starships: response.data.results
            })
        } catch (err) {
            console.log(err)
        }
      }
   

  render() {
 
    // console.log("shipname", this.props.shipName)
    const starshipComponents = this.state.starships.map((starship, idx)=>{
        return(
            <Starship 
                starship={starship}
                key={`Starship-${idx}`}
            />
        )
    })
    return (
     
      <div>
        <h1>Starships:</h1>
        {/* logical AND short circuting  */}
        {starshipComponents.length > 0 ? starshipComponents : 'still loading ...'}
      </div>
     )
  }
}