import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarqueeBand from '../components/MarqueeBand';
import FeaturedInvitations from '../components/FeaturedInvitations';
import OpeningExperience from '../components/OpeningExperience';
import ProcessSection from '../components/ProcessSection';
import GallerySection from '../components/GallerySection';
import Testimonial from '../components/Testimonial';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function HomePage({ currentRoute = 'home', onNavigate = () => {} }) {
  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      {/* Thin atelier strip */}
      <div className="border-b border-ink/10 bg-ink-band text-cream/70">
        <div className="shell flex h-9 items-center justify-between gap-4 text-[10px]">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
            پذیرش سفارش تیر و مرداد ۱۴۰۶
          </span>
          <span className="latin tracking-[0.24em]">Digital invitations, made by hand</span>
          <span className="hidden sm:block">ارسال به سراسر ایران</span>
        </div>
      </div>

      <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />

      <div>
        <Hero onNavigate={onNavigate} />
        <MarqueeBand />
        <FeaturedInvitations onNavigate={onNavigate} />
        <OpeningExperience onNavigate={onNavigate} />
        <ProcessSection />
        <GallerySection onNavigate={onNavigate} />
        <Testimonial />
        <FinalCTA onNavigate={onNavigate} />
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
