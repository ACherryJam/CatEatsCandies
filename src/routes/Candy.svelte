<script lang="ts">
    import { draggable } from "$lib/dnd";

    let src = "./candy.png";

    export let startX = 0;
    export let startY = 0;

    const _top = startY;
    const _left = startX;

    export let element = null;
</script>

<svelte:options accessors={true}/>
<div use:draggable={{initLeft: _left, initTop: _top}} bind:this={element}>
    <img 
        {src}
        alt="Candy" 
        draggable="false"
    />
</div>

<style>
    img {
        height: 10vh;
        user-select: none;
        touch-action: none;
    }

    :global(body::after) {
        position:absolute; width:0; height:0; overflow:hidden; z-index:-1;
        content: url("/candy.png");
    }
</style>