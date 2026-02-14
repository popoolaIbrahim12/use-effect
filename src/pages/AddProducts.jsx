import { useState } from "react";

const AddProducts = () => {
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  // const [productImage, setProductImage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = new FormData();

    // formData.append("title", productTitle);
    // formData.append("description", productDescription);
    // formData.append("price", productPrice);
    // //  formData.append("image",productImage)
    
    //    console.log("Response status:", formData);

    const myProducts = {
      title: productTitle,
      description: productDescription,
      price: productPrice,
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      // category: "electronics",
    };



    try {
      const response = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(myProducts),
      });

      const data = await response.json();
      console.log("Product added successfully:", data);
 
      // console.log(response)

      const existingData = JSON.parse(localStorage.getItem("products")) || [];


      const updatedProducts =  [...existingData, data] 
      // .push(data);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      alert("Product added successfully to Local Storage!");

    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <div className="">
      <div className="flex justify-center mt-20">
        <form
          onSubmit={handleSubmit}
          className="p-10 w-[400px] h-[80vh] border-2 border-gray-300"
        >
          <h2 className="text-center text-3xl mb-10">upload product</h2>
          <input
            type="text"
            placeholder="enter product tile"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            className="w-[300px] h-[45px] p-2 border-2 border-slate-400 rounded-lg mb-5 outline-none"
          />
          <input
            type="text"
            placeholder="enter product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-[300px] h-[45px] p-2 border-2 border-slate-400 rounded-lg mb-5 outline-none"
          />
          <input
            type="text"
            placeholder="enter product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-[300px] h-[45px] p-2 border-2 border-slate-400 rounded-lg ouline-none mb-5"
          />
          {/* <input type="file"
      placeholder="enter product image"
      value={productImage}
     
      onChange={(e)=>setProductImage(e.target.files[0])}
      className="w-[300px] h-[45px] p-2 border-2 border-slate-400 rounded-full ouline-none mb-5"
      
      /> */}

          <button
            type="submit"
            className="w-[300px] h-[45px] bg-slate-800 border-none rounded-lg text-white cursor-pointer"
          >
            upload product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
