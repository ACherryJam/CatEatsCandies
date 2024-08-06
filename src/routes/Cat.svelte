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

    on:dropelement={dropelement}
    use:droppable
>

<style>
    :global(body::after) {
        position:absolute; width:0; height:0; overflow:hidden; z-index:-1;
        content: url("/cat-open.png") url("/cat-closed.png");
    }

    img {
        user-select: none;
        content: url("/cat-closed.png");
        max-height: 70vmin;
        height: auto;
        width: auto;
    }

    img:global(.droppable-hovering) {
        content: url("/cat-open.png");
    }
</style>