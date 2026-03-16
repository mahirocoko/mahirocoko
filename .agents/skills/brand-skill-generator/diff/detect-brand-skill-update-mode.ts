import fs from "node:fs"

export const detectBrandSkillUpdateMode = (destinationDir: string): "create" | "update" => {
  return fs.existsSync(destinationDir) ? "update" : "create"
}
