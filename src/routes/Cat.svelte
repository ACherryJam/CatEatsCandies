<script lang="ts">
    import { candiesEaten } from "./store";
    import { droppable } from "$lib/dnd";

    function dropelement(e: CustomEvent) {
        let elem: HTMLElement = e.detail;
        elem.remove();
        $candiesEaten++;
    }
</script>

<img 
    alt="Cat"
    draggable="false"
    style:--growth={$candiesEaten}

    on:dropelement={dropelement}
    use:droppable
>

<style>
    :global(body::after) {
        position:absolute; width:0; height:0; overflow:hidden; z-index:-1;
        content: url("/cat-open.png") url("/cat-closed.png");
    }

    img {
        --start-size: 70vmin;
        --max-growth: 20vmin;

        user-select: none;
        content: url("/cat-closed.png");
        max-height: min(
            calc(var(--start-size) + 0.01vmin * var(--growth)), /* current height */
            calc(var(--start-size) + var(--max-growth)) /* max height */
        );
        height: auto;
        width: auto;
    }

    img:global(.droppable-hovering) {
        content: url("/cat-open.png");
    }
</style>