import { Link } from 'react-router-dom';

export function AppShell({ children }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><Link className="text-xl font-bold tracking-tight text-slate-950" to="/">1Fi</Link><div className="flex items-center gap-1"><Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" to="/">Smartphone catalogue</Link><Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" to="/cart">Cart</Link></div></nav></header><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">{children}</main></div>;
}
