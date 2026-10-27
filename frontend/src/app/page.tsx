import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Portfolio from "@/components/Portfolio";
import Certificates from "@/components/Certificates";
import Experience from "@/components/Experience";
import About from "@/components/About";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <div className="py-4 sm:py-8">
        <Hero />
        <Skills />
        <Portfolio isPreview={true} />
        <Certificates isPreview={true} />
        <About isPreview={true} />
        <Experience isPreview={true} />
        <CTA />
      </div>

      <Footer />
    </main>
  );
}
