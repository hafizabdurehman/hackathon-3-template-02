"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { createOrder } from "@/sanity/orderServices";

// Define the product type
type Product = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  image?: {
    asset: {
      url: string;
    };
  };
};

const CheckoutPage = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  // Fetch cart data from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const getSubTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getShippingFee = () => 200;

  const getTotal = () => getSubTotal() + getShippingFee();

  const handleCheckout = async () => {
    if (!name || !phone || !address || !city || !zipCode) {
      Swal.fire(
        "Missing Information",
        "Please fill in all required fields",
        "error"
      );
      return;
    }

    setLoading(true);
    Swal.fire({
      title: "Processing...",
      text: "Your order is being placed. Please wait.",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formattedProducts = cart.map((product) => ({
        _key: `${product.slug}-${Date.now()}`,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        imageUrl: product.image?.asset?.url || product.imageUrl,
      }));

      const orderData = {
        name,
        phone,
        email,
        address,
        city,
        zipCode,
        products: formattedProducts,
        totalAmount: getSubTotal(),
        shippingFee: getShippingFee(),
        grandTotal:
          discountedTotal !== null
            ? discountedTotal + getShippingFee()
            : getTotal(),
        orderDate: new Date().toISOString(),
        promoCode: promoCode || null,
      };

      await createOrder(orderData);

      Swal.fire(
        "Order Placed Successfully!",
        `Shipping to: ${address}, ${city} - ${zipCode}`,
        "success"
      );

      localStorage.removeItem("cart");
      setCart([]);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Order Error:", error);
      Swal.fire(
        "Error",
        "There was an issue placing your order. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = () => {
    if (promoCode === "DISCOUNT10") {
      const discountPrice = getSubTotal() * 0.9; // 10% discount
      setDiscountedTotal(discountPrice);
      Swal.fire("Promo Code Applied!", "You got a 10% discount!", "success");
    } else {
      setDiscountedTotal(null);
      Swal.fire("Invalid Code", "Please enter a valid promo code.", "error");
    }
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <div className="w-full max-w-screen-xl mx-auto p-8 text-[#2A254B]">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((product) => (
                  <div
                    key={product.slug}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          product.image?.asset
                            ? urlFor(product.image.asset).width(200).url()
                            : product.imageUrl
                        }
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <div className="text-lg">
                        <div>{product.name}</div>
                        <div className="text-sm text-gray-500">{`Quantity: ${product.quantity}`}</div>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">
                      ${product.price * product.quantity}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Promo Code</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-48 p-2 border rounded-md"
                      placeholder="Enter code"
                    />
                    <Button
                      onClick={applyPromoCode}
                      className="h-11 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>SubTotal</span> <span>${getSubTotal()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Shipping Fee</span> <span>${getShippingFee()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-4">
                  <span>Total</span>
                  <span>
                    $
                    {discountedTotal !== null
                      ? discountedTotal + getShippingFee()
                      : getTotal()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Billing Information</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full p-3 border rounded-md mb-4"
            />
            <Button
              onClick={handleCheckout}
              disabled={loading || orderPlaced}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-md"
            >
              {loading
                ? "Processing..."
                : orderPlaced
                  ? "Order Placed"
                  : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
