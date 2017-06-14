function accessDenied(res)
{
  return res.status(400).json({
    message: "Invalid request"
  })
}

export default {
  accessDenied
}
