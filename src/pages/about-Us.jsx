import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from '../components/navbar';
import AboutPreloader from '../preloaderui/AboutPreloader';
import { SWIPE_TRANSITION } from '../preloaderui/timings';
import './../index.css';
import Footer from "./../components/footer";
import { Link } from 'react-router-dom';
import Suryansh from './../assets/Members/Suryansh.webp'
import Kanishka from './../assets/Members/Kanishka.webp'
import Abhishek from './../assets/Members/Abhishek.jpeg'
import Ambar from './../assets/Members/Ambar.webp'
import Raj from './../assets/HS/Members/Raj.jpg'
import Keshav from './../assets/Members/Keshav.webp'
import Parkhi from './../assets/Members/Parkhi.webp'
import Divya from './../assets/HS/Members/Divya.jpg'
import Krishna from './../assets/HS/Members/Krishna.png'
// import Subham from './../assets/Members/Subham.png'
import yuvraj from './../assets/Members/Yuvraj.webp'
import vishal from './../assets/HS/Members/Vishal.png'
import AnmolSecond from './../assets/Members/SecondYear/Anmol.jpeg'
import AzaanSecond from './../assets/Members/SecondYear/Azaan.jpeg'
import HimanshuSecond from './../assets/Members/SecondYear/Himanshu.jpeg'
import KanishkaSecond from './../assets/Members/SecondYear/Kanishka.jpeg'
import KinshukSecond from './../assets/Members/SecondYear/Kinshuk.jpeg'
import KushagraSecond from './../assets/Members/SecondYear/Kushagra.jpeg'
import ShubhSecond from './../assets/Members/SecondYear/Shubh.jpeg'
import PlaceholderMember from './../assets/Members/SecondYear/placeholder.svg'
// import arpit from './../assets/Members/arpit.png'
// Custom Hook for observing elements and adding a 'visible' class
const useAnimateOnScroll = (options) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return ref;
};

const FeatureCard = ({ icon, title, description }) => {
  const ref = useAnimateOnScroll({ threshold: 0.3, triggerOnce: true });
  return (
    <div ref={ref} className="feature-card fade-in-up">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const secondYearMembers = [
  { name: 'Anant Awasthi', imageUrl: PlaceholderMember },
  { name: 'Azaan Hussain', imageUrl: AzaanSecond },
  { name: 'Kanishka Jain', imageUrl: KanishkaSecond },
  { name: 'Himanshu Singh', imageUrl: HimanshuSecond },
  { name: 'Kinshuk Agarwal', imageUrl: KinshukSecond },
  { name: 'Kushagra Kaushik', imageUrl: KushagraSecond },
  { name: 'Shubh Agarwal', imageUrl: ShubhSecond },
  { name: 'Shreya Singh', imageUrl: PlaceholderMember },
  { name: 'Anmol Singhal', imageUrl: AnmolSecond },
]

const TeamMemberCard = ({ name, role, imageUrl, className = '' }) => {
    const ref = useAnimateOnScroll({ threshold: 0.3, triggerOnce: true });
    return (
        <div ref={ref} className={`team-member-card fade-in-up ${className}`}>
            <img src={imageUrl} alt={name} className="team-member-img" />
            <h4 className="team-member-name">{name}</h4>
            {role && <p className="team-member-role">{role}</p>}
        </div>
    );
};

export default function AboutUs() {
  const [preloading, setPreloading] = useState(true);

  const heroRef = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });
  const philosophyRef = useAnimateOnScroll({ threshold: 0.4, triggerOnce: true });
  const featuresHeaderRef = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });
  const teamHeaderRef = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });
  const joinRef = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });

  const features = [
    { icon: '🚀', title: 'CTF Challenges', description: 'Engage in real-world scenarios and sharpen your offensive and defensive security skills.' },
    { icon: '🔧', title: 'Workshops & Training', description: 'Learn from industry experts through hands-on workshops on the latest tools and techniques.' },
    { icon: '🌐', title: 'Community & Networking', description: 'Connect with peers, mentors, and professionals in the cybersecurity field.' }
  ];

  const founder = { name: 'Suryansh Deshwal', role: 'Founder & Lead', imageUrl: Suryansh };

  const teamMembers = [
    { name: 'Ambar Chakravartty', role: 'President', imageUrl: Ambar },
    { name: 'Kanishka', role: 'President', imageUrl: Kanishka },
    { name: 'Abhishek Kumar', role: 'Sr. Developer', imageUrl: Abhishek },
  ];
  const coreMembers = [
    { name: 'Keshav Agarwal', role: 'Chief Admin', imageUrl: Keshav },
    { name: 'Parkhi Sharma', role: 'Chief Admin', imageUrl: Parkhi },
    { name: 'Raj Ojha', imageUrl: Raj },
    { name: 'Krishna Kumar', imageUrl: Krishna },
    { name: 'Yuvraj Patel', imageUrl: yuvraj },
    { name: 'Vishal Prajapati', imageUrl: vishal },
    { name: 'Divya Pal', imageUrl: Divya },
  ];

  return (
    <AnimatePresence>
      {preloading ? (
        <motion.div
          key="preloader"
          className="about-preloader"
          initial={{ y: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          exit={{
            y: '-100%',
            borderBottomLeftRadius: '50vw',
            borderBottomRightRadius: '50vw',
          }}
          transition={SWIPE_TRANSITION}
        >
          <AboutPreloader onDone={() => setPreloading(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="about-page"
          className="about-page"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={SWIPE_TRANSITION}
        >
          <Navbar />
      <div className="about-us-page">
        <section ref={heroRef} className="about-hero fade-in">
          <h1 className="about-hero-title">We are the architects of the digital frontier.</h1>
          <p className="about-hero-subtitle">Exploring the depths of cyberspace to build a more secure future.</p>
        </section>

        <section ref={philosophyRef} className="about-section fade-in-up">
          <h2 className="section-title">Our Philosophy</h2>
          <p className="section-content">
        VOID Society, under the Centre of Excellence, is our institute’s dedicated cybersecurity club driven entirely by students. We go beyond textbooks by teaching and exploring real-world skills such as Linux, networking, ethical hacking, OSINT, penetration testing, and digital forensics. Our members learn through hands-on bootcamps, capture-the-flag challenges, workshops, and awareness campaigns, making cybersecurity both practical and exciting. We also host Null Chapter meetups and collaborate with industry professionals, creating direct pathways for internships and jobs. At VOID, students build, break, secure, and grow together as part of an active, ever-learning cybersecurity community.
          </p>
        </section>

        <section className="about-section">
          <h2 ref={featuresHeaderRef} className="section-title fade-in-up">What We Do</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        <section className="about-section">
          
          {/* Founder - Biggest, Center */}
          <div className="founder-container">
            <div className="founder-card">
              <img src={founder.imageUrl} alt={founder.name} className="founder-image" />
              <h3 className="founder-name">{founder.name}</h3>
              <p className="founder-title">{founder.role}</p>
            </div>
          </div>

          {/* Presidents */}
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} className={member.name === 'Divya Pal' ? 'center-last-member' : ''} />
            ))}
          </div>

          {/* Core Members with Photos */}
          <h2 ref={teamHeaderRef} className="section-title fade-in-up" style={{ marginTop: "4rem" }}>Meet The Team</h2>
          <h3
            style={{
              marginTop: "1.5rem",
              marginBottom: "2.5rem",
              textAlign: "center",
              color: "#3b82f6",
              fontSize: "2rem",
              fontWeight: "700"
            }}
          >
            3rd Year
          </h3>
          <div className="team-grid team-core-grid">
            {coreMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} className={member.name === 'Divya Pal' ? 'center-last-member' : ''} />
            ))}
          </div>
          <h3
            style={{
              marginTop: "4rem",
              marginBottom: "2.5rem",
              textAlign: "center",
              color: "#3b82f6",
              fontSize: "2rem",
              fontWeight: "700"
            }}
          >
            2nd Year
          </h3>

          <div className="team-grid second-year-grid">
            {secondYearMembers.map((member, index) => (
              <TeamMemberCard key={`second-${index}`} {...member} />
            ))}
          </div>

        </section>

                        <section className="cta-section fixed-register-cta">
          <h2>Ready to Enter the Void?</h2>

          <p>
            Become part of a community that challenges the status quo.
          </p>

          <div className="register-button-wrap">
            <a
              href="https://register.void-society.in"
              target="_blank"
              rel="noopener noreferrer"
              className="register-button"
            >
              Register Now
            </a>
          </div>
        </section>
      </div>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
