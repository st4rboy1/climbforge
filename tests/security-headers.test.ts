import { expect, test } from "bun:test";
import { applySecurityHeaders } from "../src/lib/security-headers.server";

test("preserves the response and sets a tight content policy", async () => {
  const response = applySecurityHeaders(new Response("ok", { status: 201 }));
  expect(response.status).toBe(201);
  expect(await response.text()).toBe("ok");
  const csp = response.headers.get("content-security-policy") ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).not.toContain("frame-ancestors");
});
