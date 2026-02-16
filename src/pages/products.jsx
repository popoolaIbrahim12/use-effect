import React, { useEffect, useState } from 'react'

const products = () => {
  const [products,setProducts] = useState([])
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [price,setPrice] = useState("")
  const [imageUrl,setImageUrl] = useState("")
  
  const [isLoading,setIsLoading] = useState(false)
  const [error,setError] = useState(null)
  const [submitting,setSubmitting] = useState(false)
  const [formError,setFormError] = useState("")
  const [successMessage,setSuccessMessage] = useState("")
  const [showSuccessMessage,setShowSuccessMessage] = useState(false)
  const [editingProduct,setEditingProduct] = useState(null)


useEffect(() => {
  const fetchProducts = async () => {
    try{
      setIsLoading(true)
      const response = await fetch("https://fakestoreapi.com/products")
      if (!response.ok) throw new Error("failed to fetch products")
        const data = await response.json()
        setProducts(data)
       } catch(error) {
       setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  fetchProducts()
},[])

const handleSubmit = async (e) => {
  e.preventDefault()
  setFormError("")
  if(!title.trim()){
    setFormError("Title is required")
     return;
  }
  if(!price || isNaN(price) || Number(price) <= 0){
    setFormError("Enter a valid positive price")
    return;

  }
  if(!imageUrl.trim()){
    setFormError("Image URL is required")
    return;
  }
  if(!description.trim()){
    setFormError("Description is required")
    return;
    }
 const newProducts = {
  title: title.trim(),
  price: Number(price),
  description: description.trim(),
  image: imageUrl.trim(),
  category:"custom"
 }

 setSubmitting(true)
 try {
  let response;
  let updatedProducts;

  if(editingProduct) {
   const url = `https://fakestoreapi.com/products/${editingProduct.id}`
   response = await fetch(url,{
    method: "PUT",
    headers:{
      "content-type":"application/json"

    },
    Body:JSON.stringify(newProducts)
   })
   if(!response.ok) throw new Error("failed to update product")
    updatedProducts = await response.json()
  
  setProducts((prevProducts) => prevProducts.map((product) => product.Id === editingProduct ? updatedProducts : product))
  console.log(editingProduct)
 alert("Product updated successfully")
 setTitle(""),
 setDescription(""),
 setPrice(""),
 setImageUrl("")
  } else {
     
  response = await fetch("https://fakestoreapi.com/products",{
    method:"POST",
    headers: {
      "content-type": "application/json"
    },
    body:JSON.stringify(newProducts)
  })  
 if(!response.ok) throw new Error("failed to add products")
updatedProducts = await response.json()

 setProducts((prevProducts) => [updatedProducts, ...prevProducts])
 alert("Product added successfully")

 setTitle(""),
 setDescription(""),
 setPrice(""),
 setImageUrl("")
 setEditingProduct(null)
  }

 } catch (error){
  setFormError(error.message)
 } finally {
  setSubmitting(false)
 }
}
const handleDelete = async(id) => {
if(!window.confirm("Are you sure you want to delete this product?")) return;

setSubmitting(true)

try{
const response = await fetch(`https://fakestoreapi.com/products/${id}`,{
  method:"DELETE"
}) 
if(!response.ok) throw new Error("failed to delete product")
  setProducts((prevProducts) =>prevProducts.filter((product) => product.id !== id))
alert("Product deleted successfully")
}catch(error) {
  setError(error.message)
} finally {
  setSubmitting(false)
}
}
if(isLoading) return <div className='text-center p-8'>Loading products...</div>
if(error) return <div className='text-center p-8 text-red-600'>{error}</div>


  return (
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-8 text-center">
        Fake Store Products
      </h1>
      {/* ─── ADD PRODUCT FORM ─── */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-20">
        <h2 className="text-3xl font-semibold mb-4 text-center">{editingProduct ? "Edit product" :"Add product"}</h2>

        <form   onSubmit = {handleSubmit} className="space-y-4">

          
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-1">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-1">Image URL *</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Show red error message if validation fails */}
          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          {/* Submit button – changes text/color when submitting */}

        {editingProduct &&(  <button onClick={() => {
            setEditingProduct(null)
            setTitle("")
            setDescription("")
            setPrice("")
            setImageUrl("")
            setFormError("")
            
          }}
          className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition mb-2"
          >cancel Edit</button>)}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'saving...' : (editingProduct ? "update Product" : 'Add Product')}
          </button>
        </form>
      </div>

      {/* ─── PRODUCT GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}   // very important for React list performance
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-gray-200"
          >
            
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain p-4 bg-gray-50"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
              }}
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-700">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {product.category || 'custom'}
                </span>
              </div>
              <div className="mt-5 flex justify-between space-x-2">
                <button onClick={() => {
                  setEditingProduct(product)
                  setTitle(product.title)
                   setPrice(product.price.toString())
                  setDescription(product.description)
                  setImageUrl(product.imageUrl)
                 
                }}
                className='bg-blue-600 p-3 text-white rounded-lg font-semibold'
                >Edit</button>
                <button 
                onClick={() => handleDelete(product.id)}
                className='bg-red-600 text-white p-3 rounded-lg font-semibold'>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message if somehow no products exist */}
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
  </div>
  
  )
}

export default products;