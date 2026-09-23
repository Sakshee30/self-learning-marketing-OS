export const siteConfig = {
  name: "GrowthOS",
  descriptor: "Self-Learning Marketing OS",
  description:
    "A governed AI marketing operating system that connects goals, evidence, prediction, simulation, human approval, execution, measurement, and learning.",
  navigation: [
    { href: "/product", label: "Product" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/security", label: "Trust & control" }
  ],
  primaryCta: {
    href: "/contact",
    label: "Request access"
  }
} as const;

export const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Capabilities" },
      { href: "/how-it-works", label: "Operating model" },
      { href: "/security", label: "Trust & control" }
    ]
  },
  {
    title: "Explore",
    links: [
      { href: "/contact", label: "Request access" },
      { href: "/#operating-loop", label: "Autonomous loop" },
      { href: "/#human-control", label: "Human approvals" }
    ]
  }
] as const;
