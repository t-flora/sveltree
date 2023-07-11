<script lang="ts">
    import { page } from "$app/stores";
    import { db, userData, user } from '$lib/firebase';
    import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
    import { writable } from "svelte/store";
    import UserLink from "$lib/components/UserLink.svelte";

    type LinkType = {
        icon: string,
        title: string,
        url: string,
    }
    
    const icons = [ // standard icons in application
        "Twitter",
        "YouTube",
        "LinkedIn",
        "Github",
        "Custom"
    ]

    // create a form data store
    const defaultForm = {
        icon: "Custom",
        title: "custom URL",
        url: "https://",
    }

    const formData = writable(defaultForm);

    // set reactive declarations subscribing to formData store
    $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
    $: formIsValid = urlIsValid && titleIsValid;

    let showForm = false;
    // add, delete, or cancel the addition of a link
    async function add(e: SubmitEvent) {
        // What would I need to add a link? I'd need to write to the firestore database -> specifically to the user's link attribute
        const userRef = doc(db, "users", $user!.uid);

        // run updateDoc to write to collection
        await updateDoc(userRef, {
            links: arrayUnion(
                { ...$formData,
                id: Date.now().toString() }),
        });

        formData.set({
            icon: "",
            url: "",
            title: "",
        });

        showForm = false;
    }

    async function deleteLink(item: LinkType) {
        const userRef = doc(db, "users", $user!.uid);

        await updateDoc(userRef, {
            links: arrayRemove(item)
        });
    }

    function cancelLink() {
        formData.set(defaultForm);
        showForm = false;
    }
</script>