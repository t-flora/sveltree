<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<svelte:head>
    <title>@{data.username}</title>
    <meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-8">
    <h1 class="text-purple-500 text-5xl">
        @{data.username}
    </h1>
    <img src={data.photoURL ?? './user.png'}
        alt="user profile"
        width="256"
        class="mx-auto"
    />
    <p class="text-xl my-8">{data.bio}</p>
    <ul>
        {#each data.links as link}
            {@debug link}
        {/each}
    </ul>

</main>