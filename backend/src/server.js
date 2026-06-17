import { app, initializeApp } from "./app.js";

const port = process.env.PORT || 5000;

await initializeApp();

app.listen(port, () => {
  console.log(`Portfolio API running on http://localhost:${port}`);
});
