import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
export function FinalShell({ children }) {
  const { items } = useCart();
  const { pathname } = useLocation();
  const count = items.reduce((n, item) => n + Math.max(1, Number(item.quantity) || 1), 0);
  const utilityClass = `rounded-lg px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700 ${pathname === '/orders' || pathname.startsWith('/orders/') ? 'bg-violet-50 text-violet-700' : ''}`;
  return (
    <div className="min-h-screen bg-[#fcfbff] pb-20">
      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a
            className="text-xl font-extrabold tracking-tight text-slate-950"
            href="/#home"
          >
            1<span className="text-violet-600">Fi</span>
          </a>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
            <a
              className="rounded-lg px-3 py-2 hover:bg-violet-50 hover:text-violet-700"
              href="/#home"
            >
              Home
            </a>
            <a
              className="rounded-lg px-3 py-2 hover:bg-violet-50 hover:text-violet-700"
              href="/#catalog"
            >
              Catalog
            </a>
            <a
              className="hidden rounded-lg px-3 py-2 hover:bg-violet-50 hover:text-violet-700 sm:block"
              href="/#how-it-works"
            >
              How It Works
            </a>
            <Link className={utilityClass} to="/orders">Orders</Link>
            <Link
              className="relative ml-1 grid h-10 w-10 place-items-center rounded-xl border border-violet-100 bg-white text-slate-800 hover:bg-violet-50"
              to="/cart"
              aria-label="Cart"
            >
              🛒
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-violet-600 px-1 text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
