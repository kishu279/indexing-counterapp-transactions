import Client, {
  CommitmentLevel,
  SubscribeRequest,
  SubscribeUpdate,
} from "@triton-one/yellowstone-grpc";

import bs58 from "bs58";
import { createNewEntry } from "./db";

const client = new Client(
  "https://api.devnet.solana.com",
  undefined,
  undefined
);

function decodeToBs58(data: Buffer) {
  if (!data || !Buffer.isBuffer(data)) {
    return null;
  }
  return bs58.encode(data);
}

// handler for incoming updates
async function handleUpdate(data: SubscribeUpdate) {
  console.dir(data, { depth: 10 });

  // capture only the transactions data
  const tx = data.transaction;

  const transaction = tx?.transaction;

  const signature = transaction?.signature.toBase64();

  const accountKeys = transaction?.transaction?.message?.accountKeys || [];
  const signer = decodeToBs58(accountKeys[0] as Buffer);

  const slot = tx?.slot;
  console.log("Slot: ", slot);
  console.log("Signature: ", signature);
  console.log("Signer: ", signer);

  // create a new entry in the database
  if (signer && slot !== undefined && signature) {
    const response = await createNewEntry({
      userPublicKey: signer,
      slot: slot,
      transactionSignature: signature,
    });

    console.log("Database entry created successfully");
    console.log(response);
    return;
  }
}

async function main() {
  const stream = await client.subscribe();

  //   create promise to wait for stream to close
  const streamClosed = new Promise<void>((resolve, reject) => {
    stream.on("error", (error) => {
      reject(error);
      stream.end();
    });
    stream.on("end", () => resolve());
    stream.on("close", () => resolve());
  });

  stream.on("data", handleUpdate);

  const subscribeRequest: SubscribeRequest = {
    accounts: {},
    slots: {},
    transactions: {
      "solana-counter-transactions": {
        // eg: listen to vote transactions
        accountInclude: [],
        accountExclude: [],
        accountRequired: [
          "794WyttcZeD1xWA3aXN4er2DW4JhjS48qigdmGM2cbvL",
          "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
        ],
      },
    },
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.CONFIRMED,
  };

  await new Promise<void>((resolve, reject) => {
    stream.write(subscribeRequest, (error: any) => {
      if (error) {
        reject(error);
        stream.end();
      } else resolve();
    });
  }).catch((error) => {
    console.error(error);
    throw error;
  });
}

main();
