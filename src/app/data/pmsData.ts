export const PMS_DISCLAIMER =
  "Past performance does not guarantee future returns. All figures shown are historical and for illustrative purposes only.";

export const PMS_BENCHMARK = {
  name: "S&P BSE 500",
  threeYear: "13.5%",
  fiveYear: "12.3%",
  avgRollingThreeYear: "18%",
};

export type PmsSchemeHighlight = {
  name: string;
  manager: string;
  logo: string;
  logoOnLight?: boolean;
  logoFit?: "contain" | "cover";
  logoScale?: number;
  sinceInception?: string;
  threeYear?: string;
  fiveYear?: string;
  avgRollingThreeYear?: string;
};

export const PMS_SCHEME_HIGHLIGHTS: PmsSchemeHighlight[] = [
  {
    name: "Carnelian Shift Strategy",
    manager: "Carnelian Capital",
    logo: "/pms-logos/carnelian.png",
    sinceInception: "31.0%",
    threeYear: "26.2%",
    fiveYear: "24.6%",
  },
  {
    name: "Abakkus AEOA",
    manager: "Abakkus Asset Manager",
    logo: "/pms-logos/abakkus.png",
    sinceInception: "25.9%",
    threeYear: "18.1%",
    avgRollingThreeYear: "27%",
  },
  {
    name: "Abakkus AACA",
    manager: "Abakkus Asset Manager",
    logo: "/pms-logos/abakkus.png",
    sinceInception: "23.0%",
    threeYear: "17.1%",
    fiveYear: "15.1%",
  },
  {
    name: "MOAMC Mid to Mega",
    manager: "Motilal Oswal AMC",
    logo: "/pms-logos/moamc.png",
    sinceInception: "23.0%",
    threeYear: "26.5%",
    avgRollingThreeYear: "22%",
  },
  {
    name: "MOAMC Founders",
    manager: "Motilal Oswal AMC",
    logo: "/pms-logos/moamc.png",
    sinceInception: "24.7%",
    threeYear: "21.6%",
    avgRollingThreeYear: "23%",
  },
  {
    name: "MOAMC Value Migration",
    manager: "Motilal Oswal AMC",
    logo: "/pms-logos/moamc.png",
    sinceInception: "18.8%",
    threeYear: "19.6%",
    fiveYear: "14.1%",
  },
  {
    name: "Buoyant Opp Portfolio",
    manager: "Buoyant Capital",
    logo: "/pms-logos/buoyant.png",
    sinceInception: "20.6%",
    threeYear: "18.9%",
    fiveYear: "20.9%",
  },
  {
    name: "Renaissance India Next PMS",
    manager: "Renaissance Investment Managers",
    logo: "/pms-logos/renaissance.png",
    sinceInception: "13.1%",
    threeYear: "12.9%",
    avgRollingThreeYear: "29%",
  },
  {
    name: "Renaissance Opportunities Portfolio",
    manager: "Renaissance Investment Managers",
    logo: "/pms-logos/renaissance.png",
    sinceInception: "11.1%",
    threeYear: "10.1%",
    fiveYear: "13.4%",
  },
  {
    name: "Alchemy Smart Alpha 250",
    manager: "Alchemy Capital",
    logo: "/pms-logos/alchemy-v2.png",
    logoFit: "contain",
    logoScale: 2.1,
    sinceInception: "21.5%",
  },
  {
    name: "UNIFI Blended Rangoli",
    manager: "UNIFI Capital",
    logo: "/pms-logos/unifi.png",
    logoOnLight: true,
    sinceInception: "17.2%",
    threeYear: "10.2%",
    fiveYear: "11.8%",
  },
  {
    name: "Marathon Trend Following",
    manager: "Marathon Asset Management",
    logo: "/pms-logos/marathon.png",
    logoOnLight: true,
    sinceInception: "17.5%",
    threeYear: "15.1%",
  },
];

export const PMS_RETURN_RANGE = {
  sinceInception: "11% – 31%",
  threeYearRolling: "20% – 29%",
};
