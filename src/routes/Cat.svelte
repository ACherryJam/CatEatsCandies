<script lang="ts">
    import { droppable } from "$lib/dnd";
    import { base } from "$app/paths";
    import { candiesEaten } from "./store";

    let audio: any;

    function dropelement(e: CustomEvent) {
        let elem: HTMLElement = e.detail;
        elem.remove();
        $candiesEaten++;

        // 5% chance to play a sound
        if (Math.random() < 0.05) {
            const r = Math.random();

            let src = `${base}/audio/`;
            if (r < 0.5) {
                // 50% chance to purr
                src += `purr${Math.randint(1, 4)}.mp3`;
            } else if (r < 0.9) {
                // 40% chance to meow
                src += `meow${Math.randint(1, 3)}.mp3`
            } else {
                // 10% chance for a looong purr
                src += "purrUnique1.mp3";
            }

            playAudio(src, 0.1);
        }
    }

    function playAudio(src: string, volume: number) {
        if (audio && audio.duration > 0 && !audio.paused) audio.pause();

        audio = new Audio(src);
        audio.volume = volume;
        audio.play();
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