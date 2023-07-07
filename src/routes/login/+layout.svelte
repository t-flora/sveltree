<script lang="ts">
    import { page } from '$app/stores';
  import AnimatedRoutes from '$lib/components/AnimatedRoutes.svelte';
</script>

<nav class="flex justify-center my-6">
    <ul class="steps">
        <a class="step step-primary" href="/login">sign in</a>
        <a class="step" class:step-primary={$page.route.id?.match(/username|photo/g)} href="/login/username">choose username</a>
        <a class="step" class:step-primary={$page.route.id?.includes("photo")} href="/login/photo">select photo</a>
    </ul>
</nav>

<AnimatedRoutes>
    <main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
        <div class="card-body items-center text-center">
            <slot />
        </div>
    </main>
</AnimatedRoutes>