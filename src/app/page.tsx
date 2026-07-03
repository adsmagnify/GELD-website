"use client";

import React, { useRef } from "react";
import styles from "./page.module.css";
import Background from "./components/Background/Background";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import HomeProducts from "./components/HomeProducts/HomeProducts";
import Stats from "./components/Stats/Stats";
import Webinar from "./components/Webinar/Webinar";
import Testimonials from "./components/Testimonials/Testimonials";
import Contact from "./components/Contact/Contact";

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const webinarRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      {/* Background & Grid Matrix */}
      <Background />

      <div id="hero" className={styles.wrapper}>
        {/* Hero Landing */}
        <Hero />

        {/* Scroll-down cue scrolls to the About section */}
        <Footer onScrollClick={() => scrollTo(aboutRef)} />
      </div>

      {/* About appears after the hero on scroll */}
      <div id="about">
        <About ref={aboutRef} onScrollDown={() => scrollTo(productsRef)} />
      </div>

      <div id="products">
        <HomeProducts ref={productsRef} onScrollDown={() => scrollTo(statsRef)} />
      </div>

      {/* Stats Section */}
      <div id="stats" className={styles.fullSection}>
        <Stats ref={statsRef} isGoldenBg onScrollDown={() => scrollTo(webinarRef)} />
      </div>

      <div id="webinar">
        <Webinar ref={webinarRef} onScrollDown={() => scrollTo(testimonialsRef)} />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <Testimonials 
          ref={testimonialsRef} 
          onScrollDown={() => scrollTo(contactRef)} 
        />
      </div>

      {/* Contact Section */}
      <div id="contact">
        <Contact ref={contactRef} />
      </div>
    </div>
  );
}