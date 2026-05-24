import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Rooms from '../components/Rooms';
import Amenities from '../components/Amenities';
import Location from '../components/Location';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import { useSiteData } from '../contexts/SiteDataContext';

function HomePage() {
  const { loading, error } = useSiteData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-700 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-emerald-300 text-lg font-medium">ThaiNguyen Stay</p>
          <p className="text-emerald-500 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Đã xảy ra lỗi</h2>
          <p className="text-emerald-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Rooms />
      <Amenities />
      <Location />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default HomePage;
