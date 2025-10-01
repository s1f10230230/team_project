import { FavoritesView } from '@/components/favorites-view';

export default function FavoritesPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">お気に入り物件</h1>
      </div>
      <FavoritesView />
    </div>
  );
}