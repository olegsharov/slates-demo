<script setup>
  import { computed } from '@vue/reactivity';
import { onMounted, ref, toRef, watch } from 'vue';
  
  const props = defineProps(['boxes', 'frame', 'player', 'duration'])
  const emit = defineEmits(['seek']);
  
  const events = ref(null);
  let ctx = null;
  let scaleX = 2;
  let scaleY = 1.958; // wait, but why?

//   function redraw() {
//     if (ctx) {
//       ctx.lineWidth = 5;
//       ctx.strokeStyle = "red";

//       ctx.clearRect(0, 0, events.value.width, events.value.height);

//       ctx.beginPath();
            
//       ctx.stroke();
//     }
//     requestAnimationFrame(redraw)
//   }

    function drawBoxes() {
        const width = events.value.clientWidth;
        const height = events.value.clientHeight;
        ctx.clearRect(0, 0, width, height);
        const boxEvents = {};
        let maxEvents = 0;
        for (let frame of Object.keys(props.boxes)) {
            boxEvents[frame] = props.boxes[frame].length;
            maxEvents = Math.max(boxEvents[frame], maxEvents);
        }
        const maxPower = 1 / maxEvents;
        ctx.lineWidth = 1;
        for (let frame of Object.keys(boxEvents)) {
            let x = width * frame / props.duration;
            if (boxEvents[frame] > 0) {
                let power = maxPower * boxEvents[frame];
                ctx.strokeStyle = `rgba(255, 0, 0, ${power})`;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }

    }

    const width = computed(() => events.value && events.value.parentNode.clientWidth || 0);
    const height = computed(() => events.value && events.value.parentNode.clientHeight || 0);


    watch(() => props.duration, () => drawBoxes())
    const playheadOffet = computed(() => {
        return props.frame * width.value / props.duration;
    });

    onMounted(() => {
        ctx = events.value.getContext('2d')
    });

    const seeking = ref(false);

    function startSeek() {
        seeking.value = true;
    }

    function stopSeek() {
        seeking.value = false;
    }

    function seek(event) {
        if (seeking.value) {
            seekFrame(event);
        }
    }

    function seekFrame(event) {
        const frame = Math.round(props.duration * event.offsetX / width.value);
        emit('seek', frame);
    }
</script>

<template>
  <div class="bg-stone-700 relative h-24 w-full relative" @click="seekFrame($event)" @mousedown="startSeek()" @mouseup="stopSeek()" @mousemove="seek($event)">
    <canvas ref="events" class="absolute" :width="width" :height="height"></canvas>
    <div class="h-full w-0.5 border-red-200 bg-white z-10 absolute top-0 pointer-events-none" :style="{'left': `${playheadOffet}px`}"></div>
  </div>
</template>

<style scoped>
</style>
