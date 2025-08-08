import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

/**
 * A reusable, responsive product card.
 *
 * Props:
 * - product: { id, title, name, image, price, inStock?, stock?, variants?, sizes?, options? }
 * - to: string | undefined - route for details page (e.g., `/product/1`)
 * - onAddToCart: (productWithSelection) => void
 * - className: string | undefined - extra class names for the outer wrapper column (not the card)
 */
const ProductCard = ({
  product,
  to,
  onAddToCart,
  className = "col-md-4 col-sm-6 col-xs-8 col-12 mb-4",
}) => {
  const title = product?.title || product?.name || "Untitled";
  const price = product?.price ?? 0;

  const isInStock = useMemo(() => {
    if (typeof product?.inStock === "boolean") return product.inStock;
    if (typeof product?.stock === "number") return product.stock > 0;
    return true; // default to in stock if unknown
  }, [product]);

  const variantOptions = useMemo(() => {
    const variants = product?.variants || product?.sizes || product?.options;
    if (Array.isArray(variants) && variants.length > 0) return variants;
    return [];
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState(
    variantOptions[0] || null
  );

  const handleAddToCart = () => {
    if (!isInStock) return;
    if (typeof onAddToCart === "function") {
      const productWithSelection = { ...product, selectedVariant };
      onAddToCart(productWithSelection);
    }
  };

  return (
    <div className={className}>
      <div className="card product-card text-center h-100 border-0">
        <div className="position-relative product-card__media rounded-4">
          {product?.badge && (
            <span className="badge rounded-pill product-card__badge">
              {product.badge}
            </span>
          )}
          <img className="card-img-top p-3" src={product?.image} alt={title} />
          {!isInStock && (
            <span className="badge bg-secondary position-absolute product-card__oos">
              Out of Stock
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <div className="price-top text-start">${price}</div>
          <h5 className="card-title mb-1 text-start" title={title}>
            {title}
          </h5>
          {product?.description && (
            <p className="text-muted small text-start mb-3">
              {String(product.description).length > 70
                ? `${String(product.description).slice(0, 70)}...`
                : String(product.description)}
            </p>
          )}

          {variantOptions.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {variantOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`variant-chip ${
                    selectedVariant === opt ? "active" : ""
                  }`}
                  onClick={() => setSelectedVariant(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto d-flex gap-2 action-row">
            {to ? (
              <Link
                to={to}
                className="btn buy-btn action-btn"
                aria-label="Buy product"
              >
                Buy
              </Link>
            ) : (
              <button
                type="button"
                className="btn buy-btn action-btn"
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                Buy
              </button>
            )}
            <button
              className="btn btn-dark action-btn"
              disabled={!isInStock}
              onClick={handleAddToCart}
            >
              {isInStock ? "Add to cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
