"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Background from "./components/Background/Background";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true);
        }
      },
      {
        threshold: 0.2, // Triggers when 20% of the section is visible
      }
    );

    const currentRef = aboutRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleScrollClick = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      {/* Background & Grid Matrix */}
      <Background />

      <div className={styles.wrapper}>
        {/* Navigation Header */}
        <Header onAboutClick={handleScrollClick} />

        {/* Hero Landing */}
        <Hero />

        {/* Footer Actions */}
        <Footer onScrollClick={handleScrollClick} />
      </div>

      {/* About Us Section */}
      <About ref={aboutRef} isVisible={isAboutVisible} />
    </div>
  );
}
