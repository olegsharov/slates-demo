<script setup>
  import { computed } from '@vue/reactivity';
  import { onMounted, ref } from 'vue'
  import Overlay from './components/Overlay.vue'
  
  const player = ref(null)
  const time = ref(0)

  const frame = computed(() => {
    return Math.round(time.value*24);
  })

  let selectedVideo = ref(null)
  let loaded = ref(false)
  let videoWidth = ref(0)
  let videoHeight = ref(0)
  let videoUrl = computed(() => `${import.meta.env.VITE_SERVER_URL}/video/${selectedVideo.value}`)
  let boxesUrl = computed(() => `${import.meta.env.VITE_SERVER_URL}/video/${selectedVideo.value}/boxes.json`)
  let boxes = ref(null)
  let videos = ref(null)

  onMounted(async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/videos.json`)
    videos.value = await response.json();
  })

  async function canPlay(event) {
    videoWidth.value = event.target.videoWidth;
    videoHeight.value = event.target.videoHeight;
    const response = await fetch(boxesUrl.value);
    boxes.value = await response.json();
    loaded.value = true;
  }

  function updateTime(event) {
    time.value = event.target.currentTime;
  }

</script>

<template>
  <div class="flex relative w-full h-full">
    
    <div class="flex flex-col flex-grow bg-stone-900 max-w-96 w-96">
        <div v-if="videos" class="flex flex-col relative flex-grow relative h-full">
          <div class="absolute inset-0 overflow-y-auto p-2">
            <div class="py-2 text-stone-400"> <b>Videos</b> </div>
            <div v-for="(video, index) in videos" :key="index" 
              class="text-sm p-2 hover:bg-stone-500 hover:text-stone-800 ponter-default" 
              :class="{
                'bg-stone-500 text-stone-800' : selectedVideo == video,
                'text-stone-500' : selectedVideo != video
              }"
              @click="selectedVideo = video">
              {{ video }}
            </div>
          </div>
        </div>
      </div>

      <div class="relative flex-grow w-full" v-if="selectedVideo">
        <video class="w-full" :src="videoUrl" controls="true" ref="player" @timeupdate="updateTime($event)" @canplay="canPlay($event)"></video>
        <Overlay class="absolute inset-0 z-10 pointer-events-none" 
          :width="videoWidth" 
          :height="videoHeight" 
          :boxes="boxes"
          :frame="frame"
          v-if="loaded"></Overlay>  
      </div>
      <div class="relative flex items-center justify-center flex-grow w-full text-stone-600 text-xs font-bold uppercase" v-else>
        Pick a video
      </div>

      <div class="flex flex-col flex-grow bg-stone-800 max-w-1/2 w-1/2" v-if="loaded && boxes">
        <div class="flex flex-col relative flex-grow relative text-stone-400">
          <div class="absolute inset-0 overflow-y-auto p-4">
            <div class="py-2"> <b>Frame:</b> {{ frame }} <b>Current time:</b> {{ time }}</div>
            <div v-for="(box, index) in boxes[frame]" :key="index" class="text-sm">
              {{ box }}
            </div>
          </div>
        </div>
      </div>
      
  </div>
</template>

<style scoped>
</style>
