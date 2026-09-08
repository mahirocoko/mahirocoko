const consume = (input) => {
  if (input.ok) return { ok: true, value: input.data }
  return { ok: false, error: input.error }
}

export { consume }
