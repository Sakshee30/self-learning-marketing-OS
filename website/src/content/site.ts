import { routeByKey, type PublicRouteKey } from "@/src/content/routes";

const primaryNavigationKeys: readonly PublicRouteKey[] = [
  "product",
  "howItWorks",
  "security"
];

export const siteConfig = {
  name: "GrowthOS",
  descriptor: "Self-Learning Marketing OS",
  description: routeByKey.home.description,
  navigation: primaryNavigationKeys.map((key) => ({
    href: routeByKey[key].path,
    label: routeByKey[key].navLabel ?? routeByKey[key].title
  })),
  primaryCta: {
    href: routeByKey.contact.path,
    label: routeByKey.contact.navLabel ?? routeByKey.contact.title
  }
};

export const footerGroups = [
  {
    title: "Product",
    links: [
      { href: routeByKey.product.path, label: "Capabilities" },
      { href: routeByKey.howItWorks.path, label: "Operating model" },
      { href: routeByKey.security.path, label: "Trust & control" }
    ]
  },
  {
    title: "Explore",
    links: [
      { href: routeByKey.contact.path, label: "Request access" },
      { href: "/#operating-loop", label: "Autonomous loop" },
      { href: "/#human-control", label: "Human approvals" }
    ]
  }
];
