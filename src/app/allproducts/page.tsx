"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";

// Define the interfaces for categories and products
interface ICategory {
  name: string;
  slug: { current: string };
}

interface IProduct {
  name: string;
  slug: {
    current: string;
  };
  image: {
    asset: {
      url: string;
    };
  };
  price: number;
  category: {
    slug: {
      current: string;
    };
  };
  type: string;
}

const AllProducts = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(12);
  const productsPerPage = 12;
  const [showFilters, setShowFilters] = useState(false);

  // Cart state
  const [cart, setCart] = useState<IProduct[]>([]);

  // Fetch data for products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productQuery = `*[_type == "product" 
          && (${selectedCategory ? `category->slug.current == "${selectedCategory}"` : "true"} )
          && (${selectedType ? `type == "${selectedType}"` : "true"} )
          && (${selectedPrice ? `price <= ${selectedPrice}` : "true"})]{
          name, slug,image, price, category, type
        }`;

        const fetchedProducts = await client.fetch(productQuery);
        setData(fetchedProducts);

        const categoryQuery = '*[_type == "category"]{name, slug}';
        const fetchedCategories = await client.fetch(categoryQuery);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedType, selectedPrice]);

  //  Fetch cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Toggle for viewing more or fewer products
  const handleViewToggle = () => {
    if (visibleCount >= data.length) {
      setVisibleCount(12);
    } else {
      setVisibleCount((prev) => prev + productsPerPage);
    }
  };

  //  Function to add product to cart
  const handleAddToCart = (product: IProduct) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      console.log("Updated Cart:", updatedCart); // Debugging log
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Persisting cart to localStorage
      return updatedCart;
    });

    // Show SweetAlert notification
    Swal.fire({
      title: "Added to Cart",
      text: `${product.name} has been added to your cart.`,
      icon: "success",
      confirmButtonText: "OK",
      background: "#f9f9f9",
      color: "#2A254B",
      confirmButtonColor: "#2A254B",
    });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="border-8 border-t-8 border-gray-300 border-t-[#2A254B] rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <Header />
      <div className="w-full max-w-screen-xl mx-auto text-[#2A254B]">
        <div>
          <Image
            src="/images/productlisting200.svg"
            alt="Product Listing Banner"
            height={209}
            width={1440}
            className="object-cover w-full"
          />
        </div>

        {/* Cart Button displaying the number of items */}
        <div className="cart-summary absolute top-6 right-[91px] bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          <Link href="/cart">
            <span className="text-sm">{cart.length}</span>
          </Link>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center py-4 px-8">
          <button
            className="bg-[#F9F9F9] py-2 px-4 text-sm font-semibold rounded-md hover:bg-[#2A254B] hover:text-white transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter section for small screens */}
        {showFilters && (
          <div className="md:hidden w-full px-8 pb-8">
            <div className="flex flex-col gap-6">
              {/* Category Filter UI */}
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-lg font-medium">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-2 border-gray-300 rounded-md px-4 py-2 "
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.slug.current}
                      value={category.slug.current}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter UI */}
              <div className="flex flex-col gap-2">
                <label htmlFor="type" className="text-lg font-medium">
                  Type
                </label>
                <select
                  id="type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border-2 border-gray-300 rounded-md px-4 py-2 "
                >
                  <option value="">Select Type</option>
                  <option value="furniture">Furniture</option>
                  <option value="decor">Decor</option>
                </select>
              </div>

              {/* Price Filter UI */}
              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-lg font-medium">
                  Price
                </label>
                <select
                  id="price"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="border-2 border-gray-300 rounded-md px-4 py-2 "
                >
                  <option value="">Select Price</option>
                  <option value="50">Under $50</option>
                  <option value="100">Under $100</option>
                  <option value="200">Under $200</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Filter section for large screens */}
        <div className="hidden md:flex gap-8 text-sm sm:text-base px-8 py-4 bg-slate-50 shadow-md">
          {/* Category Filter UI */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-lg font-medium">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-gray-300 rounded-md px-4 py-2 "
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option
                  key={category.slug.current}
                  value={category.slug.current}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter UI */}
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-lg font-medium">
              Type
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border-2 border-gray-300 rounded-md px-4 py-2 "
            >
              <option value="">Select Type</option>
              <option value="furniture">Furniture</option>
              <option value="decor">Decor</option>
            </select>
          </div>

          {/* Price Filter UI */}
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-lg font-medium">
              Price
            </label>
            <select
              id="price"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="border-2 border-gray-300 rounded-md px-4 py-2 "
            >
              <option value="">Select Price</option>
              <option value="50">Under $50</option>
              <option value="100">Under $100</option>
              <option value="200">Under $200</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-2 p-8 sm:p-10">
          {data.slice(0, visibleCount).map((prod) => (
            <div
              key={prod.slug.current}
              className="bg-white p-4 rounded-md shadow-lg hover:shadow-2xl transition-all"
            >
              <Link href={`/products/${prod.slug.current}`} passHref>
                <Image
                  src={urlFor(prod.image?.asset).url()}
                  alt={prod.name}
                  width={400}
                  height={400}
                  className="w-full h-[300px] object-cover mb-3 rounded-md"
                />
                <h3 className="font-semibold text-lg">{prod.name}</h3>
              </Link>
              <div className="flex justify-between items-center ">
                <p className="text-xl font-bold">${prod.price}</p>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(prod)}
                  className="mt-4  bg-[#2A254B] text-white rounded-md py-2 hover:bg-[#4C3F6B]"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleViewToggle}
          className="block mx-auto my-4 py-2 px-6 bg-[#2A254B] text-white rounded-md hover:bg-[#4C3F6B] transition-all"
        >
          {visibleCount >= data.length ? "Show Less" : "Show More"}
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default AllProducts;
