import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedCars from '@/components/FeaturedCars';
import CarMarquee from '@/components/CarMarquee';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import ReviewMarquee from '@/components/ReviewMarquee';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedCars />
        <CarMarquee />
        <WhyChooseUs />
        <Services />
        <ReviewMarquee />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
