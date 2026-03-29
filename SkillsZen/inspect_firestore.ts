import { collection, getDocs } from 'firebase/firestore'
import { db } from './src/services/login'

async function inspectAnswers() {
  const blocksSnap = await getDocs(collection(db, 'courses', 'js_course', 'blocks'))
  for (const blockDoc of blocksSnap.docs) {
    const qSnap = await getDocs(
      collection(db, 'courses', 'js_course', 'blocks', blockDoc.id, 'questions'),
    )
    for (const qDoc of qSnap.docs) {
      console.log('Question:', qDoc.data().text)
      console.log('Answers:', JSON.stringify(qDoc.data().answers, null, 2))
      break
    }
    break
  }
}

inspectAnswers()
