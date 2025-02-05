"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";

interface IProduct {
  name: string;
  slug: { current: string };
  image: { asset: { url: string } };
  imageUrl: string;
  price: number;
  quantity: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<IProduct[]>([]);
  const shippingCost = 200; // Fixed shipping cost

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const updatedCart = parsedCart.map((item: IProduct) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCart(updatedCart);
    }
  }, []);

  const handleRemoveFromCart = (slug: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter((item) => item.slug.current !== slug);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Swal.fire(
          "Removed!",
          "The item has been removed from your cart.",
          "success"
        );
      }
    });
  };

  const handleQuantityChange = (slug: string, type: "increase" | "decrease") => {
    const updatedCart = cart.map((item) =>
      item.slug.current === slug
        ? {
            ...item,
            quantity:
              type === "increase"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1),
          }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getSubtotal = () => {
    return cart.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const getTotalPrice = () => {
    return getSubtotal() + shippingCost;
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <div className="w-full max-w-screen-xl mx-auto p-8 text-[#2A254B]">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-center text-lg">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-6 justify-start w-full">
              {cart.map((product) => (
                <div
                  key={product.slug.current}
                  className="bg-white p-4 rounded-md shadow-md flex flex-col items-center w-full md:w-60"
                >
                  <Link href={`/products/${product.slug.current}`}>
                    <Image
                      src={
                        product.image?.asset
                          ? urlFor(product.image.asset).width(200).url()
                          : product.imageUrl
                      }
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-[150px] object-cover rounded-md mb-4"
                    />
                  </Link>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-xl font-bold">${product.price}</p>

                  <div className="flex items-center mt-4">
                    <Button
                      onClick={() =>
                        handleQuantityChange(product.slug.current, "decrease")
                      }
                      className="bg-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-500"
                    >
                      -
                    </Button>
                    <span className="mx-4">{product.quantity}</span>
                    <Button
                      onClick={() =>
                        handleQuantityChange(product.slug.current, "increase")
                      }
                      className="bg-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-500"
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleRemoveFromCart(product.slug.current)}
                    className="mt-3 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="bg-white p-6 rounded-md shadow-md w-full">
              <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-lg">Subtotal:</span>
                <span className="text-lg font-semibold">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-lg">Shipping:</span>
                <span className="text-lg font-semibold">
                  ${shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                  Proceed to checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

