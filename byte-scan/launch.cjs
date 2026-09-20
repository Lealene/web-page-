const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = "C:/Users/LEA/single-web-page";
const log = path.join(root, "byte-scan", "dev.out.log");
const err = path.join(root, "byte-scan", "dev.err.log");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

for (const p of [log, err]) {
  try { fs.writeFileSync(p, ""); } catch (e) { console.error("cannot clear " + p + ": " + e.message); }
}

const child = spawn(process.execPath, [nextBin, "dev", "-p", "3000", "-H", "127.0.0.1"], {
  cwd: root,
  stdio: ["ignore", fs.openSync(log, "a"), fs.openSync(err, "a")],
  detached: true,
  windowsHide: true,
  env: Object.assign({}, process.env, { NEXT_DISABLE_TELEMETRY: "1" }),
});
child.unref();
console.log("SPAWNED pid=" + child.pid + " nextBinExists=" + fs.existsSync(nextBin));
