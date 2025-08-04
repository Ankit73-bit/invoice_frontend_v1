import { copyFile } from "fs/promises";
import path from "path";

async function main() {
  const src = path.resolve("dist/index.html");
  const dest = path.resolve("dist/404.html");
  await copyFile(src, dest);
  console.log("Copied index.html to 404.html as fallback");
}

main().catch((err) => {
  console.error("Failed to copy fallback:", err);
  process.exit(1);
});
