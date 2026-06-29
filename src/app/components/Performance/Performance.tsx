"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Performance.module.css";
import ScrollButton from "../ScrollButton/ScrollButton";

interface PerformanceProps {
  ref?: React.RefObject<HTMLElement | null>;
  onScrollDown?: () => void;
  isSubpage?: boolean;
}

export default function Performance({ ref, onScrollDown }: PerformanceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const fallbackRef = useRef<HTMLElement>(null);
  const activeRef = ref || fallbackRef;

  const [metric, setMetric] = useState<"aum" | "yield">("aum");
  const [timeframe, setTimeframe] = useState<"5y" | "1y">("5y");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
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

  // Multi-dimensional financial data sets
  const chartData = {
    aum: {
      "5y": [
        { label: "2022", value: "$280M", x: 10, y: 80 },
        { label: "2023", value: "$450M", x: 70, y: 65 },
        { label: "2024", value: "$790M", x: 130, y: 48 },
        { label: "2025", value: "$1.1B", x: 190, y: 30 },
        { label: "2026", value: "$1.4B", x: 250, y: 15 }
      ],
      "1y": [
        { label: "Q1 26", value: "$1.15B", x: 10, y: 60 },
        { label: "Q2 26", value: "$1.22B", x: 70, y: 50 },
        { label: "Q3 26", value: "$1.30B", x: 130, y: 40 },
        { label: "Q4 26", value: "$1.36B", x: 190, y: 25 },
        { label: "Present", value: "$1.40B", x: 250, y: 15 }
      ]
    },
    yield: {
      "5y": [
        { label: "2022", value: "+14.8%", x: 10, y: 70 },
        { label: "2023", value: "+18.2%", x: 70, y: 55 },
        { label: "2024", value: "+21.5%", x: 130, y: 35 },
        { label: "2025", value: "+24.8%", x: 190, y: 20 },
        { label: "2026", value: "+26.4%", x: 250, y: 15 }
      ],
      "1y": [
        { label: "Q1 26", value: "+25.1%", x: 10, y: 55 },
        { label: "Q2 26", value: "+25.4%", x: 70, y: 45 },
        { label: "Q3 26", value: "+25.9%", x: 130, y: 35 },
        { label: "Q4 26", value: "+26.1%", x: 190, y: 25 },
        { label: "Present", value: "+26.4%", x: 250, y: 15 }
      ]
    }
  };

  const points = chartData[metric][timeframe];

  // Calculate bezier path
  let bezierPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const pPrev = points[i - 1];
    const pCurr = points[i];
    const cp1x = pPrev.x + (pCurr.x - pPrev.x) / 2;
    const cp1y = pPrev.y;
    const cp2x = pPrev.x + (pCurr.x - pPrev.x) / 2;
    const cp2y = pCurr.y;
    bezierPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pCurr.x} ${pCurr.y}`;
  }
  const areaPath = `${bezierPath} L 250 95 L 10 95 Z`;

  return (
    <section ref={activeRef} className={styles.section}>
      <div className={`${styles.container} ${isVisible ? styles.revealedContainer : ""}`}>
        <div className={styles.heroSection}>
          <h2 className={styles.title}>
            Performance & <span className={styles.goldText}>Metrics</span>
          </h2>
          <p className={styles.subtitle}>
            GELD maintains audited transparency on all yield payouts and capital reserves.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Chart Control Card */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${metric === "aum" ? styles.activeTab : ""}`}
                  onClick={() => setMetric("aum")}
                >
                  AUM Growth
                </button>
                <button
                  className={`${styles.tab} ${metric === "yield" ? styles.activeTab : ""}`}
                  onClick={() => setMetric("yield")}
                >
                  Yield Performance
                </button>
              </div>

              <div className={styles.timeframeTabs}>
                <button
                  className={`${styles.tTab} ${timeframe === "5y" ? styles.activeTTab : ""}`}
                  onClick={() => setTimeframe("5y")}
                >
                  5 Years
                </button>
                <button
                  className={`${styles.tTab} ${timeframe === "1y" ? styles.activeTTab : ""}`}
                  onClick={() => setTimeframe("1y")}
                >
                  1 Year
                </button>
              </div>
            </div>

            {/* Graphic Chart Wrapper */}
            <div className={styles.chartWrapper}>
              <svg viewBox="0 0 260 100" fill="none" className={styles.chartSvg} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(206, 149, 58, 0.22)" />
                    <stop offset="100%" stopColor="rgba(206, 149, 58, 0)" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="20" x2="260" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="260" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="260" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                <path d={areaPath} fill="url(#chartGrad)" />
                <path d={bezierPath} stroke="#CE953A" strokeWidth="1.5" strokeLinecap="round" />

                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="2.5" fill="#FEFE7B" stroke="#0c0c0c" strokeWidth="0.75" />
                    <text x={p.x} y={p.y - 6} className={styles.chartValText} textAnchor="middle">
                      {p.value}
                    </text>
                    <text x={p.x} y={92} className={styles.chartLabelText} textAnchor="middle">
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Performance Sidebar Stats */}
          <div className={styles.statsCard}>
            <div className={styles.statBox} style={{ transitionDelay: "100ms" }}>
              <span className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </span>
              <div>
                <h4 className={styles.statTitle}>Historical Yield</h4>
                <p className={styles.statValue}>+26.4% APY</p>
                <p className={styles.statMeta}>Consistent audit returns</p>
              </div>
            </div>

            <div className={styles.statBox} style={{ transitionDelay: "200ms" }}>
              <span className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>
              <div>
                <h4 className={styles.statTitle}>Asset Vault Custody</h4>
                <p className={styles.statValue}>100% Backed</p>
                <p className={styles.statMeta}>Fully liquid reserves</p>
              </div>
            </div>

            <div className={styles.statBox} style={{ transitionDelay: "300ms" }}>
              <span className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <div>
                <h4 className={styles.statTitle}>Audit Reports</h4>
                <p className={styles.statValue}>Quarterly Audited</p>
                <p className={styles.statMeta}>Verified by top global partners</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {onScrollDown && (
        <div className={styles.scrollWrapper}>
          <ScrollButton onClick={onScrollDown} />
        </div>
      )}
    </section>
  );
}
