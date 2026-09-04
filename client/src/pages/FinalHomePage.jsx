import { useEffect, useState } from "react";
import { EmiCalculator } from "../components/home/EmiCalculator";
import { HowItWorks } from "../components/home/HowItWorks";
import { ProductDiscovery } from "../components/home/ProductDiscovery";
import { Benefits, EmiExample } from "../components/home/ValueSections";
import { FinalFooter } from "../components/home/FinalFooter";
import { fetchProducts } from "../services/productApi";
export function FinalHomePage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);
  return (
    <div className="space-y-20 sm:space-y-28">
      <section
        id="home"
        className="relative overflow-hidden py-14 text-center sm:py-24"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100/70 via-[#fcfbff] to-indigo-50/50" />
        <p className="text-sm font-bold uppercase tracking-[.18em] text-violet-700">
          Smartphone EMI, made considered
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-bold tracking-[-.06em] text-slate-950 sm:text-7xl">
          Choose the phone.
          <br />
          <em className="font-serif font-medium text-violet-600">
            Shape the payment.
          </em>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Premium smartphones with flexible, illustrative EMI plans built around
          an investment-aware way to shop.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <a
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
            href="/#catalog"
          >
            Start Shopping
          </a>
          <a
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-violet-300"
            href="/#emi-calculator"
          >
            Calculate EMI
          </a>
        </div>
      </section>
      <section id="emi-calculator">
        <EmiCalculator />
      </section>
      <HowItWorks />
      {products.length > 0 && <ProductDiscovery products={products} />}
      <Benefits />
      <EmiExample />
      <FinalFooter />
    </div>
  );
}
