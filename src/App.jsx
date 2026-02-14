import React from 'react'
import AddProducts from './pages/AddProducts'
import Products from './pages/products' 
import {Routes,Route} from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path = "/add-product"  element = {<AddProducts/>}/>
        <Route path = "/products"  element = {<Products/>}/>

      </Routes>
    </div>
  )
}

export default App