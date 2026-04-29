import { env } from './config/env';
import { prisma } from './db/prisma';
import { app } from './app';

async function main() {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
