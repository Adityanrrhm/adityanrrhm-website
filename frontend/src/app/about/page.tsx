import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import About from "@/components/About";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="py-4 sm:py-8">
        <About />
      </div>
      <Footer />
    </main>
  );
}
