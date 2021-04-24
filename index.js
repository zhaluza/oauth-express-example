require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('Express Server, yeeeeaaahhh'));

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT}`);
});
