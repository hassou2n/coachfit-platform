import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115]">
      <Navbar />
   <main className="flex-1 min-h-screen pt-32">

  {children}
</main>

      <Footer />
    </div>
  );
}
