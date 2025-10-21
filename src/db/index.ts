import client from "./client";

type dataToEnter = {
  userPublicKey: string;
  slot: string;
  transactionSignature: string;
};

// function to create a new entry
async function createNewEntry(data: dataToEnter) {
  const { userPublicKey, slot, transactionSignature } = data;

  const transaction = await client.userTransactions.create({
    data: { userPublicKey, slot: Number(slot), transactionSignature },
  });

  return transaction;
}

export { createNewEntry };
