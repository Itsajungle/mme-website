import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "MME Radio", href: "/radio" },
    { label: "MME Social", href: "/social" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Use Cases", href: "/use-cases" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Book a Demo", href: "/demo" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="font-heading text-sm font-bold text-bg">M</span>
              </div>
              <span className="font-heading text-lg font-bold text-text">MME</span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary max-w-xs">
              AI-powered moment marketing for radio and social media. Part of the HumAIn Tech family.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading text-sm font-semibold text-text mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Moment Marketing Engine. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            A HumAIn Tech product
          </p>
        </div>
      </div>
    </footer>
  );
}
