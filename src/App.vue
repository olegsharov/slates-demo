<script setup>
  import { computed } from '@vue/reactivity';
  import { onMounted, ref } from 'vue'
  import Overlay from './components/Overlay.vue'
  import Events from './components/Events.vue'
  
  const player = ref(null)
  const time = ref(0)

  const framerate = computed(() => {
    return meta.value && parseInt(meta.value.framerate.split("/")[0]) / parseInt(meta.value.framerate.split("/")[1]);
  });

  const frame = computed(() => Math.round(time.value * framerate.value))
  const durationFrames = computed(() => duration.value = Math.round((player.value && player.value.duration || 0) * framerate.value))

  let selectedVideo = ref(null)
  let loaded = ref(false)
  let videoWidth = ref(0)
  let videoHeight = ref(0)
  let videoUrl = computed(() => `${import.meta.env.VITE_SERVER_URL}/video/${selectedVideo.value}`)
  let boxesUrl = computed(() => `${import.meta.env.VITE_SERVER_URL}/video/${selectedVideo.value}/boxes.json`)
  let metaUrl = computed(() => `${import.meta.env.VITE_SERVER_URL}/video/${selectedVideo.value}/meta.json`)
  let boxes = ref(null)
  let videos = ref(null)
  let meta = ref(null)
  let duration = ref(null)

  onMounted(async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/videos.json`)
    videos.value = await response.json();
  })

  async function canPlay(event) {
    videoWidth.value = event.target.videoWidth;
    videoHeight.value = event.target.videoHeight;
    await fetch(boxesUrl.value)
      .then(r => r.json())
      .then(json => boxes.value = json);
    await fetch(metaUrl.value)
      .then(r => r.json())
      .then(json => meta.value = json);
    duration.value = player.value.duration;
    update();
    loaded.value = true;
  }

  function update() {
    time.value = player.value.currentTime;
    requestAnimationFrame(update);
  }

  function updateTime(event) {
    // time.value = event.target.currentTime;
  }

  function seekFrame(frame) {
    player.value.currentTime = frame / framerate.value;
  }

  function nextFrame() {
    player.value.currentTime = time.value + 1/framerate.value;
  }

  function prevFrame() {
    player.value.currentTime = time.value - 1/framerate.value;
  }

</script>

<template>
  <div class="flex relative w-full h-full">
    
    <div class="flex flex-col flex-grow bg-stone-900 max-w-96 w-96">
        <div v-if="videos" class="flex flex-col relative flex-grow relative h-full">
          <div class="absolute inset-0 overflow-y-auto p-2">
            <div class="py-2 text-stone-400"> <b>Videos</b> </div>
            <div v-for="(video, index) in videos" :key="index" 
              class="text-sm p-2 hover:bg-stone-500 hover:text-stone-800 cursor-pointer" 
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
          v-if="loaded">
        </Overlay>
        
        <Events :boxes="boxes" :frame="frame" :player="player" :duration="durationFrames" @seek="seekFrame($event)">
        </Events>

      </div>
      <div class="relative flex items-center justify-center flex-grow w-full text-stone-600 text-xs font-bold uppercase" v-else>
        Pick a video
      </div>

      <!-- <div class="flex flex-col flex-grow bg-stone-800 max-w-1/2 w-1/2" v-if="loaded && boxes">
        <div class="flex flex-col relative flex-grow relative text-stone-400">
          <div class="absolute inset-0 overflow-y-auto p-4">
            <div class="py-2"> 
              <div class="flex items-center">
                <div class="flex items-center">
                  <button class="btn shadow-sm" @click="prevFrame()">«</button>
                  <span class="px-2"><b>Frame:</b> {{gnome-tweak-tool
 frame }}</span>
                  <button class="btn shadow-sm" @click="nextFrame()">»</button>
                </div>
                <div class="pl-4">
                  <b>Current time:</b> {{ time }}</div>
                </div>
              </div>
              <div v-for="(box, index) in boxes[frame]" :key="index" class="text-sm">
                {{ box }}
              </div>
          </div>
        </div>
      </div> -->
      
  </div>
</template>

<style scoped>
</style>
