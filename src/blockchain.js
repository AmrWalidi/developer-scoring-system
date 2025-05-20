import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase/firebase";

const hashBlock = async (blockData) => {
  const sortedData = deepSort(blockData);
  console.log(sortedData);
  const blockString = JSON.stringify(sortedData);

  const encoder = new TextEncoder();
  const data = encoder.encode(blockString);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const deepSort = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(deepSort);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = deepSort(obj[key]);
        return result;
      }, {});
  }
  return obj;
};

export const addBlock = async (userId, score) => {
  const blocks = await getBlocks();
  const latestBlock = await getLatestBlock();
  const blockData = {
    index: blocks.length,
    transaction: [{ user_id: userId }, score],
    time_created: new Date().toISOString(),
    nonce: 0,
    previous_hash: latestBlock["hash"],
  };
  blockData["hash"] = await hashBlock(blockData);
  await addDoc(collection(db, "Block"), blockData);
};

export const getBlocks = async () => {
  try {
    const q = query(collection(db, "Block"), orderBy("time_created", "asc"));
    const querySnapshot = await getDocs(q);
    const blockchain = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        blockchain.push(doc.data());
      });
    }
    return blockchain;
  } catch (error) {
    console.log(error.message);
  }
};

const getLatestBlock = async () => {
  try {
    const blockchain = await getBlocks();
    return blockchain[blockchain.length - 1];
  } catch (error) {
    console.log(error.message);
  }
};

export const haveBeenScored = async (id) => {
  const blockchain = await getBlocks();
  return blockchain.some((block) => block.transaction[0].user_id === id);
};

export const validateBlock = async (id) => {
  try {
    let valid = true;
    let message = "";
    const blockchain = await getBlocks();

    for (let idx = 0; idx < blockchain.length; idx++) {
      const block = blockchain[idx];
      if (block.transaction[0].user_id === id) {
        const current = block;
        const previous = blockchain[idx - 1];

        const { hash, ...blockWithoutHash } = current;
        const generatedHash = await hashBlock(blockWithoutHash);

        if (hash !== generatedHash) {
          valid = false;
          message = "Bu Veri geçersiz! Veri değiştirilmiş olabilir";
          break;
        }

        if (previous && current.previous_hash !== previous.hash) {
          valid = false;
          message = "Zincir kopmuş! Veri güvende değil";
          break;
        }
      }
    }

    return { valid, message };
  } catch (error) {
    console.log(error.message);
  }
};
