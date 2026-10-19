import React from "react"
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import store from "./redux/Store"
import { Provider } from "react-redux"

function App() {
  return (
    <Provider store={store}>
       
     <BrowserRouter>
      
         <Routes>
          
         </Routes>
     
     </BrowserRouter>

    </Provider>
  )
}

export default App
