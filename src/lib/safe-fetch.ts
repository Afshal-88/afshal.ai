import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/** Fetch a public web page safely: only public http(s) hosts, capped size, checked redirects. */

const MAX_BYTES = 4 * 1024 * 1024;
export const UA = "Mozilla/5.0 (compatible; AfshalSiteCheck/1.0; +https://starxmarketing.com)";

function privateIp(ip: string) {
  if (isIP(ip) === 6) {
    const l = ip.toLowerCase();
    return l === "::1" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80") || l.startsWith("::ffff:127.") || l.startsWith("::ffff:10.") || l.startsWith("::ffff:192.168.");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

export async function safeUrl(raw: string): Promise<URL> {
  const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("bad-url");
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(u.hostname)) throw new Error("bad-url");
  const addrs = isIP(u.hostname) ? [{ address: u.hostname }] : await lookup(u.hostname, { all: true }).catch(() => { throw new Error("unreachable"); });
  if (!addrs.length || addrs.some((a) => privateIp(a.address))) throw new Error("bad-url");
  return u;
}

export async function fetchSafe(url: URL, ms: number, redirects = 5): Promise<{ res: Response; url: URL; hops: number }> {
  let cur = url;
  for (let hop = 0; hop <= redirects; hop++) {
    const res = await fetch(cur, { redirect: "manual", headers: { "user-agent": UA, accept: "text/html,*/*" }, signal: AbortSignal.timeout(ms) });
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      cur = await safeUrl(new URL(loc, cur).toString());
      continue;
    }
    return { res, url: cur, hops: hop };
  }
  throw new Error("redirects");
}

export async function readCapped(res: Response) {
  const reader = res.body?.getReader();
  if (!reader) return { text: "", bytes: 0 };
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > MAX_BYTES) { reader.cancel(); break; }
    chunks.push(value);
  }
  return { text: new TextDecoder().decode(Buffer.concat(chunks)), bytes };
}

export const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
export const metaContent = (html: string, key: string) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const t = tags.find((m) => new RegExp(`(name|property)\\s*=\\s*["']${key}["']`, "i").test(m));
  return t ? attr(t, "content") : undefined;
};

