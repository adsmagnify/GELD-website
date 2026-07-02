"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  const [prices, setPrices] = useState(() => 
    Array.from({ length: 30 }, (_, i) => {
      const base = 8000 + (7000 * i) / 29;
      const wave = Math.sin((i / 29) * Math.PI * 2.5) * 800;
      const noise = Math.sin(i * 1.5) * 200;
      return Math.round(base + wave + noise);
    })
  );
  
  const [activeIndex, setActiveIndex] = useState(29); // Default to the latest price (Day 30)
  const [isSparklineRevealed, setIsSparklineRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Persistent market regime tracker (bear panic, recovery crawl, bull run, stagnant consolidation)
  const marketState = useRef({
    regime: "recovery",
    duration: 20,
    drift: 0.004
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSparklineRevealed(true);
    }, 3400); // 1.2s delay + 2.2s duration
    return () => clearTimeout(timer);
  }, []);

  // Live stock market ticker simulation (continuous scrolling with regime switching)
  useEffect(() => {
    if (isHovered || !isSparklineRevealed) return;
    
    const interval = setInterval(() => {
      setPrices((prevPrices) => {
        const lastPrice = prevPrices[prevPrices.length - 1];
        
        // Update market regime state machine
        const current = marketState.current;
        current.duration--;
        if (current.duration <= 0) {
          const regimes = ["bear", "recovery", "bull", "stagnant"];
          const newRegime = regimes[Math.floor(Math.random() * regimes.length)];
          current.regime = newRegime;
          
          if (newRegime === "bear") {
            current.duration = Math.floor(Math.random() * 8) + 4; // 4 to 12 ticks
            current.drift = -0.015 - Math.random() * 0.02; // -1.5% to -3.5% per tick (sharp drops)
          } else if (newRegime === "recovery") {
            current.duration = Math.floor(Math.random() * 20) + 15; // 15 to 35 ticks
            current.drift = 0.002 + Math.random() * 0.004; // +0.2% to +0.6% per tick (slow climb)
          } else if (newRegime === "bull") {
            current.duration = Math.floor(Math.random() * 15) + 8; // 8 to 23 ticks
            current.drift = 0.01 + Math.random() * 0.015; // +1.0% to +2.5% per tick (rapid runs)
          } else { // stagnant
            current.duration = Math.floor(Math.random() * 25) + 15; // 15 to 40 ticks
            current.drift = 0; // flat consolidation
          }
        }

        // Apply drift + random noise
        const noise = (Math.random() - 0.5) * (current.regime === "stagnant" ? 0.0015 : 0.006);
        const change = current.drift + noise;
        const nextPrice = Math.max(1000, Math.round(lastPrice * (1 + change)));
        
        // Shift prices to the left continuously (creates smooth scroll effect)
        return [...prevPrices.slice(1), nextPrice];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isHovered, isSparklineRevealed]);

  // If not hovered, always highlight the latest price
  useEffect(() => {
    if (!isHovered) {
      setActiveIndex(29);
    }
  }, [isHovered, prices]);

  // Calculate coordinates dynamically (auto-scaling based on the 30-day window)
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice || 1;
  const xCoords = Array.from({ length: 30 }, (_, i) => (i / 29) * 314);
  const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1} status`);

  const points = prices.map((price, idx) => {
    // scale y coordinate to be between 2 and 45
    const rawY = 45 - ((price - minPrice) / priceRange) * 40;
    const y = Math.max(2, Math.min(45, rawY)); // Clamp to keep inside SVG bounds
    return {
      day: days[idx],
      valueString: `$${price.toLocaleString()}`,
      x: xCoords[idx],
      y
    };
  });

  // Calculate dynamic bezier path strings
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
  const areaPath = `${bezierPath} L 314 48 L 0 48 Z`;

  // Calculate percentage change for the badge
  const startPrice = prices[0];
  const currentPrice = prices[29];
  const percentageChange = ((currentPrice - startPrice) / startPrice) * 100;
  const isPositive = percentageChange >= 0;
  const badgeText = `${isPositive ? "+" : ""}${percentageChange.toFixed(0)}%`;

  // Handle interactive hover positioning on the SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = mouseX / rect.width;
    const index = Math.max(0, Math.min(29, Math.round(percentage * 29)));
    setActiveIndex(index);
  };

  return (
    <main className={styles.hero}>
      {/* Left Side: Title and Subtitle */}
      <div className={styles.heroLeft}>
        <h1 className={styles.title}>
          Steady <span className={styles.serifText}> Advice.</span>
          <span className={styles.subtitleRow}>
            Every Market 
          </span>
        </h1>
        <p className={styles.subtitle}>
          We help your money find direction no matter what the market is doing.
        </p>
        <div className={styles.heroActions}>
          <Link href="/webinar" className={styles.primaryCta}>Attend Weekly Webinar</Link>
          <div className={styles.divider}></div>
          <a href="#" className={styles.secondaryCta}>Learn more</a>
        </div>
      </div>

      {/* Right Side: Glassmorphism Revenue Widget */}
      <div className={styles.heroRight}>
        <div 
          className={styles.card}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setActiveIndex(29);
          }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span className={styles.trendIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>Revenue</span>
            </div>
            <div className={styles.cardMenu}>
              <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
                <circle cx="9" cy="2" r="2" fill="currentColor" />
                <circle cx="16" cy="2" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.valueRow}>
              <span className={styles.cardValue}>{points[activeIndex].valueString}</span>
              <span className={styles.cardSubvalue}>{points[activeIndex].day}</span>
            </div>

            {/* Elegant SVG Sparkline to make card feel premium */}
            <div className={styles.sparkline}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 314 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                style={{ cursor: "crosshair" }}
              >
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(10, 6, 2, 0.25)" />
                    <stop offset="100%" stopColor="rgba(10, 6, 2, 0.0)" />
                  </linearGradient>
                  
                  {/* Seamless flowing gradient for the line stroke */}
                  <linearGradient id="sparklineLineGrad" x1="0" y1="0" x2="314" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0a0602" />
                    <stop offset="50%" stopColor="#2c1a08" />
                    <stop offset="100%" stopColor="#0a0602" />
                    <animateTransform
                      attributeName="gradientTransform"
                      type="translate"
                      values="0; -314"
                      dur="5s"
                      repeatCount="indefinite"
                    />
                  </linearGradient>

                  <clipPath id="sparklineClip">
                    <rect x="0" y="0" width="0" height="48">
                      <animate
                        attributeName="width"
                        from="0"
                        to="314"
                        dur="2.2s"
                        begin="1.2s"
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.25 1 0.5 1"
                      />
                    </rect>
                  </clipPath>
                </defs>

                {/* Wrap sparkline elements in a clipped group that moves upward on load */}
                <g clipPath="url(#sparklineClip)">
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      from="0 15"
                      to="0 0"
                      dur="2.2s"
                      begin="1.2s"
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.25 1 0.5 1"
                    />
                    
                    {/* Gradient area fill */}
                    <path
                      className={styles.sparklineArea}
                      d={areaPath}
                      fill="url(#sparklineGrad)"
                    />

                    {/* Dotted Guide Line */}
                    <line
                      x1={points[activeIndex].x}
                      y1="0"
                      x2={points[activeIndex].x}
                      y2="48"
                      className={styles.guideLine}
                      opacity={isSparklineRevealed ? 1 : 0}
                    />

                    {/* Flowing animated line */}
                    <path
                      className={styles.sparklinePath}
                      d={bezierPath}
                      stroke="url(#sparklineLineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Glowing indicator dot */}
                    <circle
                      cx={points[activeIndex].x}
                      cy={points[activeIndex].y}
                      r="5"
                      className={styles.sparklineDot}
                      opacity={isSparklineRevealed ? 1 : 0}
                    />
                  </g>
                </g>
              </svg>

              {/* Floating Tooltip Bubble */}
              <div
                className={styles.tooltip}
                style={{
                  left: `${(points[activeIndex].x / 314) * 100}%`,
                  bottom: `${((48 - points[activeIndex].y) / 48) * 100 + 15}%`,
                  opacity: isSparklineRevealed ? 1 : 0
                }}
              >
                {points[activeIndex].valueString}
              </div>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <span 
              className={styles.badge} 
              style={{
                backgroundColor: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: isPositive ? "#10b981" : "#ef4444",
                boxShadow: isPositive ? "0 4px 12px rgba(16, 185, 129, 0.15)" : "0 4px 12px rgba(239, 68, 68, 0.15)"
              }}
            >
              {badgeText}
            </span>
            <span className={styles.changeText}>Since previous 30 days</span>
          </div>
        </div>
      </div>
    </main>
  );
}
