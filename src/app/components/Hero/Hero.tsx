"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";
import {
  HERO_CAGR_3Y,
  HERO_INCEPTION_RETURN,
  HERO_STRATEGY_NAME,
  heroIndexSeries,
  heroPerformanceSeries,
} from "../../data/performanceData";

const CHART_WIDTH = 314;
const CHART_HEIGHT = 48;
const DRAW_DURATION_MS = 2400;
const LOOP_DURATION_MS = 5200;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function buildChartPoints(
  values: number[],
  labels: readonly { label: string }[],
  min: number,
  max: number
) {
  const range = max - min || 1;

  return values.map((value, idx) => {
    const x = (idx / (values.length - 1)) * CHART_WIDTH;
    const rawY = CHART_HEIGHT - 4 - ((value - min) / range) * (CHART_HEIGHT - 8);
    const y = Math.max(2, Math.min(CHART_HEIGHT - 2, rawY));
    return { x, y, value, label: labels[idx].label };
  });
}

function buildBezierPath(points: { x: number; y: number }[]) {
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    path += ` C ${cp1x} ${prev.y}, ${cp1x} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return path;
}

export default function Hero() {
  const pathRef = useRef<SVGPathElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const isMobileRef = useRef(false);
  const drawReadyRef = useRef(false);
  const drawStartRef = useRef<number | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [drawProgress, setDrawProgress] = useState(0);
  const [travelPhase, setTravelPhase] = useState(0);
  const [loopPoint, setLoopPoint] = useState({ x: 0, y: CHART_HEIGHT, index: 0 });
  const [activeIndex, setActiveIndex] = useState(heroPerformanceSeries.length - 1);
  const [isHovered, setIsHovered] = useState(false);
  const [headPoint, setHeadPoint] = useState({ x: 0, y: CHART_HEIGHT });

  const portfolioReturns = heroPerformanceSeries.map((point) => point.return);
  const indexReturns = heroIndexSeries.map((point) => point.return);
  const chartMin = Math.min(...portfolioReturns, ...indexReturns);
  const chartMax = Math.max(...portfolioReturns, ...indexReturns);

  const points = buildChartPoints(portfolioReturns, heroPerformanceSeries, chartMin, chartMax);
  const indexPoints = buildChartPoints(indexReturns, heroIndexSeries, chartMin, chartMax);
  const bezierPath = buildBezierPath(points);
  const indexBezierPath = buildBezierPath(indexPoints);
  const areaPath = `${bezierPath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;
  const activePoint = points[activeIndex];
  const activeIndexPoint = indexPoints[activeIndex];
  const strokeOffset = pathLength * (1 - drawProgress);
  const showInteractive = drawProgress >= 1;
  const isLooping = showInteractive && !isHovered && !prefersReducedMotionRef.current;
  const loopIndex = loopPoint.index;
  const idlePoint = points[loopIndex];
  const idleIndexPoint = indexPoints[loopIndex];
  const displayPoint = showInteractive
    ? isHovered
      ? activePoint
      : idlePoint
    : headPoint;
  const displayIndexPoint = showInteractive
    ? isHovered
      ? activeIndexPoint
      : idleIndexPoint
    : indexPoints[0];

  const formatReturn = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    isMobileRef.current = window.matchMedia("(max-width: 768px)").matches;

    if (prefersReducedMotionRef.current) {
      drawReadyRef.current = true;
      setDrawProgress(1);
    }
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotionRef.current) return;

    const beginDraw = () => {
      drawReadyRef.current = true;
    };

    const onAnimStart = (event: AnimationEvent) => {
      if (event.animationName === "fadeInUp") beginDraw();
    };

    card.addEventListener("animationstart", onAnimStart);

    requestAnimationFrame(() => {
      if (card.getAnimations().length > 0) beginDraw();
    });

    return () => card.removeEventListener("animationstart", onAnimStart);
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    setPathLength(length);
    const start = path.getPointAtLength(0);
    setHeadPoint({ x: start.x, y: start.y });
  }, [bezierPath]);

  useEffect(() => {
    if (!pathLength) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDrawProgress(1);
      const path = pathRef.current;
      if (path) {
        const point = path.getPointAtLength(pathLength);
        setHeadPoint({ x: point.x, y: point.y });
      }
      return;
    }

    let frameId = 0;
    let loopAnchor: number | null = null;

    const tick = (now: number) => {
      if (!drawReadyRef.current) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      if (drawStartRef.current === null) {
        drawStartRef.current = now;
      }

      const elapsed = now - drawStartRef.current;
      const path = pathRef.current;

      if (elapsed < DRAW_DURATION_MS) {
        const rawProgress = elapsed / DRAW_DURATION_MS;
        const eased = easeInOutCubic(rawProgress);
        setDrawProgress(eased);

        if (path) {
          const point = path.getPointAtLength(pathLength * eased);
          setHeadPoint({ x: point.x, y: point.y });
        }
      } else {
        setDrawProgress(1);

        if (!prefersReducedMotionRef.current && !isMobileRef.current && !isHoveredRef.current && path) {
          if (loopAnchor === null) loopAnchor = now;

          const loopElapsed = (now - loopAnchor) % LOOP_DURATION_MS;
          const phase = loopElapsed / LOOP_DURATION_MS;
          setTravelPhase(phase);

          const lengthAt = pathLength * phase;
          const point = path.getPointAtLength(lengthAt);
          const index = Math.max(
            0,
            Math.min(points.length - 1, Math.round(phase * (points.length - 1)))
          );
          setLoopPoint({ x: point.x, y: point.y, index });
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [pathLength, points.length]);

  useEffect(() => {
    if (!isHovered) {
      setActiveIndex(heroPerformanceSeries.length - 1);
    }
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!showInteractive) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = mouseX / rect.width;
    const index = Math.max(
      0,
      Math.min(points.length - 1, Math.round(ratio * (points.length - 1)))
    );
    setActiveIndex(index);
  };

  return (
    <main className={styles.hero}>
      <div className={styles.heroLeft}>
        <h1 className={styles.title}>
          Steady <span className={styles.serifText}> Advice.</span>
          <span className={styles.subtitleRow}>Every Market</span>
        </h1>
        <p className={styles.subtitle}>
          We help your money find direction no matter what the market is doing.
        </p>
        <div className={styles.heroActions}>
          <Link href="/webinar" className={styles.primaryCta}>
            Attend Weekly Webinar
          </Link>
          <div className={styles.divider}></div>
          <Link href="/products" className={styles.secondaryCta}>
            Learn more
          </Link>
        </div>
      </div>

      <div className={styles.heroRight}>
        <div
          ref={cardRef}
          className={styles.card}
          onMouseEnter={() => {
            isHoveredRef.current = true;
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            setIsHovered(false);
            setActiveIndex(heroPerformanceSeries.length - 1);
          }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span className={styles.trendIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23 6L13.5 15.5L8.5 10.5L1 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 6H23V12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Performance</span>
            </div>
            <Link href="/performance" className={styles.performanceLink}>
              Full report
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

          <div className={styles.cardBody}>
            <div className={styles.valueRow}>
              <span className={styles.cardValue}>{HERO_CAGR_3Y.toFixed(2)}%</span>
              <span className={styles.cardSubvalue}>3 Year CAGR</span>
            </div>
            <p className={styles.strategyName}>{HERO_STRATEGY_NAME}</p>

            <div className={styles.sparkline}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                style={{ cursor: showInteractive ? "crosshair" : "default" }}
              >
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(10, 6, 2, 0.2)" />
                    <stop offset="100%" stopColor="rgba(10, 6, 2, 0)" />
                  </linearGradient>

                  <linearGradient id="lineShimmer" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                    <stop offset="50%" stopColor="rgba(255, 255, 255, 0.85)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                  </linearGradient>

                  <clipPath id="chartRevealClip">
                    <rect x="0" y="0" width={CHART_WIDTH * drawProgress} height={CHART_HEIGHT} rx="4" />
                  </clipPath>
                </defs>

                <g clipPath="url(#chartRevealClip)">
                  <path
                    className={styles.sparklineArea}
                    d={areaPath}
                    fill="url(#sparklineGrad)"
                    style={{ opacity: 0.2 + drawProgress * 0.75 }}
                  />

                  <path
                    className={styles.sparklineIndexPath}
                    d={indexBezierPath}
                  />

                  <path
                    ref={pathRef}
                    className={styles.sparklinePath}
                    d={bezierPath}
                    stroke="#0a0602"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray={pathLength || undefined}
                    strokeDashoffset={strokeOffset}
                  />

                  {showInteractive && pathLength > 0 && (
                    <path
                      className={styles.sparklineShimmer}
                      d={bezierPath}
                      stroke="url(#lineShimmer)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${pathLength * 0.14} ${pathLength * 0.86}`}
                      strokeDashoffset={-travelPhase * pathLength}
                      style={{ opacity: isLooping ? 0.75 : 0 }}
                    />
                  )}
                </g>

                {showInteractive && isHovered && (
                  <line
                    x1={activePoint.x}
                    y1="0"
                    x2={activePoint.x}
                    y2={CHART_HEIGHT}
                    className={styles.guideLine}
                  />
                )}

                {points.map((point, idx) => {
                  const nodeThreshold = idx / (points.length - 1);
                  const isVisible = drawProgress >= nodeThreshold - 0.02;
                  const isActive =
                    showInteractive && (isHovered ? idx === activeIndex : idx === loopIndex);

                  return (
                    <circle
                      key={point.label}
                      cx={point.x}
                      cy={point.y}
                      r={isActive ? 4.5 : 2.5}
                      className={styles.sparklineNode}
                      style={{ opacity: isVisible ? (isActive ? 1 : 0.35) : 0 }}
                    />
                  );
                })}

                {isLooping && (
                  <circle
                    cx={displayPoint.x}
                    cy={displayPoint.y}
                    r="7"
                    className={styles.sparklineDotRing}
                  />
                )}

                <circle
                  cx={displayPoint.x}
                  cy={displayPoint.y}
                  r="4"
                  className={`${styles.sparklineDot} ${isLooping ? styles.sparklineDotPulse : ""}`}
                  style={{ opacity: drawProgress > 0.02 ? 1 : 0 }}
                />

                <circle
                  cx={displayIndexPoint.x}
                  cy={displayIndexPoint.y}
                  r="3"
                  className={styles.sparklineIndexDot}
                  style={{ opacity: drawProgress > 0.02 ? 0.9 : 0 }}
                />
              </svg>

              {showInteractive && isHovered && (
                <div
                  className={styles.tooltip}
                  style={{
                    left: `${(activePoint.x / CHART_WIDTH) * 100}%`,
                    bottom: `${((CHART_HEIGHT - activePoint.y) / CHART_HEIGHT) * 100 + 18}%`,
                  }}
                >
                  {`${activePoint.label}: ${formatReturn(activePoint.value)} · Index ${formatReturn(activeIndexPoint.value)}`}
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.badge}>+{HERO_INCEPTION_RETURN.toFixed(2)}%</span>
            <Link href="/performance" className={styles.changeText}>
              Since inception →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
