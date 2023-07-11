import { EmptyState, Layout, Spinner, LegacyCard } from "@shopify/polaris";
import React from "react";
import ProductCard from "./ProductCard";

function ProductList({ products, isLoading }) { 
  if (isLoading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Spinner
              accessibilityLabel="Loading Spiner"
              size="large"
              color="teal"
            />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {products.length > 0 ? (
        products.map((product, index) => (
          <Layout.Section key={index}>
            <ProductCard product={product} />
          </Layout.Section>
        ))
      ) : (
        <Layout.Section>
          <LegacyCard>
            <EmptyState
              heading="No products found"
              image="../assets/empty-state.svg"
            >
              <p>Looks like you haven't added any products yet.</p>
            </EmptyState>
          </LegacyCard>
        </Layout.Section>
      )}
    </Layout>
  );
}

export default ProductList;
