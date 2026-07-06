"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Products.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";
import ProductChargesNote from "../ProductChargesNote/ProductChargesNote";
import { catalogProducts, MINI_STOCK_PORTFOLIOS_NAME } from "../../data/catalogProducts";

interface ProductsProps {
  mode?: "catalog" | "detail" | "all";
  defaultProduct?: ProductType;
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  [key: string]: any;
}

const PRODUCT_TYPES = [MINI_STOCK_PORTFOLIOS_NAME, "PMS", "AIF", "Mutual Funds"] as const;
type ProductType = (typeof PRODUCT_TYPES)[number];

export default function Products({ mode = "all", defaultProduct, ref, onScrollDown }: ProductsProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductType>(defaultProduct || MINI_STOCK_PORTFOLIOS_NAME);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const searchParams = useSearchParams();
  const selectParam = searchParams.get("select");

  // Sync active product when defaultProduct prop changes
  useEffect(() => {
    if (defaultProduct) {
      setActiveProduct(defaultProduct);
    }
  }, [defaultProduct]);

  // Sync active product from legacy query params if applicable
  useEffect(() => {
    if (selectParam) {
      const matched = PRODUCT_TYPES.find(
        (p) =>
          p.toLowerCase() === selectParam.toLowerCase() ||
          (selectParam.toLowerCase() === "iap" && p === MINI_STOCK_PORTFOLIOS_NAME)
      );
      if (matched) {
        setActiveProduct(matched as ProductType);
      }
    }
  }, [selectParam]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
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

  const goToContact = () => router.push("/contact");

  const selectProduct = (prod: ProductType) => {
    setIsDropdownOpen(false);
    
    if (mode === "detail" || mode === "catalog") {
      const slugMap: Record<ProductType, string> = {
        [MINI_STOCK_PORTFOLIOS_NAME]: "iap",
        PMS: "pms",
        AIF: "aif",
        "Mutual Funds": "mutual-funds",
      };
      router.push(`/products/${slugMap[prod]}`);
    } else {
      setActiveProduct(prod);
      document.getElementById("explorer-view")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const productData: Record<
    ProductType,
    {
      title: string;
      subtitle: string;
      paragraph: string;
      badge: string;
      primaryCta: string;
      secondaryCta: string;
      anchorId: string;
    }
  > = {
    [MINI_STOCK_PORTFOLIOS_NAME]: {
      title: "High Returns, Low Stress",
      subtitle:
        "Mini stock portfolios: India's Top Fund Managers, Known For Buffett-Like Returns",
      paragraph:
        "Starting at just ₹2 lakhs, your money is invested in a focused portfolio of 20-30 Best stocks—giving you expert management without the hassle of doing it yourself.",
      badge: MINI_STOCK_PORTFOLIOS_NAME,
      primaryCta: "Start My Portfolio Journey",
      secondaryCta: "Review My Portfolio Today",
      anchorId: "mini-stock-portfolios-section",
    },
    PMS: {
      title: "Why Settle For Average When You Can Have The Best?",
      subtitle: "PMS: Join the ranks of elite investors with our Portfolio Management Services",
      paragraph: "Experience the benefits of a focused, expertly managed portfolio. Tailored for high-growth capital with active risk hedges and institutional execution from India's finest AMCs.",
      badge: "Portfolio Management Services",
      primaryCta: "Start My PMS Journey",
      secondaryCta: "Review My Portfolio Today",
      anchorId: "pms-section"
    },
    AIF: {
      title: "Alternative Alpha, Maximum Leverage",
      subtitle: "AIF: Alternative Investment Funds for Sophisticated Yields",
      paragraph: "Access high-yield alternative opportunities including pre-IPO equity, structured debt, and commercial real estate starting at ₹1 Crore. Tailored for ultra-high-net-worth portfolios seeking non-correlated alpha.",
      badge: "Alternative Investment Fund",
      primaryCta: "Explore AIF Vaults",
      secondaryCta: "Consult AIF Advisor",
      anchorId: "aif-section"
    },
    "Mutual Funds": {
      title: "Diversification Simplified, Wealth Amplified",
      subtitle: "Direct Mutual Funds: Zero Commissions, Compounded Growth",
      paragraph: "A curated list of direct mutual funds across large, mid, and small-cap segments. Invest directly with zero-commission platforms to maximize your compound growth and simplify portfolio distribution.",
      badge: "Direct Mutual Funds",
      primaryCta: "View Direct Funds",
      secondaryCta: "Start a SIP Today",
      anchorId: "mutual-funds-section"
    }
  };

  // Partner AMCs for the orbital ring layout
  const amcPartners = ["Abakkus", "Renaissance", "Marathon", "Whiteoak", "Buoyant", "First Bridge", "Unifi", "MOSL"];

  return (
    <section ref={activeRef} className={`${styles.aboutSection} ${isVisible ? styles.revealed : ""}`} id="products-master">
      
      {/* 1. Centered Editorial Statement (Only shown in catalog or all mode) */}
      {(mode === "all" || mode === "catalog") && (
        <div className={styles.statementWrapper}>
          <div className={styles.aboutContainer}>
            <div className={styles.aboutBadge}>
              <span className={styles.aboutBadgeText}>Wealth Vaults</span>
            </div>
            <p className={styles.aboutText}>
              <span className={styles.serifItalic}>Precision instruments for capital expansion.</span>{" "}
              <span className={styles.fadeText}>Access high-yield multi-asset vaults, automated rebalancing algorithms,</span>{" "}
              <span className={styles.highlightText}>and tailored estate planning protocols designed to grow your assets across all classes.</span>{" "}
              <span className={styles.fadeText}>Bespoke financial engineering that turns ambition into legacy.</span>
            </p>
          </div>
        </div>
      )}

      {/* 2. Interactive Product Explorer with Dropdown (Only shown in detail or all mode) */}
      {(mode === "all" || mode === "detail") && (
        <div className={`${styles.explorerSection} ${mode === "detail" ? styles.detailModeView : ""}`}
        id="explorer-view">
          <div className={styles.explorerHeader}>
            <h3 className={styles.sectionTitle}>Explore Our <span className={styles.goldText}>Offerings</span></h3>
            
            {/* Custom Luxury Dropdown */}
            <div className={styles.dropdownContainer}>
              <button 
                className={styles.dropdownBtn}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                id="product-dropdown-trigger"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span>{activeProduct}</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.arrowOpen : ""}`}>
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className={styles.dropdownMenu} role="listbox" aria-labelledby="product-dropdown-trigger">
                  {PRODUCT_TYPES.map((prod) => (
                    <li 
                      key={prod} 
                      className={`${styles.dropdownItem} ${activeProduct === prod ? styles.dropdownItemActive : ""}`}
                      onClick={() => selectProduct(prod)}
                      role="option"
                      aria-selected={activeProduct === prod}
                    >
                      {prod}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Selected Product Card Container */}
          <div className={styles.explorerContentCard} id={productData[activeProduct].anchorId}>
            <div className={styles.explorerLeft}>
              <span className={styles.productBadge}>{productData[activeProduct].badge}</span>
              <h4 className={styles.productTitle}>
                {productData[activeProduct].title.split(" ").map((word, i) => {
                  if (word.toLowerCase() === "returns," || word.toLowerCase() === "best?") {
                    return <span key={i} className={styles.goldText}>{word} </span>;
                  }
                  return word + " ";
                })}
              </h4>
              <p className={styles.productSubtitle}>{productData[activeProduct].subtitle}</p>
              <p className={styles.productDesc}>{productData[activeProduct].paragraph}</p>
              
              <div className={styles.productActions}>
                <button type="button" className={styles.primaryCtaBtn} onClick={goToContact}>
                  {productData[activeProduct].primaryCta}
                </button>
                <button type="button" className={styles.secondaryCtaBtn} onClick={goToContact}>
                  {productData[activeProduct].secondaryCta}
                </button>
              </div>
            </div>

            <div className={styles.explorerRight}>
              {activeProduct === MINI_STOCK_PORTFOLIOS_NAME && (
                /* High-end structured asset-class grid cards representation for IAP */
                <div className={styles.aifAssetGrid}>
                  <div className={`${styles.assetBlock} ${styles.goldGlow}`}>
                    <span className={styles.blockVal}>₹2 Lakhs+</span>
                    <span className={styles.blockLbl}>Minimum Ticket</span>
                  </div>
                  <div className={styles.assetBlock}>
                    <span className={styles.blockVal}>20-30</span>
                    <span className={styles.blockLbl}>Curated Best Stocks</span>
                  </div>
                  <div className={styles.assetBlock}>
                    <span className={styles.blockVal}>Active</span>
                    <span className={styles.blockLbl}>Expert Rebalancing</span>
                  </div>
                </div>
              )}

              {activeProduct === "PMS" && (
                /* High-end structured asset-class grid cards representation for PMS */
                <div className={styles.aifAssetGrid}>
                  <div className={`${styles.assetBlock} ${styles.goldGlow}`}>
                    <span className={styles.blockVal}>₹50 Lakhs+</span>
                    <span className={styles.blockLbl}>Minimum Ticket</span>
                  </div>
                  <div className={styles.assetBlock}>
                    <span className={styles.blockVal}>Bespoke</span>
                    <span className={styles.blockLbl}>Tailored Portfolios</span>
                  </div>
                  <div className={styles.assetBlock}>
                    <span className={styles.blockVal}>Institutional</span>
                    <span className={styles.blockLbl}>AMC Execution</span>
                  </div>
                </div>
              )}

              {activeProduct === "AIF" && (
                /* High-end structured asset-class grid cards representation */
                <div className={styles.aifAssetGrid}>
                  <div className={`${styles.assetBlock} ${styles.goldGlow}`}>
                    <span className={styles.blockVal}>₹1 Cr+</span>
                    <span className={styles.blockLbl}>Minimum Ticket</span>
                  </div>
                  <div className={styles.assetBlock}>
                    <span className={styles.blockVal}>Pre-IPO</span>
                    <span className={styles.blockLbl}>Unlisted Equity</span>
                  </div>
                  <div className={styles.assetBlock}>
                    <span className={styles.blockVal}>Debt</span>
                    <span className={styles.blockLbl}>Structured Yield</span>
                  </div>
                </div>
              )}

              {activeProduct === "Mutual Funds" && (
                /* Growth curve / compounding visual representation */
                <div className={styles.growthChartVisual}>
                  <div className={styles.growthBar} style={{ height: "40%", animationDelay: "0.1s" }}><span className={styles.barLabel}>SIP</span></div>
                  <div className={styles.growthBar} style={{ height: "65%", animationDelay: "0.2s" }}><span className={styles.barLabel}>Direct</span></div>
                  <div className={`${styles.growthBar} ${styles.goldBar}`} style={{ height: "90%", animationDelay: "0.3s" }}><span className={styles.barLabel}>Compound</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom call strip */}
          <div className={styles.callStrip}>
            <span className={styles.callText}>Call Our Wealth Managers Now!</span>
            <button type="button" className={styles.callBtn} onClick={goToContact}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={styles.phoneIcon}>
                <path d="M20 22.622l-8-5.32c-3.197-2.128-5.457-4.457-7.585-7.585l-5.32-8h5.604c.966 0 1.75.79 1.75 1.764v2.476c0 .966-.784 1.75-1.75 1.75h-.622c.962 1.62 1.47 3.197 1.47 4.757 0 5.293 4.299 9.593 9.591 9.596v-.622c0-.966.784-1.75 1.75-1.75h2.476c.966 0 1.75.784 1.75 1.75v5.604z"/>
              </svg>
              <span>Schedule an Expert Call</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Full Products Grid (Only shown in catalog or all mode) */}
      {(mode === "all" || mode === "catalog") && (
        <div className={styles.gridSection} id="products-catalog">
          <div className={styles.gridHeader}>
            <h3 className={styles.gridSectionTitle}>
              Start From <span className={styles.goldText}>Where You Are</span>
            </h3>
          </div>

          <div className={styles.grid}>
            {catalogProducts.map((p, idx) => (
              <article 
                key={idx} 
                className={`${styles.catalogCard} ${p.highlight ? styles.catalogCardHighlight : ""}`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                {/* Top Badge & Icon */}
                <div className={styles.catalogCardTop}>
                  <div className={styles.catalogCardIconWrapper}>
                    {p.iconType === "crown" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.catalogIcon}>
                        <path d="M12 2l3 6 7 1-5 4.87 1.18 6.88L12 17.5l-6.18 3.25L7 13.87 2 9l7-1z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={styles.catalogIcon}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                        <path d="M12 6v12M8 12h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className={styles.catalogMeta}>
                  <h4 className={styles.catalogTitle}>{p.name}</h4>
                  {p.badge && <span className={styles.catalogSubbadge}>{p.badge}</span>}
                  {p.value && <p className={styles.catalogValue}>{p.value}</p>}
                </div>

                <button 
                  className={styles.catalogCtaBtn}
                  onClick={() => {
                    if (p.slug) {
                      router.push(`/products/${p.slug}`);
                    } else {
                      router.push("/contact");
                    }
                  }}
                  aria-label={`Know more about ${p.name}`}
                >
                  Know more
                </button>

                <div className={styles.catalogDivider}></div>

                {/* Bullets List with Gold Checkmarks */}
                <ul className={styles.catalogBullets}>
                  {p.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className={styles.catalogBulletItem}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.checkmarkIcon}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <ProductChargesNote />
        </div>
      )}

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} darkText={false} />
        </div>
      )}
    </section>
  );
}
