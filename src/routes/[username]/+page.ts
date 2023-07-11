import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export const load = (async ({ params }) => {

    const collectionRef = collection(db, 'users'); // create ref to firestore collection
    const q = query(
        collectionRef,
        where("username", "==", params.username),
        limit(1), // only query at most 1 result
    )

    const snapshot = await getDocs(q);
    const exists = snapshot.docs[0]?.exists();
    const data = snapshot.docs[0]?.data();

    if (!exists) {
        throw error(404, "user doesn't exist")
    }
    if ( !data.published ) {
        throw error(403, `Profile of @${data.username} isn't public`)
    }

    return {
        username: data.username,
        links: data.links ?? [],
        photoURL: data.photoURL,
        bio: data.bio,
    };
}) satisfies PageLoad;