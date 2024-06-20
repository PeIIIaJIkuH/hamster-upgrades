import { FirebaseApp } from 'firebase/app';
import {
	addDoc,
	collection,
	DocumentData,
	getDocs,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	Timestamp,
} from 'firebase/firestore';
import { createSignal } from 'solid-js';

import { useAuth } from './useAuth';

export const useFirestore = (app: FirebaseApp) => {
	const db = getFirestore(app);
	const authState = useAuth(app);

	const addData = async (collectionName: string, data: Record<string, unknown>) => {
		const doc = await addDoc(collection(db, collectionName), {
			...data,
			from: authState?.user?.uid,
			created: Timestamp.now(),
		});
		console.log('doc', doc);
	};

	const getData = (collectionName: string) => {
		const [data, setData] = createSignal<DocumentData[]>([]);
		getDocs(collection(db, collectionName)).then((records) => {
			setData(records.docs.map((doc) => doc.data()));
		});

		const q = query(collection(db, collectionName), orderBy('created', 'asc'));
		onSnapshot(q, (snapshot) => {
			setData(snapshot.docs.map((doc) => doc.data()));
		});
		return data;
	};

	return { db, addData, getData };
};
