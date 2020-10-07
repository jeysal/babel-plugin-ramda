import { contains } from "ramda";
import fs from "fs";
import path from "path";

export default function resolveModule(useES, name, fromPath) {
  const ramdaPath = path.dirname(
    require.resolve("ramda/package.json", { paths: [fromPath] })
  );

  // We do not need to change the search path based on useES since src and es are both built from the
  // same source in Ramda, and the directories will therefore always have identical contents.
  var methods = fs
    .readdirSync(path.join(ramdaPath, "src"))
    .filter((name) => path.extname(name) == ".js")
    .map((name) => path.basename(name, ".js"));

  for (var category in methods) {
    if (contains(name, methods)) {
      return `ramda/${useES ? "es" : "src"}/${name}`;
    }
  }
  throw new Error(`Ramda method ${name} was not a known function
    Please file a bug if it's my fault https://github.com/megawac/babel-plugin-ramda/issues
  `);
}
