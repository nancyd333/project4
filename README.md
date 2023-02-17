## About
**The Weather Today** application allows you to search for any city in world and returns the current temperature, as well as the temperature on the same day 1 year ago, 5 years ago, 10 years ago, and 30 years ago. The average temperature for todays day, over the past 30 years, is provided for comparison. Hovering over the bars reveals the temperature value.

## Link to Site
<a href="https://weather-today-30.netlify.app/">The Weather Today</a>

## Application Screen Shot
<img src="public/final_project.png" alt="application screen shot" width="300" height="300">

## Installation Instructions
Fork and clone this repository <br>
run ```npm i```

## Technology
HTML/CSS<br/>
<a href="https://reactjs.org/">React</a><br/>
Graph using <a href="https://d3js.org/">D3.js</a><br/>
Weather and city API data from <a href="https://open-meteo.com/">Open-Meteo.com</a>

# The Project
## Project
The goal of this project is to visualize weather data over time using D3.js.

Since the project timeline is short I've decided use Open-Meteo API since it returns data quickly, is always available, provides a lot of data (including historical data), and doesn't require an API key.

The application allows a user to search for their city and displays a graph with visualized weather information. 

## User Stories
- I would like to be able to search for any city in the world and retrieve today's temperature.
- I would like to see today's weather compared to the weather at different points in the past.
- I would like to see how the temperature compares the average for this day over the past 30 years.

## Wireframe
<img src="public/project4wireframe.png" alt="project wireframe">

## MVP
- Allow user to search and retrieve data from API
- One page with weather data visualization using D3.js

## Stretch goals
- Adding more visualizations
- Creating more complicated visualizations
- Deploy project

## Project Timeline
- Feb 10 - 11, 2023 : Set up and install. Work on retrieving API data, understanding the dataset, and working on search functionality. Work on retrieving data from API on the front end.
- Feb 12 - 13, 2023 : Create D3.js graph and get graph to read the API data.
- Feb 14 - 15, 2023 : Work styling the page, user experience, and graph interactivity.
- Feb 16, 2023 : Complete styling and interactivity, deploy, and complete Readme.

## Major Hurdles
- Originally this project was to include Grommet CSS, React, and D3.js but this proved to not be viable. Therefore the project uses React and D3.js with basic HTML and CSS for styling.
- D3.js has a learning curve. 
    - Watching YouTube videos was helpful, as was understanding some of the basics using <a href="https://observablehq.com/@d3">Observable</a>. After trial and error I realized many of the examples use an older version of D3 which had different syntax. I also realized errors in Observable can be Observable errors and not D3.js errors. 
    - Since both D3 and React control the DOM there are many different (and sometimes conflicting) suggestions about what should and should not be tried used D3.js and React. A future goal would be exploring the different options and understanding the limitations as well as other technologies that might be better suited for specific tasks.

