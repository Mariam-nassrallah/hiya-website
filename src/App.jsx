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
      <a href="#main" className="visually-hidden-focusable skip-link">
        Skip to content
      </a>
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
