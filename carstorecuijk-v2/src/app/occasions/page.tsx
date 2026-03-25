import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OccasionsList from '@/components/OccasionsList';

export default function OccasionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 lg:pt-28 bg-[#0a0a0a]">
        {/* Page Header */}
        <div className="bg-[#0d0d0d] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Onze Occasions</h1>
            <p className="text-white/50 mt-2">
              Bekijk ons ruime aanbod occasions. Gebruik de filters om uw ideale auto te vinden.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OccasionsList />
        </div>
      </main>
      <Footer />
    </>
  );
}
