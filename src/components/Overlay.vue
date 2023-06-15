<script setup>
  import { computed } from '@vue/reactivity';
import { onMounted, ref, toRef, watch } from 'vue';
  
  const props = defineProps(['width', 'height', 'boxes', 'frame'])
  
  const overlay = ref(null);
  let ctx = null;
  let scaleX = 2;
  let scaleY = 1.958; // wait, but why?

  function redraw() {
    if (ctx) {
      ctx.clearRect(0, 0, props.width, props.height);

      ctx.beginPath();
      
      props.boxes[props.frame].forEach(box => {
        ctx.moveTo(box[0] * scaleX,box[1] * scaleY);
        ctx.lineTo(box[2] * scaleX,box[3] * scaleY);
        ctx.lineTo(box[4] * scaleX,box[5] * scaleY);
        ctx.lineTo(box[6] * scaleX,box[7] * scaleY);
        ctx.lineTo(box[0] * scaleX,box[1] * scaleY);
      })
      ctx.stroke();
    }
    requestAnimationFrame(redraw)
  }

  onMounted(() => {
    ctx = overlay.value.getContext('2d')
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    redraw();
  });
</script>

<template>
  <canvas ref="overlay" class=" w-full" :width="props.width" :height="props.height">
  </canvas>
</template>

<style scoped>
</style>
