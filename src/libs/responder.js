function accessDenied(res)
{
  return res.status(400).json({
    message: "Invalid request"
  })
}

function notFound(res)
{
  return res.status(404).json({
    message: "Not Found"
  })
}

function internalError(res)
{
  return res.status(500).json({
    message: "Internal Server Error"
  })
}

export default {
  accessDenied,
  notFound,
  internalError
}
