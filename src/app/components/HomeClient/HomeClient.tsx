"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import styles from "../../page.module.css";
import Background from "../Background/Background";
import Hero from "../Hero/Hero";
import Footer from "../Footer/Footer";

const About = dynamic(() => import("../About/About"), { ssr: false });
const HomeProducts = dynamic(() => import("../HomeProducts/HomeProducts"), {
  ssr: false,
});
const Stats = dynamic(() => import("../Stats/Stats"), { ssr: false });
const Webinar = dynamic(() => import("../Webinar/Webinar"), { ssr: false });
const Testimonials = dynamic(() => import("../Testimonials/Testimonials"), {
  ssr: false,
});
const Contact = dynamic(() => import("../Contact/Contact"), { ssr: false });

export default function HomeClient() {
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
      <Background />

      <div id="hero" className={styles.wrapper}>
        <Hero />
        <Footer onScrollClick={() => scrollTo(aboutRef)} centerScroll />
      </div>

      <div id="about" className="deferredSection">
        <About ref={aboutRef} onScrollDown={() => scrollTo(productsRef)} />
      </div>

      <div id="products" className="deferredSection">
        <HomeProducts ref={productsRef} onScrollDown={() => scrollTo(statsRef)} />
      </div>

      <div id="stats" className={`${styles.fullSection} deferredSection`}>
        <Stats ref={statsRef} isGoldenBg onScrollDown={() => scrollTo(webinarRef)} />
      </div>

      <div id="webinar" className="deferredSection">
        <Webinar ref={webinarRef} onScrollDown={() => scrollTo(testimonialsRef)} />
      </div>

      <div id="testimonials" className="deferredSection">
        <Testimonials
          ref={testimonialsRef}
          onScrollDown={() => scrollTo(contactRef)}
        />
      </div>

      <div id="contact" className="deferredSection">
        <Contact ref={contactRef} />
      </div>
    </div>
  );
}
