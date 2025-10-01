import { ListingsExplorer } from '@/components/listings-explorer';

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">物件一覧</h1>
      <ListingsExplorer />
    </div>
  );
}