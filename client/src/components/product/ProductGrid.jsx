import { ProductCard } from './ProductCard';

export function ProductGrid({ products }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"><h2 className="sr-only">Available smartphones</h2>{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
