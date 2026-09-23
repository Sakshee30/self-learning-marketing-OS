import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const budgets = {
  javascriptTargetKb: 250,
  javascriptReviewGateKb: 350,
  cssGateKb: 60
};

function gzipKb(filePath) {
  const bytes = fs.readFileSync(filePath);
  return zlib.gzipSync(bytes).length / 1024;
}

function findEntryAsset(directory, extension) {
  const assets = path.join(directory, "assets");
  if (!fs.existsSync(assets)) throw new Error(`Missing assets directory: ${assets}`);

  const candidates = fs.readdirSync(assets)
    .filter((name) => name.startsWith("index-") && name.endsWith(extension))
    .map((name) => path.join(assets, name));

  if (!candidates.length) throw new Error(`No entry ${extension} asset found in ${assets}`);

  return candidates.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];
}

function verifyBuild(label, directory) {
  const js = findEntryAsset(directory, ".js");
  const css = findEntryAsset(directory, ".css");
  const jsKb = gzipKb(js);
  const cssKb = gzipKb(css);

  console.log(`${label} entry JS: ${jsKb.toFixed(2)} KiB gzip`);
  console.log(`${label} entry CSS: ${cssKb.toFixed(2)} KiB gzip`);

  if (jsKb > budgets.javascriptReviewGateKb) {
    throw new Error(
      `${label} entry JS exceeds the ${budgets.javascriptReviewGateKb} KiB review gate.`
    );
  }

  if (jsKb > budgets.javascriptTargetKb) {
    console.warn(
      `${label} entry JS exceeds the ${budgets.javascriptTargetKb} KiB target and requires review evidence.`
    );
  }

  if (cssKb > budgets.cssGateKb) {
    throw new Error(`${label} entry CSS exceeds the ${budgets.cssGateKb} KiB gzip gate.`);
  }
}

verifyBuild("Customer app", "dist");
verifyBuild("Platform control", "dist-platform-admin");
console.log("Frontend bundle budgets passed.");
