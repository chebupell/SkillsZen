import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./login";

type TsCardsProgress = {
  checkedCardIds: string[];
};

export const getTsCardsProgress = async (uid: string): Promise<TsCardsProgress> => {
  const reference = doc(db, "users", uid, "progress", "ts-cards");
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return { checkedCardIds: [] };
  }

  const data = snapshot.data();

  const checkedCardIds = Array.isArray(data.checkedCardIds)
    ? data.checkedCardIds.filter((item): item is string => typeof item === "string")
    : [];

  return { checkedCardIds };
}


export const saveTsCardsProgress = async (
  uid: string,
  checkedCardIds: string[],
): Promise<void> => {
  const reference = doc(db, "users", uid, "progress", "ts-cards");

  await setDoc(
    reference,
    {
      checkedCardIds,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
