<script lang="ts">
    // import AuthCheck from '$lib/components/AuthCheck.svelte';
    import { db, user } from '$lib/firebase';
    import { doc, getDoc, writeBatch } from 'firebase/firestore';

    let username = "";
    let loading = false;
    let isAvailable = false;

    let debounceTimer: NodeJS.Timeout;

    async function checkUsernameAvailability() {
        isAvailable = false;
        clearTimeout(debounceTimer);
        loading = true;

        debounceTimer = setTimeout(async () => {
            // check username availability
            // const ref = doc(db, "usernames", username);
            const exists = await getDoc(doc(db, "username", username)).then((doc) => doc.exists());
            isAvailable = !exists;
            loading = false;
        }, 500)
    }

</script>

<h2>username</h2>