"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Products.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";
import ProductChargesNote from "../ProductChargesNote/ProductChargesNote";
import PmsCarousel from "../PmsCarousel/PmsCarousel";
import { catalogProducts, MINI_STOCK_PORTFOLIOS_NAME } from "../../data/catalogProducts";
import { PMS_RETURN_RANGE } from "../../data/pmsData";
import {
  CATALOG_CONTACT_INTENT,
  contactPageHref,
  DEFAULT_CONTACT_INTENT,
  persistContactIntent,
  PRODUCT_REVIEW_INTENT,
  PRODUCT_TYPE_INTENT,
} from "../../lib/contactContext";

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
  const isSubpage = mode === "catalog" || mode === "detail";
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
          ((selectParam.toLowerCase() === "iap" || selectParam.toLowerCase() === "mini-stock-portfolio") && p === MINI_STOCK_PORTFOLIOS_NAME)
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

  const goToContact = (intent?: string) => {
    const resolvedIntent =
      (typeof intent === "string" ? intent : undefined) ||
      PRODUCT_TYPE_INTENT[activeProduct] ||
      DEFAULT_CONTACT_INTENT;
    persistContactIntent(resolvedIntent);
    router.push(contactPageHref(resolvedIntent));
  };

  const selectProduct = (prod: ProductType) => {
    setIsDropdownOpen(false);
    
    if (mode === "detail" || mode === "catalog") {
      const slugMap: Record<ProductType, string> = {
        [MINI_STOCK_PORTFOLIOS_NAME]: "mini-stock-portfolio",
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
      secondaryCta?: string;
      anchorId: string;
    }
  > = {
    [MINI_STOCK_PORTFOLIOS_NAME]: {
      title: "High Returns, Low Stress",
      subtitle:
        "Mini stock portfolios: India's Top Fund Managers, Known For Buffett-Like Returns",
      paragraph:
        "Starting at just ₹2.5 lakhs, your money is invested in a focused portfolio of 20 to 30 best stocks, giving you expert management without the hassle of doing it yourself.",
      badge: MINI_STOCK_PORTFOLIOS_NAME,
      primaryCta: "Start My Portfolio Journey",
      secondaryCta: "Review My Portfolio Today",
      anchorId: "mini-stock-portfolios-section",
    },
    PMS: {
      title: "Why Settle For Average When You Can Have The Best?",
      subtitle: "PMS: Concentrated conviction, professionally managed for superior growth",
      paragraph:
        "While mutual funds spread across 100+ stocks, PMS invests in just 20 to 25 handpicked companies, focused and not over-diversified, so your portfolio fully benefits from each high-conviction pick.",
      badge: "Portfolio Management Services",
      primaryCta: "Start My PMS Journey",
      secondaryCta: "Review My Portfolio Today",
      anchorId: "pms-section"
    },
    AIF: {
      title: "Alternative Alpha, Maximum Leverage",
      subtitle: "AIF: Alternative Investment Funds for Sophisticated Yields",
      paragraph:"Who makes the biggest returns after a business owner? Private equity investors who invest before the IPO. Our AIF partners invest in high quality companies before they go public, giving you access to the same growth opportunity. No IPO allotment uncertainty. Just long term value creation until the IPO exit. This opportunity is designed for sophisticated investors. Minimum investment: ₹1 crore as per SEBI guidelines. AIF investments are subject to market and liquidity risks. Please read all offer documents carefully before investing.",
      // paragraph: "Access high-yield alternative opportunities including pre-IPO equity, structured debt, and commercial real estate starting at ₹1 Crore. Tailored for ultra-high-net-worth portfolios seeking non-correlated alpha.",
      badge: "Alternative Investment Fund",
      primaryCta: "Explore AIF Vaults",
      secondaryCta: "Consult AIF Advisor",
      anchorId: "aif-section"
    },
    "Mutual Funds": {
      title: "Diversification Simplified, Wealth Amplified",
      subtitle: "Mutual Funds: Curated Schemes, Compounded Growth",
      paragraph:
        "Most people own too many schemes and think too little about which ones. At Geld, we do it differently. Three to four carefully selected schemes. Right allocation for your age. Fund managers we actually believe in. And a fund size filter that most advisers never think about. Because a well-chosen SIP in the right three funds beats a cluttered portfolio of fifteen every single time. Minimum investment: Rs 500 per month.",
      badge: "Mutual Funds",
      primaryCta: "Start a SIP Today",
      anchorId: "mutual-funds-section"
    }
  };

  return (
    <section ref={activeRef} className={`${styles.aboutSection} ${isVisible ? styles.revealed : ""}`} id="products-master">
      
      {/* 1. Centered Editorial Statement (Only shown in catalog or all mode) */}
      {(mode === "all" || mode === "catalog") && (
        <div className={`${styles.statementWrapper} ${isSubpage ? styles.statementWrapperSubpage : ""}`}>
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
                <button
                  type="button"
                  className={styles.primaryCtaBtn}
                  onClick={() => goToContact(PRODUCT_TYPE_INTENT[activeProduct])}
                >
                  {productData[activeProduct].primaryCta}
                </button>
                {productData[activeProduct].secondaryCta ? (
                  <button
                    type="button"
                    className={styles.secondaryCtaBtn}
                    onClick={() =>
                      goToContact(
                        PRODUCT_REVIEW_INTENT[activeProduct] || PRODUCT_TYPE_INTENT[activeProduct]
                      )
                    }
                  >
                    {productData[activeProduct].secondaryCta}
                  </button>
                ) : null}
              </div>
            </div>

            <div className={styles.explorerRight}>
              {activeProduct === "PMS" && (
                <div className={styles.pmsRightStack}>
                  <div className={styles.pmsCompareColumn}>
                    <div className={`${styles.pmsCompareCard} ${styles.pmsCompareCardHighlight}`}>
                      <span className={styles.pmsCompareLabel}>PMS</span>
                      <span className={styles.pmsCompareVal}>20 to 25 stocks</span>
                      <span className={styles.pmsCompareNote}>Handpicked by fund managers</span>
                    </div>
                  </div>

                  <div className={styles.pmsPerfGrid}>
                    <div className={`${styles.assetBlock} ${styles.goldGlow}`}>
                      <span className={styles.blockVal}>{PMS_RETURN_RANGE.sinceInception}</span>
                      <span className={styles.blockLbl}>Since Inception Returns</span>
                    </div>
                    <div className={styles.assetBlock}>
                      <span className={styles.blockVal}>{PMS_RETURN_RANGE.threeYearRolling}</span>
                      <span className={styles.blockLbl}>Avg. Rolling 3Y Returns</span>
                    </div>
                    <div className={styles.assetBlock}>
                      <span className={styles.blockVal}>₹50 Lakhs+</span>
                      <span className={styles.blockLbl}>Minimum Ticket</span>
                    </div>
                  </div>
                </div>
              )}

              {activeProduct === MINI_STOCK_PORTFOLIOS_NAME && (
                <div className={styles.productPerfChart}>
                  <h4 className={styles.chartMiniTitle}>Returns since Inception (Dec 2020)</h4>
                  <div className={styles.chartCanvas}>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Bluechip High Growth Strategy</div>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.strategyBar}`} style={{ width: "95%" }}>
                          <span className={styles.barValue2}>+325.63%</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Nifty 500 Index</div>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.benchmarkBar}`} style={{ width: "35%" }}>
                          <span className={styles.barValue}>+99.53%</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.barRow}>
                      <div className={styles.barLabel}>Nifty 50 Index</div>
                      <div className={styles.barTrack}>
                        <div className={`${styles.barFill} ${styles.benchmarkBar}`} style={{ width: "27%" }}>
                          <span className={styles.barValue}>+71.13%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={styles.chartMiniFooter}>* Returns as on 30th May 2026. Gross returns.</span>
                </div>
              )}

              {activeProduct === "AIF" && (
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
                  <div className={styles.growthBar} style={{ height: "40%", animationDelay: "0.1s" }}>
                    <span className={styles.growthBarLabel}>SIP</span>
                  </div>
                  <div className={styles.growthBar} style={{ height: "65%", animationDelay: "0.2s" }}>
                    <span className={styles.growthBarLabel}>Curated</span>
                  </div>
                  <div className={`${styles.growthBar} ${styles.goldBar}`} style={{ height: "90%", animationDelay: "0.3s" }}>
                    <span className={styles.growthBarLabel}>Compound</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeProduct === "PMS" && <PmsCarousel />}

          {/* Bottom call strip */}
          <div className={styles.callStrip}>
            <span className={styles.callText}>Call Our Wealth Managers Now!</span>
            <button type="button" className={styles.callBtn} onClick={() => goToContact("expert-call")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.phoneIcon}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
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
                      const catalogIntent =
                        CATALOG_CONTACT_INTENT[p.name] || DEFAULT_CONTACT_INTENT;
                      persistContactIntent(catalogIntent);
                      router.push(contactPageHref(catalogIntent));
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
