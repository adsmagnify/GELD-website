"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Performance.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface PerformanceProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
  [key: string]: any;
}

type PeriodType = "Inception" | "3Yr" | "1Yr" | "6M" | "3M" | "1M";

export default function Performance({ ref, onScrollDown, isSubpage }: PerformanceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("Inception");
  
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

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

  // Performance data from the document
  const returnsData = {
    Inception: [
      { name: "Bluechip Strategy", value: 325.63, isStrategy: true },
      { name: "Nifty 750 Total Market", value: 103.29, isStrategy: false },
      { name: "Nifty 500 Index", value: 99.53, isStrategy: false },
      { name: "Nifty 50 Index", value: 71.13, isStrategy: false }
    ],
    "3Yr": [
      { name: "Bluechip Strategy", value: 145.39, isStrategy: true },
      { name: "Nifty 750 Total Market", value: 45.12, isStrategy: false },
      { name: "Nifty 500 Index", value: 43.70, isStrategy: false },
      { name: "Nifty 50 Index", value: 27.05, isStrategy: false }
    ],
    "1Yr": [
      { name: "Bluechip Strategy", value: 18.56, isStrategy: true },
      { name: "Nifty 750 Total Market", value: -0.57, isStrategy: false },
      { name: "Nifty 500 Index", value: -0.64, isStrategy: false },
      { name: "Nifty 50 Index", value: -4.86, isStrategy: false }
    ],
    "6M": [
      { name: "Bluechip Strategy", value: 13.58, isStrategy: true },
      { name: "Nifty 750 Total Market", value: -5.04, isStrategy: false },
      { name: "Nifty 500 Index", value: -5.33, isStrategy: false },
      { name: "Nifty 50 Index", value: -10.13, isStrategy: false }
    ],
    "3M": [
      { name: "Bluechip Strategy", value: 14.46, isStrategy: true },
      { name: "Nifty 750 Total Market", value: -1.72, isStrategy: false },
      { name: "Nifty 500 Index", value: -2.20, isStrategy: false },
      { name: "Nifty 50 Index", value: -6.48, isStrategy: false }
    ],
    "1M": [
      { name: "Bluechip Strategy", value: 7.61, isStrategy: true },
      { name: "Nifty 750 Total Market", value: 0.01, isStrategy: false },
      { name: "Nifty 500 Index", value: -0.12, isStrategy: false },
      { name: "Nifty 50 Index", value: -1.87, isStrategy: false }
    ]
  };

  const activeBars = returnsData[selectedPeriod];

  // Helper to find min/max values to calculate relative height/widths
  const maxVal = Math.max(...activeBars.map(b => Math.abs(b.value)), 100);

  return (
    <section ref={activeRef} className={`${styles.aboutSection} ${isVisible ? styles.revealed : ""}`} id="performance-view">
      
      {/* 1. Centered Editorial Statement (Same formatting as About Us) */}
      <div className={`${styles.statementWrapper} ${isSubpage ? styles.statementWrapperSubpage : ""}`}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutBadge}>
            <span className={styles.aboutBadgeText}>Performance Track Record</span>
          </div>
          <p className={styles.aboutText}>
            <span className={styles.serifItalic}>Consistent outperformance is not a coincidence.</span>{" "}
            <span className={styles.fadeText}>By tracking shift dynamics and active risk hedges,</span>{" "}
            <span className={styles.highlightText}>our multi-cap portfolios have consistently outperformed key equity benchmarks since inception.</span>{" "}
            <span className={styles.fadeText}>Review our audited monthly statements and historical yield metrics.</span>
          </p>
        </div>
      </div>

      {/* 2. Graphical Performance Section */}
      <div className={styles.dashboardContainer}>
        
        {/* Left Side: Custom Interactive Bar Chart */}
        <div className={styles.chartBlock}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Managed Portfolio vs <span className={styles.goldText}>Benchmarks</span></h3>
            <div className={styles.periodTabs}>
              {(["Inception", "3Yr", "1Yr", "6M", "3M", "1M"] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  className={`${styles.tabBtn} ${selectedPeriod === p ? styles.tabBtnActive : ""}`}
                  onClick={() => setSelectedPeriod(p)}
                >
                  {p === "Inception" ? "Since Inception" : p === "3Yr" ? "3 Year" : p === "1Yr" ? "1 Year" : p}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Graphics */}
          <div className={styles.chartCanvas}>
            {activeBars.map((bar, i) => {
              // Calculate width percentage relative to max absolute value
              const widthPct = (Math.abs(bar.value) / maxVal) * 80; // scale to 80% max
              const isNegative = bar.value < 0;

              return (
                <div key={i} className={styles.barRow}>
                  <div className={styles.barLabel}>{bar.name}</div>
                  <div className={styles.barTrack}>
                    <div 
                      className={`${styles.barFill} ${bar.isStrategy ? styles.strategyBar : isNegative ? styles.negativeBar : styles.benchmarkBar}`}
                      style={{ 
                        width: `${widthPct}%`,
                        transform: `scaleX(1)`
                      }}
                    >
                      <span className={styles.barValue}>{bar.value > 0 ? `+${bar.value}%` : `${bar.value}%`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={styles.chartNote}>* Gross Returns calculated as on 30th May 2026. Inception Date: 18 Dec 2020.</p>
        </div>

        {/* Right Side: Key Portfolio & Volatility Metrics Dashboard */}
        <div className={styles.metricsBlock}>
          <h3 className={styles.metricsTitle}>Strategy <span className={styles.goldText}>Parameters</span></h3>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>34.88%</span>
              <span className={styles.metricLbl}>3 Year CAGR</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>1.75</span>
              <span className={styles.metricLbl}>Treynor Ratio</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>0.84</span>
              <span className={styles.metricLbl}>Sharpe Ratio</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>1.09</span>
              <span className={styles.metricLbl}>Beta vs Nifty</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>0.81</span>
              <span className={styles.metricLbl}>Portfolio PEG</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>35.30%</span>
              <span className={styles.metricLbl}>Sales Growth YoY</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>53.89%</span>
              <span className={styles.metricLbl}>Profit Growth YoY</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricVal}>25 Stocks</span>
              <span className={styles.metricLbl}>Portfolio Size</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Data Table (SEBI Compliance) */}
      <div className={styles.tableSection}>
        <h3 className={styles.tableTitle}>Historical <span className={styles.goldText}>Performance Matrix</span></h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Strategy / Index Name</th>
                <th>Inception (18 Dec 2020)</th>
                <th>3 Year</th>
                <th>1 Year</th>
                <th>6 Month</th>
                <th>3 Month</th>
                <th>1 Month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tableHighlight}>Bluechip High Growth Strategy</td>
                <td>325.63%</td>
                <td>145.39%</td>
                <td>18.56%</td>
                <td>13.58%</td>
                <td>14.46%</td>
                <td>7.61%</td>
              </tr>
              <tr>
                <td>Nifty 750 Total Market</td>
                <td>103.29%</td>
                <td>45.12%</td>
                <td>-0.57%</td>
                <td>-5.04%</td>
                <td>-1.72%</td>
                <td>0.01%</td>
              </tr>
              <tr>
                <td>Nifty 500 Index</td>
                <td>99.53%</td>
                <td>43.70%</td>
                <td>-0.64%</td>
                <td>-5.33%</td>
                <td>-2.20%</td>
                <td>-0.12%</td>
              </tr>
              <tr>
                <td>Nifty 50 Index</td>
                <td>71.13%</td>
                <td>27.05%</td>
                <td>-4.86%</td>
                <td>-10.13%</td>
                <td>-6.48%</td>
                <td>-1.87%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SEBI Regulatory & Fund Manager details */}
      <div className={styles.sebiSection}>
        <div className={styles.sebiGrid}>
          {/* <div className={styles.sebiBlock}>
            <h4>Fund Manager Details</h4>
            <p><strong>Manager:</strong> Mr. Shailesh Saraf</p>
            <p>Managing Director - Dynamic Equities Pvt Limited. Certification on Value Investing from Columbia University. Over 25 Years of institutional market experience.</p>
          </div> */}
          <div className={styles.sebiBlock}>
            <h4>Registered Address</h4>
            <p><strong>Dynamic Equities Pvt. Ltd</strong></p>
            <p>Technopolis, 14th Floor, Plot No. BP-4, Sector V, Salt Lake, Kolkata- 700091</p>
            <p><strong>SEBI Reg No:</strong> INA300002022 | <strong>BASL Member ID:</strong> BASL1505</p>
          </div>
          <div className={styles.sebiBlock}>
            <h4>Grievance Redressal</h4>
            <p><strong>Principal Officer:</strong> Rishav Roy (Contact: 8240771478)</p>
            <p><strong>Compliance Officer:</strong> Mr. Jibachh Prasad (Contact: 9874421921)</p>
          </div>
        </div>

        <div className={styles.disclaimerText}>
          <p><strong>STANDARD WARNING:</strong> Investment in securities market is subject to market risks. Read all the related documents carefully before investing.</p>
          <p><strong>DISCLAIMER:</strong> The performance data presented herein are not verified by Past Risk and Return Verification Agency (PaRRVA) or any other agency recognized by SEBI for this purpose. Past performance is no guarantee of future results.</p>
        </div>
      </div>

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} darkText={false} />
        </div>
      )}
    </section>
  );
}
