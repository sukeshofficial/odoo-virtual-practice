import React from "react"
import { BrowserRouter ,Route,Routes} from 'react-router-dom'
import store from "./redux/Store"
import { Provider } from "react-redux"
import HealthStatus from "./components/health/health"
function App() {
  return (
    <Provider store={store}>
       
     <BrowserRouter>
      
         <Routes >
               <Route path='dev/health/status' element={   <HealthStatus/>}/>
         </Routes>
      
     </BrowserRouter>

    </Provider>
  )
}

export default App
