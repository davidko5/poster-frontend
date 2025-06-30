export const getPublicUserNamePlaceholder = (input: string): string => {
  return `Anonymous #${toFourDigitCode(input)}`
}

export function toFourDigitCode(input: string): string {
  // Simple hash function (djb2 variant)
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    // charCodeAt is always ≤ 0xFFFF, so hash stays in signed 32-bit range
    hash = (hash << 5) + hash + input.charCodeAt(i)
    hash = hash & 0xffffffff // ensure 32-bit integer
  }
  // Map to 0–9999
  const code = Math.abs(hash) % 10000
  // Zero-pad to 4 digits
  return code.toString().padStart(4, "0")
}
