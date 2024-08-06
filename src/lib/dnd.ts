import type { ActionReturn } from "svelte/action";

type PointerCallback = (e: PointerEvent) => any;

// ===== DRAGGABLE ===== //

interface DraggableState {
    dragged: boolean,
    hovered: boolean,
    current_droppable: Element | null,
    move_callback?: PointerCallback
}

interface DraggableOptions {
    initLeft: number | null,
    initTop: number | null
}

export function draggable(node: HTMLElement, args: DraggableOptions)
{
    let state: DraggableState = {
        dragged: false,
        hovered: false,
        current_droppable: null
    }

    node.style.position = "absolute";
    node.style.touchAction = "none";
    node.classList.add("draggable");
    node.style.left = (args.initLeft ?? 0) + 'px';
    node.style.top = (args.initTop ?? 0) + 'px';

    function find_droppable(x: number, y: number): Element | null
    {
        node.hidden = true;
        let element = document.elementFromPoint(x, y);
        node.hidden = false;
        
        return element?.classList.contains("droppable") ? element : null;
    }

    function onpointerenter(e: PointerEvent) {
        state.hovered = true;
        node.style.cursor ="grab";
    }

    function onpointerleave(e: PointerEvent) {
        state.hovered = false;
        node.style.cursor = "auto";
    }

    function onpointerdown(e: PointerEvent) {
        node.setPointerCapture(e.pointerId);

        node.classList.add("dragged");
        node.style.cursor = "grabbing";
        
        let shiftX = e.isTrusted 
                        ? Math.clamp(e.clientX - node.getBoundingClientRect().left, 0, node.clientWidth) 
                        : node.clientWidth/2;
        let shiftY = e.isTrusted 
                        ? Math.clamp(e.clientY - node.getBoundingClientRect().top, 0, node.clientHeight)
                        : node.clientHeight/2;
        
        function move(e: PointerEvent) {
            if (!node.hasPointerCapture(e.pointerId))
                return;

            node.style.left = Math.clamp(e.pageX - shiftX, 0, window.innerWidth - node.clientWidth) + 'px';
            node.style.top = Math.clamp(e.pageY - shiftY, 0, window.innerHeight - node.clientHeight) + 'px';

            let droppable = find_droppable(e.pageX, e.pageY);

            if (state.current_droppable != droppable) {
                if (state.current_droppable) {
                    state.current_droppable.dispatchEvent(new DragEvent('dragleave'));
                }
                state.current_droppable = droppable;
                if (state.current_droppable) {
                    state.current_droppable.dispatchEvent(new DragEvent('dragenter'));
                }
            }
        }
        
        state.move_callback = move;
        window.addEventListener('pointermove', state.move_callback);
    }
    
    function onpointerup(e: PointerEvent) {
        node.classList.remove("dragged");
        node.style.cursor = "grab";
        
        if (state.current_droppable) {
            state.current_droppable.dispatchEvent(new CustomEvent('dragleave', {detail: node}));
            state.current_droppable.dispatchEvent(new CustomEvent('dropelement', {detail: node}));
        }

        window.removeEventListener('pointermove', state.move_callback!);
    }

    node.addEventListener('pointerenter', onpointerenter);
    node.addEventListener('pointerleave', onpointerleave);
    node.addEventListener('pointerdown', onpointerdown);
    node.addEventListener('pointerup', onpointerup);

    return {
        destroy() {
            node.removeEventListener('pointerenter', onpointerdown);
            node.removeEventListener('pointerleave', onpointerdown);
            node.removeEventListener('pointerdown', onpointerdown);
            node.removeEventListener('pointerup', onpointerup);
        }
    }
}

export function start_dragging(node: HTMLElement, e: PointerEvent) {
    let copyEvent = new PointerEvent('pointerdown', e);
    node.dispatchEvent(copyEvent);
}

// ===== DROPPABLE ===== //

interface DroppableState {
    hoveringElementCount: number
}

interface DroppableAttributes {
    'on:dropelement': (e: CustomEvent<HTMLElement>) => void;
}

export function droppable(node: HTMLElement): ActionReturn<undefined, DroppableAttributes> {
    let state: DroppableState = {
        hoveringElementCount: 0
    }
    node.classList.add("droppable");

    function ondragenter() {
        state.hoveringElementCount += 1;
        if (state.hoveringElementCount > 0) {
            node.classList.add("droppable-hovering");
        }
    }
    
    function ondragleave() {
        state.hoveringElementCount -= 1;
        if (state.hoveringElementCount <= 0) {
            node.classList.remove("droppable-hovering");
        }    
    }

    node.addEventListener("dragenter", ondragenter);
    node.addEventListener("dragleave", ondragleave);

    return {
        destroy() {
            node.removeEventListener("dragenter", ondragenter);
            node.removeEventListener("dragleave", ondragleave);
        }
    }
}