import React, { useState, useCallback } from "react";
import {
  Button,
  Collapsible,
  FormLayout,
  Frame,
  LegacyCard,
  LegacyStack,
  SkeletonThumbnail,
  TextField,
  Toast,
} from "@shopify/polaris";
import Variants from "./Variants";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useNavigate } from "@shopify/app-bridge-react";

function ProductCard({ product }) {
  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.body_html || "");
  const [showVariants, setShowVariants] = useState(false);
  const [variants, setVariants] = useState(product.variants || []);
  const [showToast, setShowToast] = useState(false);
  const [updating, setUpdating] = useState(false);

  const authenticatedFetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const toggleToast = useCallback(() => setShowToast((active) => !active), []);

  const toastMarkup = showToast ? (
    <Frame>
      <Toast content="Product Updated" onDismiss={toggleToast} />
    </Frame>
  ) : null;

  const handleViewInAdmin = () => {
    navigate(`https://admin.shopify.com/products/${product.id}`, {
      target: "new",
    });
  };

  const onProductUpdate = async () => {
    try {
      setUpdating(true);
      const updatedProduct = {
        id: product.id,
        title: title,
        description: description,
        variants: variants,
      };

      const response = await authenticatedFetch("/api/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        console.log("Product updated successfully");
        setUpdating(false);
        toggleToast();
      }
    } catch (error) {
      setUpdating(false);
      console.log("Error updating product | client side: ", error);
    }
  };

  const updateVariant = (id, price) => {
    setVariants((prev) => {
      const updatedVariants = prev.map((variant) => {
        if (variant.id === id) {
          return { ...variant, price };
        }
        return variant;
      });
      return updatedVariants;
    });
  };

  return (
    <>
      {toastMarkup}
      <LegacyCard
        sectioned
        primaryFooterAction={{
          content: updating ? "Updating the product..." : "Update Product",
          disabled: updating,
          onAction: onProductUpdate,
        }}
        secondaryFooterActions={[
          {
            content: "View in Admin",
            onAction: handleViewInAdmin,
          },
        ]}
      >
        <LegacyStack spacing="extraLoose">
          <LegacyStack.Item>
            {product.image != null ? (
              <img
                src={product.image.src}
                alt={title || product.image.alt}
                width="250"
              />
            ) : (
              <SkeletonThumbnail size="large" />
            )}
          </LegacyStack.Item>
          <LegacyStack.Item fill>
            <FormLayout>
              <TextField
                label="Product Name"
                value={title}
                onChange={setTitle}
                disabled={updating}
              />
              <TextField
                label="Product Description"
                multiline={4}
                value={description}
                onChange={setDescription}
                disabled={updating}
              />
              <Button onClick={() => setShowVariants((prev) => !prev)}>
                Show variants
              </Button>
              <Collapsible open={showVariants}>
                <Variants variants={variants} updateVariant={updateVariant} isUpdating={updating} />
              </Collapsible>
            </FormLayout>
          </LegacyStack.Item>
        </LegacyStack>
      </LegacyCard>
    </>
  );
}

export default ProductCard;
