const dispatch = async (requestId, handler, metadata = {}) => {
  try {
    const data = await handler()
    return { requestId, ok: true, data, ...metadata }
  } catch (error) {
    throw error
  }
}

export { dispatch }
