import path from "node:path"

const tryResolveGitRoot = () => {
  try {
    const processResult = Bun.spawnSync(["git", "rev-parse", "--show-toplevel"], {
      stdout: "pipe",
      stderr: "pipe",
    })

    if (processResult.exitCode !== 0) {
      return null
    }

    const rootPath = new TextDecoder().decode(processResult.stdout).trim()
    return rootPath || null
  } catch {
    return null
  }
}

export const resolveWorkspaceRoot = () => {
  return tryResolveGitRoot() ?? process.cwd()
}

export const resolveWorkspacePath = (workspaceRoot: string, targetPath: string) => {
  if (path.isAbsolute(targetPath)) {
    return targetPath
  }

  return path.resolve(workspaceRoot, targetPath)
}

export const toWorkspaceRelativePath = (workspaceRoot: string, targetPath: string) => {
  const relativePath = path.relative(workspaceRoot, targetPath)

  if (!relativePath) {
    return "."
  }

  if (relativePath.startsWith("..")) {
    return targetPath
  }

  return relativePath
}
