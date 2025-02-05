// "use client";
// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import ProductDetailHeader from "@/components/ProductDetailHeader";
// import TopBar from "@/components/TopBar";
// import Brand from "@/components/Brand";
// import ClubBenefits from "@/components/ClubBenefits";
// import Footer2 from "@/components/Footer2";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import Likes from "@/components/Like";

// // Product type definition
// type Product = {
//   slug: {
//     current: string;
//   };
//   name: string;
//   price: number;
//   image?: { asset: any };
//   description?: string;
//   features?: string[];
//   quantity?: number;
//   dimensions?: { height: string; width: string; depth: string };
// };

// // Function to fetch the product based on the slug
// async function fetchProduct(slug: string): Promise<Product | null> {
//   try {
//     return await client.fetch(
//       `*[_type == "product" && slug.current == $slug][0]`,
//       { slug }
//     );
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return null;
//   }
// }

// const ProductPage = ({ params }: { params: { slug: string } }) => {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [cart, setCart] = useState<Product[]>([]);

//   // Fetch product data on mount
//   useEffect(() => {
//     const getProduct = async () => {
//       const data = await fetchProduct(params.slug);
//       if (!data) {
//         notFound();
//       }
//       setProduct(data);
//       setLoading(false);
//     };
//     getProduct();
//   }, [params.slug]);

//   // Fetch cart from localStorage on initial load
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   // Add product to cart
//   const addToCart = (product: Product) => {
//     const updatedCart = [...cart, product];

//     // Store updated cart in localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("cart", JSON.stringify(updatedCart));
//     }

//     // Update cart state
//     setCart(updatedCart);
//   };

//   if (loading) {
//     return <div className="text-center text-lg p-10">Loading...</div>;
//   }

//   if (!product) {
//     return notFound();
//   }

//   return (
//     <div>
//       <TopBar />
//       <ProductDetailHeader />

//       <div className="max-w-screen-xl mx-auto px-4 pt-8">
//         <div className="flex flex-col md:flex-row items-center md:items-start">
//           {/* Product Image (Left Side) */}
//           <div className="flex-shrink-0 mb-6 md:mb-0 md:w-1/2">
//             {product.image && (
//               <Image
//                 src={urlFor(product.image.asset).width(600).height(400).url()}
//                 alt={product.name}
//                 width={600}
//                 height={400}
//                 className="object-cover rounded-lg"
//               />
//             )}
//           </div>

//           {/* Product Info Section (Right Side) */}
//           <div className="md:w-1/2 md:pl-8 space-y-6">
//             <h1 className="text-3xl font-semibold">{product.name}</h1>
//             <p className="text-gray-600">{product.description}</p>

//             {/* Product Features */}
//             <div className="mt-4">
//               <h3 className="font-semibold">Features:</h3>
//               <ul className="list-disc pl-6 text-sm text-gray-600">
//                 {product.features?.map((feature, index) => (
//                   <li key={index}>{feature}</li>
//                 ))}
//               </ul>
//             </div>

//             {/* Quantity & Availability */}
//             <div className="mt-4">
//               <p className="font-semibold">
//                 Quantity:{" "}
//                 {product.quantity && product.quantity > 0
//                   ? product.quantity
//                   : "Out of Stock"}
//               </p>
//             </div>

//             {/* Product Dimensions */}
//             <div className="mt-3">
//               <h3 className="font-semibold">Dimensions:</h3>
//               <p className="text-sm">
//                 Height: {product.dimensions?.height} | Width:{" "}
//                 {product.dimensions?.width} | Depth: {product.dimensions?.depth}
//               </p>
//             </div>

//             <div className="flex justify-between">
//               <p className="text-lg font-medium">${product.price}</p>

//               <Button
//                 disabled={product.quantity === 0}
//                 className="mt-2 py-4 px-5 bg-[#2A254B] text-white disabled:opacity-50"
//                 onClick={() => addToCart(product)} // Add to cart functionality
//               >
//                 {product.quantity && product.quantity > 0
//                   ? "Add to Cart"
//                   : "Out of Stock"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Likes />
//       <Brand />
//       <ClubBenefits />
//       <Footer2 />
//     </div>
//   );
// };

// export default ProductPage;


"use client";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductDetailHeader from "@/components/ProductDetailHeader";
import TopBar from "@/components/TopBar";
import Brand from "@/components/Brand";
import ClubBenefits from "@/components/ClubBenefits";
import Footer2 from "@/components/Footer2";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Likes from "@/components/Like";

// Image Asset type definition
type ImageAsset = {
  _id: string;
  _type: string;
  url: string;
  width: number;
  height: number;
};

// Product type definition with updated image field
type Product = {
  slug: {
    current: string;
  };
  name: string;
  price: number;
  image?: {
    asset: ImageAsset;
  };
  description?: string;
  features?: string[];
  quantity?: number;
  dimensions?: { height: string; width: string; depth: string };
};

// Function to fetch the product based on the slug
async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    return await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]`,
      { slug }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

const ProductPage = ({ params }: { params: { slug: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);

  // Fetch product data on mount
  useEffect(() => {
    const getProduct = async () => {
      const data = await fetchProduct(params.slug);
      if (!data) {
        notFound();
      }
      setProduct(data);
      setLoading(false);
    };
    getProduct();
  }, [params.slug]);

  // Fetch cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Add product to cart
  const addToCart = (product: Product) => {
    const updatedCart = [...cart, product];

    // Store updated cart in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    // Update cart state
    setCart(updatedCart);
  };

  if (loading) {
    return <div className="text-center text-lg p-10">Loading...</div>;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <TopBar />
      <ProductDetailHeader />

      <div className="max-w-screen-xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Product Image (Left Side) */}
          <div className="flex-shrink-0 mb-6 md:mb-0 md:w-1/2">
            {product.image && product.image.asset && (
              <Image
                src={urlFor(product.image.asset).width(600).height(400).url()}
                alt={product.name}
                width={600}
                height={400}
                className="object-cover rounded-lg"
              />
            )}
          </div>

          {/* Product Info Section (Right Side) */}
          <div className="md:w-1/2 md:pl-8 space-y-6">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>

            {/* Product Features */}
            <div className="mt-4">
              <h3 className="font-semibold">Features:</h3>
              <ul className="list-disc pl-6 text-sm text-gray-600">
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Quantity & Availability */}
            <div className="mt-4">
              <p className="font-semibold">
                Quantity:{" "}
                {product.quantity && product.quantity > 0
                  ? product.quantity
                  : "Out of Stock"}
              </p>
            </div>

            {/* Product Dimensions */}
            <div className="mt-3">
              <h3 className="font-semibold">Dimensions:</h3>
              <p className="text-sm">
                Height: {product.dimensions?.height} | Width:{" "}
                {product.dimensions?.width} | Depth: {product.dimensions?.depth}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-lg font-medium">${product.price}</p>

              <Button
                disabled={product.quantity === 0}
                className="mt-2 py-4 px-5 bg-[#2A254B] text-white disabled:opacity-50"
                onClick={() => addToCart(product)} // Add to cart functionality
              >
                {product.quantity && product.quantity > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Likes />
      <Brand />
      <ClubBenefits />
      <Footer2 />
    </div>
  );
};

export default ProductPage;
