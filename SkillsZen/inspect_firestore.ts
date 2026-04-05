import { collection, getDocs } from 'firebase/firestore'
import { db } from './src/services/firebase'
import { toast } from 'sonner'

async function inspectAnswers() {
  const blocksSnap = await getDocs(collection(db, 'courses', 'js_course', 'blocks'))
  for (const blockDoc of blocksSnap.docs) {
    const qSnap = await getDocs(
      collection(db, 'courses', 'js_course', 'blocks', blockDoc.id, 'questions'),
    )
    for (const qDoc of qSnap.docs) {
      toast.error(`${qDoc}`)
      break
    }
    break
  }
}

inspectAnswers()
