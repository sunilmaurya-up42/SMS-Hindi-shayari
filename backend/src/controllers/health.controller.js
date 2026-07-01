export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "SMS Hindi Shayari API is running",
    version: "v1",
    uptime: process.uptime()
  });
};
