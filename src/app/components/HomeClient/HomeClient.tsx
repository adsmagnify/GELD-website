"use client";

import React, { useRef, useEffect } from "react";
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
const SocialMedia = dynamic(() => import("../SocialMedia/SocialMedia"), {
  ssr: false,
});
const Contact = dynamic(() => import("../Contact/Contact"), { ssr: false });

export default function HomeClient() {
  const aboutRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const webinarRef = useRef<HTMLElement>(null);
  const socialMediaRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(".page-scroll-container");
    if (scrollContainer) {
      scrollContainer.classList.add("homeSnapContainer");
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.classList.remove("homeSnapContainer");
      }
    };
  }, []);

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
        <Webinar ref={webinarRef} onScrollDown={() => scrollTo(socialMediaRef)} />
      </div>

      <div id="socialmedia" className={`${styles.fullSection} deferredSection`}>
        <SocialMedia
          ref={socialMediaRef}
          onScrollDown={() => scrollTo(contactRef)}
        />
      </div>

      <div id="contact" className={`${styles.fullSection} deferredSection`}>
        <Contact ref={contactRef} />
      </div>
    </div>
  );
}
