"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HomeProducts.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";
import ProductChargesNote from "../ProductChargesNote/ProductChargesNote";
import { catalogProducts, featuredCatalogProducts, MINI_STOCK_PORTFOLIOS_NAME } from "../../data/catalogProducts";

interface HomeProductsProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
}

const productMeta: Record<
  string,
  { tagline: string; tierLabel: string }
> = {
  "Mutual Funds": {
    tagline: "Disciplined SIP wealth building for every earner",
    tierLabel: "Entry",
  },
  [MINI_STOCK_PORTFOLIOS_NAME]: {
    tagline: "Expert stock portfolios from India's finest managers",
    tierLabel: "Growth",
  },
  PMS: {
    tagline: "20–25 focused stocks, historically above-average returns vs mutual funds",
    tierLabel: "Elite",
  },
  AIF: {
    tagline: "Alternative alpha beyond public markets",
    tierLabel: "Ultra",
  },
};

const moreOfferings = catalogProducts.filter((product) => !product.featured);

export default function HomeProducts({ ref, onScrollDown }: HomeProductsProps) {
  const defaultProduct =
    featuredCatalogProducts.find((product) => product.highlight) ??
    featuredCatalogProducts[0];

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    featuredCatalogProducts.findIndex((product) => product.name === defaultProduct.name)
  );

  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;
  const activeProduct = featuredCatalogProducts[activeIndex] ?? defaultProduct;
  const meta = productMeta[activeProduct.name];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const current = activeRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [activeRef]);

  return (
    <section
      ref={activeRef}
      className={`${styles.section} ${isVisible ? styles.revealed : ""}`}
      id="products"
    >
      <div className={styles.glowOrb} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.headerCopy}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>Our Products</span>
            </div>
            <h2 className={styles.heading}>
              Climb the <span className={styles.goldText}>capital ladder</span>
            </h2>
            <p className={styles.subheading}>
              Four curated paths — from your first SIP to alternative investments.
              Pick your tier, explore the fit, then dive deeper on our products page.
            </p>
          </div>

          <Link href="/products" className={styles.catalogLink}>
            <span>Full catalog</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className={styles.ladder}>
          <div className={styles.ladderNodes} role="tablist" aria-label="Product tiers">
            {featuredCatalogProducts.map((product, idx) => {
              const isActive = idx === activeIndex;
              const nodeMeta = productMeta[product.name];

              return (
                <button
                  key={product.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.ladderNode} ${isActive ? styles.ladderNodeActive : ""} ${
                    product.highlight ? styles.ladderNodeFeatured : ""
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className={styles.nodeTier}>{nodeMeta.tierLabel}</span>
                  <span className={styles.nodeValue}>{product.value}</span>
                  <span className={styles.nodeName}>{product.name}</span>
                  {product.highlight && (
                    <span className={styles.nodeFlag}>Popular</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.spotlight} key={activeProduct.name}>
          <div className={styles.spotlightLeft}>
            <span className={styles.spotlightBadge}>{activeProduct.badge}</span>
            <p className={styles.spotlightValue}>{activeProduct.value}</p>
            <h3 className={styles.spotlightTitle}>{activeProduct.name}</h3>
            <p className={styles.spotlightTagline}>{meta.tagline}</p>

            <div className={styles.spotlightActions}>
              <Link
                href={activeProduct.slug ? `/products/${activeProduct.slug}` : "/products"}
                className={styles.primaryBtn}
              >
                Explore {activeProduct.name}
              </Link>
              <Link href="/products" className={styles.ghostBtn}>
                Compare all
              </Link>
            </div>
          </div>

          <div className={styles.spotlightRight}>
            <p className={styles.bulletsLabel}>What you get</p>
            <ul className={styles.bulletList}>
              {activeProduct.bullets.map((bullet) => (
                <li key={bullet} className={styles.bulletItem}>
                  <span className={styles.bulletIndex} aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.moreRow}>
          <span className={styles.moreLabel}>Also on GELD</span>
          <div className={styles.moreLinks}>
            {moreOfferings.map((product) => (
              <Link key={product.name} href="/products" className={styles.moreLink}>
                {product.name}
              </Link>
            ))}
          </div>
        </div>

        <ProductChargesNote />
      </div>

      {onScrollDown && (
        <div className={`${styles.scrollWrapper} scrollWrapperCentered`}>
          <ScrollButton onClick={onScrollDown} darkText={false} />
        </div>
      )}
    </section>
  );
}
