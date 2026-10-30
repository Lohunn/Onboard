/**
 * @file Home.jsx
 * @description Landing page for Onboard — composes all home sections in order:
 * Hero, Board Showcase, Featured Projects, How It Works, Learning Paths Preview,
 * Why Onboard, and CTA.
 */

import HeroSection from '../components/home/HeroSection';
import BoardShowcase from '../components/home/BoardShowcase';
import FeaturedProjects from '../components/home/FeaturedProjects';
import HowItWorks from '../components/home/HowItWorks';
import LearningPathsPreview from '../components/home/LearningPathsPreview';
import WhyOnboard from '../components/home/WhyOnboard';
import CTASection from '../components/home/CTASection';

/**
 * Home page — the main landing page for Onboard.
 * Arranges all hero and marketing sections with consistent vertical spacing.
 * @returns {JSX.Element}
 */
export default function Home() {
  return (
    <main>
      {/* Hero — full-bleed, no extra top padding */}
      <HeroSection />

      {/* Choose your board */}
      <section className="py-20">
        <BoardShowcase />
      </section>

      {/* Start with a project */}
      <section className="py-20">
        <FeaturedProjects />
      </section>

      {/* How it works */}
      <section className="py-24">
        <HowItWorks />
      </section>

      {/* Learning paths */}
      <section className="py-20">
        <LearningPathsPreview />
      </section>

      {/* Why Onboard */}
      <section className="py-20">
        <WhyOnboard />
      </section>

      {/* Call to action */}
      <section className="py-24">
        <CTASection />
      </section>
    </main>
  );
}
