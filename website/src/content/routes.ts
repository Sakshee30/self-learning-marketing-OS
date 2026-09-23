import routeDefinitions from "@/config/site-routes.json";

export type PublicRouteKey = "home" | "product" | "howItWorks" | "security" | "contact";

export type PublicRouteDefinition = {
  key: PublicRouteKey;
  path: string;
  title: string;
  description: string;
  navLabel: string | null;
  indexable: boolean;
};

export const publicRoutes = routeDefinitions as PublicRouteDefinition[];

export const routeByKey = Object.fromEntries(
  publicRoutes.map((route) => [route.key, route])
) as Record<PublicRouteKey, PublicRouteDefinition>;
