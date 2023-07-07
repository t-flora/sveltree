<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
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
            const ref = doc(db, "usernames", username);
            const exists = await getDoc(ref).then((doc) => doc.exists());
            isAvailable = !exists;
            loading = false;
        }, 500)
    }

    async function confirmUsername() {
        // 
    }

</script>

<AuthCheck>
    <h2>username</h2>
    <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
        <input
            type="text"
            placeholder="username"
            class="input w-full"
            bind:value={username}
            on:input={checkUsernameAvailability}
        />

        <p>{ (isAvailable && "username available") || (!isAvailable && "username is not available")}</p>
        
        <button class="btn btn-success">confirm username @{username}</button>
    </form>
</AuthCheck>