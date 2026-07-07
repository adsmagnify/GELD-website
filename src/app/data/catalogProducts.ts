export type CatalogProduct = {
  name: string;
  slug?: string;
  iconType: "coin" | "crown";
  badge?: string;
  value?: string;
  highlight?: boolean;
  featured?: boolean;
  bullets: string[];
};

export const MINI_STOCK_PORTFOLIOS_NAME = "Mini stock portfolios (Professionally managed)";

export const catalogProducts: CatalogProduct[] = [
  {
    name: "Mutual Funds",
    slug: "mutual-funds",
    iconType: "coin",
    badge: "Monthly savings",
    value: "₹500/ Month",
    featured: true,
    bullets: [
      "Start SIPs in next multibagger schemes",
      "Get Customised portfolio advise on correct scheme mix",
      "With easy step ups to grow as you earn",
    ],
  },
  {
    name: MINI_STOCK_PORTFOLIOS_NAME,
    slug: "iap",
    iconType: "crown",
    badge: "Lumpsum Investment",
    value: "₹2.5 Lakhs",
    highlight: true,
    featured: true,
    bullets: [
      "Investments in 20-25 Largecap / multicap stocks",
      "Managed by top fund managers such as Pankaj Murarka, Dipen seth, Sunil Singhania",
      "Outperformed nifty by big margin in last 3 years",
    ],
  },
  {
    name: "PMS",
    slug: "pms",
    iconType: "coin",
    badge: "lumpsum Investment",
    value: "₹50 Lakhs",
    featured: true,
    bullets: [
      "Focused portfolio of 20–25 handpicked stocks by India's top fund managers — not 100+ holdings like a typical mutual fund",
      "Historically delivered 11–31% annualised returns, outperforming mutual fund benchmarks on average",
      "Access to elite PMS houses — Abakkus, Carnelian, MOAMC, Renaissance, Buoyant & more",
    ],
  },
  {
    name: "AIF",
    slug: "aif",
    iconType: "coin",
    badge: "Unlisted Equities, REITS",
    value: "₹1 Crore",
    featured: true,
    bullets: [
      "Investments in upto 20 unlisted companies or Real estate projects",
      "Highest compounders across categories",
    ],
  },
  {
    name: "Fixed Income Offerings",
    iconType: "coin",
    bullets: [
      "Our fixed income products offer 10-15% returns with top-tier credit ratings.",
      "Perfect for your debt portfolio and ideal for those who want steady monthly income.",
      "Safe, consistent, and smart —your money, working stress-free.",
    ],
  },
  {
    name: "XAlgo Trading Software",
    iconType: "coin",
    bullets: [
      "Research backed algo of top fund house of India",
      "Trades on your existing Mutual funds/ stock portfolio",
      "Generates additional conservative returns over your existing investments",
      "1 capital , 2 returns",
    ],
  },
  {
    name: "Life & Health Insurance",
    iconType: "coin",
    bullets: [
      "Insurance is the first step in Personal finance , One big Hospital bill can bite big into our portfolios.",
      "We calculate your insurance needs based on real-life goals and responsibilities.",
    ],
  },
  {
    name: "Shariyat-Compliant Investment Options",
    iconType: "coin",
    bullets: [
      "Investments that align with your values and your goals.",
      "We offer a range of Shariyat-compliant options across CMS, mini-PMS, mutual funds, trades, and more.",
    ],
  },
];

export const featuredCatalogProducts = catalogProducts.filter((product) => product.featured);
