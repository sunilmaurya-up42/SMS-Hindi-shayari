import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
========================================
🚀 SMS Hindi Shayari API Started
🌍 Environment : ${process.env.NODE_ENV || "development"}
📡 Port        : ${PORT}
========================================
  `);
});
