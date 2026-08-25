import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ModelProfile } from './components/ModelProfile';
import { WhatIsInVip } from './components/WhatIsInVip';
import { Gallery } from './components/Gallery';
import { PlansSection } from './components/PlansSection';
import { PaymentSecurity } from './components/PaymentSecurity';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { FloatingCTA } from './components/FloatingCTA';

export function App() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // Header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToPlans = () => {
    scrollToSection('planos');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Fixed Navigation Header */}
      <Header onNavigate={scrollToSection} />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero onGoToPlans={handleGoToPlans} />

        {/* 2. Model Profile & Bio */}
        <ModelProfile />

        {/* 3. What is in VIP */}
        <WhatIsInVip onGoToPlans={handleGoToPlans} />

        {/* 4. VIP Photo Gallery with Lightbox */}
        <Gallery onGoToPlans={handleGoToPlans} />

        {/* 5. Subscription Plans */}
        <PlansSection />

        {/* 6. Payment Security & Guarantees */}
        <PaymentSecurity />

        {/* 7. Final Call to Action */}
        <FinalCTA onGoToPlans={handleGoToPlans} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Quick Action Bar */}
      <FloatingCTA onGoToPlans={handleGoToPlans} />
    </div>
  );
}

export default App;
