import {
  Layout,
  Page
} from "@shopify/polaris";
import ProductCard from "../components/ProductCard";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useEffect, useState } from "react";
import "../assets/sw-global.css";
import ProductList from "../components/ProductList";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const authenticatedFetch = useAuthenticatedFetch();

  const getProducts = async () => {
    try{
      setLoading(true);
      const response = await authenticatedFetch("/api/products", {
        method: "GET",
        ContentType: "application/json"
      })
      .then((response) => response.json())
      .then((data) => {
        if(data?.data) {
          setProducts(data.data);
        }else {
          setProducts([]);
        }
        setLoading(false);
      });
    } catch (error) {
      console.log("Error fetching products | client side", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
            <ProductList products={products} isLoading={loading} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
