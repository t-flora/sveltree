<script lang="ts">
    import { user } from "$lib/firebase";
</script>
<!-- <h1 class=" text-green-500">Welcome to SvelteKit, but why no work</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<a href="/hello">Hellooo</a> -->
{#if $user}
    <slot />
{:else}
    <p class="text-error">
        you must be signed in to view this, lad
        <a class="btn btn-primary" href="/login">sign in</a>
    </p>
{/if}