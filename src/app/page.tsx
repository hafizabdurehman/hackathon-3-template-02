"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Brand from "@/components/Brand";
import Ceremics from "@/components/Ceremics";
import Products from "@/components/Products";
import ClubBenefits from "@/components/ClubBenefits";
import Touch from "@/components/Touch";
import Footer from "@/components/Footer";

type Product = {
  slug: {
    current: string;
  };
  name: string;
  price: number;
  imageUrl: string;
};

export default function Home() {
  const [cart, setCart] = useState<Product[]>([]);

  // Fetch cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <Brand />
      <Ceremics cart={cart} setCart={setCart} />
      <Products cart={cart} setCart={setCart} />
      <ClubBenefits />
      <Touch />
      <Footer />
    </div>
  );
}
