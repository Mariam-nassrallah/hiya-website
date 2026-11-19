import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import MenuSection from './components/MenuSection';
import EventsSection from './components/EventsSection';
import WhyUs from './components/WhyUs';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

export default function App() {
  return (
    <>
      {/* Fixed navbar, rendered once, before all sections (it also holds the "Skip to content" link) */}
      <Navbar />
      <main id="main">
        <Hero />
        <StorySection />
        <MenuSection />
        <EventsSection />
        <WhyUs />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
