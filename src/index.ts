import { runApp } from './app';

const port = process.env.PORT || 3000;

(async () => {
  const app = await runApp(); // Assuming runApp() returns your app or a server instance
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
