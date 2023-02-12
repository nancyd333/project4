import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Weather from "./Weather";
import Weather2 from "./Weather2";
import Navbar from "./Navbar";
import { Grommet } from 'grommet';
import {grommet, dark} from 'grommet/themes';

function App() {

  return (
    <Grommet theme={dark} full>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Weather />}/>
          <Route path="/weather2" element={<Weather2 />}/>
          {/* <Route path="*" element={<App />} /> */}
          {/* <Route path="/houses/:houseId/members/:memberId" element={<Member houses={gameOfThrones}/>}/> */}
        </Routes>
      </Router>
      </Grommet>  
  )
}

export default App;
