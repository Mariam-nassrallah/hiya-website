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
    // .app-shell / .app-scroll: on phones and tablets (< 992px) only .app-scroll
    // scrolls, below the navbar (see "app shell" in global.css). On desktop they
    // are plain wrappers: the navbar is fixed and the page scrolls as usual.
    <div className="app-shell">
      {/* Navbar, rendered once, before all sections (it also holds the "Skip to content" link) */}
      <Navbar />
      <div className="app-scroll">
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
      </div>
      <CartDrawer />
    </div>
  );
}
