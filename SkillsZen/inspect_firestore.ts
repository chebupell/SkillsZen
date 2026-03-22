import { collection, getDocs } from 'firebase/firestore'
import { db } from './src/services/login'

async function inspectFirestore() {
  const coursesSnap = await getDocs(collection(db, 'courses'));
  console.log('Courses:');
  for (const courseDoc of coursesSnap.docs) {
    console.log(`- Course ID: ${courseDoc.id}, Name: ${courseDoc.data().name}`);
    const blocksSnap = await getDocs(collection(db, 'courses', courseDoc.id, 'blocks'));
    for (const blockDoc of blocksSnap.docs) {
      console.log(`  - Block ID: ${blockDoc.id}, Name: ${blockDoc.data().name}`);
    }
  }
}

inspectFirestore();
