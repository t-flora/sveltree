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
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), {uid: $user?.uid});
        batch.set(doc(db, "users", $user!.uid), {
            username,
            photoURL: $user?.photoURL ?? null,
            published: true,
            bio: "test bio",
            links: [
                {
                    title: "test link here",
                    url: "example.com",
                    icon: "custom",
                }
            ]
        });

        await batch.commit();
        username = "";
        isAvailable = false;
    }

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    $: isValid = username?.length > 2 && username?.length < 16 && re.test(username);
    $: isTouched = username?.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;

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
            class:input-error={(!isValid && isTouched)}
            class:input-warning={isTaken}
            class:input-success={isValid && isValid && !loading}
        />
        <div class="my-4 min-h-16 px-8 w-full">
            {#if loading}
                <p class="text-secondary">checking availability of @{username}</p>
            {/if}
            {#if !isValid && isTouched}
                <p class="text-error text-sm">username must be 3-16 chars long, and alphanumeric</p>
            {/if}
            {#if isTaken}
                <p class="text-warning text-sm">username {username} is taken</p>
            {/if}
            {#if isAvailable}
                <button class="btn btn-success">confirm username @{username}</button>
            {/if}
        </div>
        <!-- <p>{ (isAvailable && "username available") || (!isAvailable && "username is taken!")}</p> -->
    </form>
</AuthCheck>