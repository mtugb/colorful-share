<script lang="ts">
    import favicon from "#lib/assets/favicon.svg";
    import type { LayoutProps } from "./$types";

    let { children }: LayoutProps = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<main>
    {@render children()}
</main>

<style>
    /* header { */
    /*     height: 30px; */
    /*     border-bottom: 1px solid #000; */
    /* } */
    :root {
        /* --button-base: #fdf0d5; */
        /* --button-hover: darkgreen; */
        /* --form-text: #780000; */
        /* --background-body: #669bbc; */
    }
    main {
        display: block;
        width: 800px;
        max-width: 100%;
        margin: 0 auto;
    }
</style>
