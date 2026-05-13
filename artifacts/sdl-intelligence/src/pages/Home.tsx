import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ChatSection from "@/components/ChatSection";
import ResearchSection from "@/components/ResearchSection";
import About from "@/components/About";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <ChatSection />
        <ResearchSection />
        <About />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
