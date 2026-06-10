// Manual stand-in for the compiler-generated RPC stub. The compiler's
// client bundle currently emits a throwing placeholder instead of a fetch
// call, so the demo calls the server route directly with the exact shape
// the documented contract specifies. See packages/server/README.md
// ("Compiler integration gaps").
async function __blazefw_rpc(
  path: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    throw new Error(`RPC ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// What the compiler will eventually generate for a BoundaryCrossing fn:
async function getServerTime(): Promise<{ now: string; pid: number }> {
  return __blazefw_rpc("/api/__blazefw/getServerTime", {}) as Promise<{
    now: string;
    pid: number;
  }>;
}

const app = document.getElementById("app")!;
app.innerHTML = `
  <h1>BlazeFW Demo</h1>
  <button id="rpc-btn">Get server time (RPC)</button>
  <pre id="rpc-out"></pre>
`;

const out = document.getElementById("rpc-out")!;
document.getElementById("rpc-btn")!.addEventListener("click", async () => {
  out.textContent = "calling server…";
  try {
    const data = await getServerTime();
    out.textContent = `server says: ${JSON.stringify(data, null, 2)}`;
  } catch (err) {
    out.textContent = String(err);
  }
});
