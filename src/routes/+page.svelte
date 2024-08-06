<script lang="ts">
    import { sineInOut } from 'svelte/easing';

    import Cat from './Cat.svelte';
    import CandyBag from './CandyBag.svelte';

    import { candiesEaten } from "./store";

    function cancelEvent(e: Event) {
        e.preventDefault();
    }

	function whoosh(node: HTMLElement, params: { delay?: number, duration?: number, easing?: (t: number) => number }={}) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
        const h = 5;

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || sineInOut,
			css: (t: number) => `transform: ${existingTransform} translateY(-${Math.max(h-2*Math.abs(h*(t-0.5)), 0)}px)`
		};
	}
</script>

<!-- user-select: none; doesn't disable element selection, just hides it visually
     dragging while elements are selected results in ghost images, event cancelation solves this -->
<svelte:body
    on:selectstart={cancelEvent}
/>

<div style="width: 100vw; height: 100vh; padding: 5vmin 0 5vmin 0;">
    <div style="width: 100%; height: 100%; display: flex; justify-content: space-evenly; align-items: center; flex-direction: column;">
        <h1>Candies eaten:
            {#key $candiesEaten}
                <span class="candy-counter" in:whoosh>{$candiesEaten}</span>
            {/key}
        </h1>
        <div class="container">
            <CandyBag/>
            <Cat/>
        </div>
    </div>
</div>

<style>
    h1 {
        display: inline-block;
        width: fit-content;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
        /* flex-grow: 1; */
    }

    .candy-counter {
        display: inline-block;
    }

    @media (max-aspect-ratio: 2/3) {
        .container {
            flex-direction: column;
            justify-content: space-around;
            height: 100%;
        }
    }
</style>
