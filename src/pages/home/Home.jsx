import Header from "@/components/header/Header";
import BannerIntro from "@/components/home/BannerIntro";
import WhyFPT from "@/components/home/WhyFPT";
import Programs from "../../components/home/Programs";
import Admissions from "../../components/home/Admissions";
import Contact from "@/components/home/Contact";
import Footer from "@/components/footer/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerIntro />
      <WhyFPT />
      <Programs />
      <Admissions />
      <Contact />
      <Footer />
    </div>
  );
}


export default Home;