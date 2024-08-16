<script lang="ts">
    import Candy from './Candy.svelte';
    import { start_dragging } from '$lib/dnd';
	import { base } from '$app/paths';

    const src = "/candybag.png";
    $: _src = `${base}${src}`;

    let element: HTMLElement;

    let pointers: Set<number> = new Set();

    function addPointer(e: PointerEvent) {
        pointers.add(e.pointerId);
    }

    function removePointer(e: PointerEvent) {
        pointers.delete(e.pointerId);
    }

    function onLeave(e: PointerEvent) {
        if (pointers.has(e.pointerId)) {
            pointers.delete(e.pointerId);

            const candy = new Candy({ target: document.body, props: { startX: e.pageX, startY: e.pageY } });
            if (candy.element) {
                start_dragging(candy.element, e);
            }
        }
    }
</script>

<svelte:window
    on:pointerup={removePointer}
/>

<img 
    src={_src}
    bind:this={element}
    class="candybag"
    alt="Candy Bag" 
    draggable="false"
    
    on:pointerdown={addPointer}
    on:pointerleave={onLeave}
    on:pointercancel={removePointer}
    on:gotpointercapture={(e) => element.releasePointerCapture(e.pointerId)}
>

<style>
    .candybag {
        touch-action: none;
        user-select: none;
        max-height: 50vmin;
        width: auto;
        height: auto;
    }
</style>