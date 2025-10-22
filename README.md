# Indexing Counter App Transactions (Solana Devnet)

A tiny Solana indexer that listens to transactions via Yellowstone gRPC and stores them in PostgreSQL using Prisma. The stream is configured for Solana Devnet and uses the free parafi.tech gRPC service.

- Counter app repo: git@github.com:kishu279/counter-app-charges-money.git
- Deployment: Counter app is deployed on-chain (Solana Devnet)

## Stack

- Runtime: Bun
- Indexing: @triton-one/yellowstone-grpc (parafi.tech gRPC)
- DB: PostgreSQL + Prisma
- Chain: Solana Devnet

## Prerequisites

- Bun v1.2+
- PostgreSQL database URL

## Setup

1. Install dependencies

```bash
bun install
```

2. Configure environment

```bash
cp .env.example .env
# edit .env to set DATABASE_URL
```

3. Prepare the database (apply Prisma migrations and generate client)

```bash
bunx prisma migrate deploy
bunx prisma generate
```

## Run the indexer

Start the subscription stream and persist incoming transactions:

```bash
# with script
bun run start

# or directly
bun run src/index.ts
```

The stream is currently pointed at Solana Devnet and filters for the Counter app-related accounts (see `src/index.ts`). To switch networks or endpoints, update the Yellowstone gRPC client URL in `src/index.ts` to your preferred parafi.tech endpoint.

## Notes

- Data is stored in the `UserTransactions` table (see `prisma/schema.prisma`).
- Ensure your `DATABASE_URL` in `.env` points to a reachable PostgreSQL instance.
- You can inspect data with:

```bash
bunx prisma studio
```
