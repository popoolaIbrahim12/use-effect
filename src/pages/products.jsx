import React, { useEffect, useState } from 'react';

const Products = () => {  // ← renamed to Products (capital P – convention)
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      setFormError("Enter a valid positive price");
      return;
    }
    if (!imageUrl.trim()) {
      setFormError("Image URL is required");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required");
      return;
    }

    const productData = {
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      image: imageUrl.trim(),
      category: "custom",
    };

    setSubmitting(true);

    try {
      let updatedProduct;

      if (editingProduct) {
        // UPDATE
        const url = `https://fakestoreapi.com/products/${editingProduct.id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",   // fixed capitalization
          },
          body: JSON.stringify(productData),      // fixed: body (lowercase)
        });

        if (!response.ok) throw new Error("Failed to update product");

        // FakeStore often returns inconsistent data → we trust OUR data + id
        updatedProduct = {
          ...editingProduct,           // keep id, rating, etc.
          ...productData,              // override changed fields
        };

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? updatedProduct : p
          )
        );

        alert("Product updated successfully!");
      } else {
        // ADD
        const response = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error("Failed to add product");

        const serverResponse = await response.json();
        setProducts((prev) => [serverResponse, ...prev]);

        alert("Product added successfully!");
      }

      // Reset form (common for both add & edit)
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setEditingProduct(null);
    } catch (err) {
      setFormError(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setSubmitting(true);

    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {  // fixed URL
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Fake Store Products</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-20">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
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

          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setTitle("");
                setDescription("");
                setPrice("");
                setImageUrl("");
                setFormError("");
              }}
              className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition mb-2"
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-gray-200"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain p-4 bg-gray-50"
              onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-700">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {product.category || "custom"}
                </span>
              </div>

              <div className="mt-5 flex justify-between space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setTitle(product.title);
                    setPrice(product.price.toString());
                    setDescription(product.description || "");
                    setImageUrl(product.image);           // ← fixed: .image not .imageUrl
                  }}
                  className="bg-blue-600 p-3 text-white rounded-lg font-semibold flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 text-white p-3 rounded-lg font-semibold flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  );
};

export default Products;