/* Every customer-facing contact + payment destination in one place.
 * Update values here and the whole site follows (nav, hero, contact
 * section, footer, inquiry copy text). */

export const CONTACT = {
  facebookUrl: "https://www.facebook.com/boostingservices123",
  tiktokUrl: "https://www.tiktok.com/@strbyzxc",
  tiktokHandle: "@strbyzxc",
  discordHandles: ["starboy 5911", "123xd1207"],

  gcashNumber: "0976 644 3970",
  mayaNumber: "0925 711 7939",

  // TODO: set your real reply window. Shown under the contact channels.
  replyNote: "Typically replies within a day.",
};

export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}
