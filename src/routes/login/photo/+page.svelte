<script lang="ts">
    import { user, userData, storage, db } from '$lib/firebase';
    import { doc, updateDoc } from 'firebase/firestore';
    import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
    import AuthCheck from '$lib/components/AuthCheck.svelte';

    // define preview URL
    let uploading = false;
    let previewURL: string;
    $: href = `/${$userData?.username}/edit`

    /**
     * Description
     * @param {any} e:any
     * @returns {undefined}
     */
    async function upload(e: any) {
        uploading = true;
        // select file and create URL for it
        const file = e.target.files[0];
        previewURL = URL.createObjectURL(file);
        const storageRef = ref(storage, `users/${$user!.uid}/profile.png`) // why profile.png?
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "users", $user!.uid), {photoURL: url});
        uploading = false;
    }

</script>

<h2>photo</h2>