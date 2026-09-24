import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface EventDefinition {
  name: string;
  owner: string;
  trigger: string;
  allowedFields: string[];
  consentRequirement: string;
  deduplicationRule: string;
}

interface EventDictionary {
  version: number;
  events: EventDefinition[];
}

const requiredEvents = [
  "page_view",
  "cta_clicked",
  "form_started",
  "form_validation_failed",
  "lead_submitted",
  "demo_booked",
  "resource_downloaded",
  "trial_started",
  "lead_qualified",
  "opportunity_created",
  "customer_converted",
];

function loadDictionary(): EventDictionary {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), "contracts/marketing-events.v1.json"), "utf8"),
  ) as EventDictionary;
}

describe("marketing event dictionary", () => {
  it("defines the versioned required event set without duplicate event names", () => {
    const dictionary = loadDictionary();
    const names = dictionary.events.map((event) => event.name);

    expect(dictionary.version).toBe(1);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(requiredEvents);
  });

  it("defines ownership, trigger, fields, consent resolution and deduplication for every event", () => {
    const dictionary = loadDictionary();

    for (const event of dictionary.events) {
      expect(event.owner.length).toBeGreaterThan(0);
      expect(event.trigger.length).toBeGreaterThan(0);
      expect(Array.isArray(event.allowedFields)).toBe(true);
      expect(event.consentRequirement).toBe("resolve-from-policy");
      expect(event.deduplicationRule.length).toBeGreaterThan(0);
    }
  });
});
