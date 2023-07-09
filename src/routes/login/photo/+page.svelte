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

<AuthCheck>
    <h2 class="card-title">upload a profile pic</h2>

    <form class="max-w-screen-md w-full">
        <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
            <img
                src={previewURL ?? $userData?.photoURL ?? "/user.png"}
                alt="photo URL"
                width="256"
                height="256"
                class="mx-auto"
            />
            <label for="photoURL" class="label">
                <span class="label-text">pick a file</span>
            </label>
            <input
                on:change={upload}
                name="photoURL"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
            {#if uploading}
                <p>uploading...</p>
                <progress class="progress progress-info w-56 mt-6" />
            {/if}
        </div>

        <a {href} class="btn btn-primary">finish</a>
    </form>
</AuthCheck>