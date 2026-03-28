import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from 'firebase/firestore'
import { db } from './login'

type TsCardsProgress = {
  checkedCardIds: string[]
}

const getTsCardsProgressReference = (uid: string) => {
  return doc(db, 'users', uid, 'progress', 'ts-cards')
}

export const getTsCardsProgress = async (uid: string): Promise<TsCardsProgress> => {
  const reference = getTsCardsProgressReference(uid)
  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return { checkedCardIds: [] }
  }

  const data = snapshot.data()

  const checkedCardIds = Array.isArray(data.checkedCardIds)
    ? data.checkedCardIds.filter((item): item is string => typeof item === 'string')
    : []

  return { checkedCardIds }
}

export const setTsCardCheckedState = async (
  uid: string,
  cardId: string,
  isChecked: boolean,
): Promise<void> => {
  const reference = getTsCardsProgressReference(uid)
  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    await setDoc(reference, {
      checkedCardIds: isChecked ? [cardId] : [],
      updatedAt: serverTimestamp(),
    })
    return
  }

  await updateDoc(reference, {
    checkedCardIds: isChecked ? arrayUnion(cardId) : arrayRemove(cardId),
    updateAt: serverTimestamp(),
  })
}

export const resetTsCardsProgress = async (uid: string): Promise<void> => {
  const reference = getTsCardsProgressReference(uid)

  await setDoc(
    reference,
    {
      checkedCardIds: [],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
