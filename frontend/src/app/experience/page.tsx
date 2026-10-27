import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="py-4 sm:py-8">
        <Experience />
      </div>

      <Footer />
    </main>
  );
}
