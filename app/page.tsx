import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import FeaturedDishes from "@/components/featured-dishes"
import Chatbot from "@/components/chatbot"
import Footer from "@/components/footer"
import { Carta } from "@/components/cartaPDF";
import LosCamionerosGallery from "@/components/LosCamionerosGallery"
import Horario from "@/components/horario"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Horario />
      <LosCamionerosGallery/>
      {/* <Carta pdfUrl={"/FotosBar/CartaLosCamioneros.pdf"} /> */}
      <FeaturedDishes />
      <Footer />
      <Chatbot />
    </main>
  )
}
