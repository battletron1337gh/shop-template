import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarDetailClient from './CarDetailClient';
import { cars } from '@/data/cars';

// Generate static params for all cars
export function generateStaticParams() {
  return cars.map((car) => ({
    id: car.id,
  }));
}

export default function CarDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <CarDetailClient carId={params.id} />
      <Footer />
    </>
  );
}
