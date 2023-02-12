import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import { Grommet, Box, Heading, Button } from 'grommet'
import {Menu} from 'grommet-icons'

export default class Navbar extends Component{


render(){
    return(
        <nav>
            <Box
                tag='header'// sets the HTML tag Box is rendered as to header
                direction='row'// sets the flex direction to row
                align='center'
                justify='between'// spreads out the content of the box
                background='brand'// sets the background to the brand, or main, color of the theme.
                pad= '5px'// sets the padding, or space around all content within the box
                elevation='medium'// how high above the background this element
                >
 
                    {/* <Button icon={<Menu />}><Link to="/"></Link></Button> */}
                    <Heading level="3"><Link to="/">Weather home</Link></Heading>
                    <Heading level="3"><Link to="/weather2">Weather 2</Link></Heading>

            </Box>
        </nav>

    )
}

}