import { defineConfig } from '@prisma/client';

export default defineConfig({
  seed: 'ts-node prisma/seed.ts',
});
