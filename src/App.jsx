import { useEffect, useState } from "react"


const App = () => {
  const [product,setProduct] = useState([])

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => setProduct(data)
    ,[])
  })
  return (
    <div>
      <h1 className="text-center text-4xl md:text-6xl ">products</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
        {product.map((item) => (
          
          <div key={item.id} className="border-2 border-gray-300 rounded-lg p-4 m-4 ">
            <img src={item.image} alt={item.title} className="h-40 object-contain mx-auto cursor-pointer" />
            <h2 className="text-lg font-semibold mt-10">{item.title}</h2>
            <h5 className="text-sm mt-3">{item.description}</h5>
            <p className="text-xl font-bold mt-2">${item.price}</p>
          </div>
        ))}
       </div>
    </div>
  )
}

export default App