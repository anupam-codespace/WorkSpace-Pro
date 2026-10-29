export function getAvatarUrl(name?: string): string | undefined {
  if (!name) return undefined
  const key = name.trim().toLowerCase()

  if (key === "anupam" || key === "anupam saha" || key === "as") {
    return "/avatar-profile.jpg"
  }

  return undefined
}
