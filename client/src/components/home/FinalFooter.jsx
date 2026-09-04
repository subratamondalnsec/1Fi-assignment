const social = [
  ["LinkedIn", "https://www.linkedin.com/in/subrata-mondal1/"],
  ["X", "https://x.com/Subrata7133"],
  ["GitHub", "https://github.com/subratamondalnsec"],
];
export function FinalFooter() {
  return (
    <footer className="border-t border-violet-100 pt-10">
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold">
            1<span className="text-violet-600">Fi</span>
          </p>
          <p className="mt-3 text-sm text-slate-600">
            A clearer, illustrative smartphone EMI experience.
          </p>
        </div>
        <div>
          <p className="font-bold">Quick links</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <a href="/#home">Home</a>
            <a href="/#catalog">Catalog</a>
            <a href="/#how-it-works">How It Works</a>
          </div>
        </div>
        <div>
          <p className="font-bold">Social</p>
          <div className="mt-3 flex gap-3 text-sm font-semibold text-violet-700">
            {social.map(([label, href]) => (
              <a
                aria-label={label}
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-9 border-t border-violet-100 py-5 text-sm text-slate-500">
        © 2026 1Fi Technologies · Made with ♥ by{" "}
        <a
          className="font-semibold text-violet-700"
          href="https://www.linkedin.com/in/subrata-mondal1/"
          rel="noreferrer"
          target="_blank"
        >
          Subrata
        </a>
      </div>
    </footer>
  );
}
