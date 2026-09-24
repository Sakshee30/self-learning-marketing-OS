import { publishedSite } from "@/src/content/published-site";

export const siteConfig = {
  name: publishedSite.brand.name,
  descriptor: publishedSite.brand.descriptor,
  description: publishedSite.brand.description,
  navigation: publishedSite.navigation,
  primaryCta: publishedSite.primaryCta
};

export const footerGroups = publishedSite.footer.groups;
export const footerConfig = publishedSite.footer;
