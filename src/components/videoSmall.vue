<template>
  <div>
    <div class="model-title"></div>
    <div class="video-container">
      <div id="mse" ref="test"></div>
    </div>
  </div>
</template>

<script setup>
import Player from 'xgplayer';
import FlvPlugin from 'xgplayer-flv';
import 'xgplayer/dist/index.min.css';
import { onMounted, ref } from 'vue';
const test = ref();
var videoPlayer = null;
const getVideo = () => {
  videoPlayer = new Player({
    id: 'mse',
    isLive: true,
    width: 280,
    height: 180,
    autoplay: true,
    plugins: [FlvPlugin],
    url: 'https://172.51.215.158:30082/live/34020000001320000026@34020000001320000001.flv',
    flv: {
      retryCount: 3, // 重试 3 次，默认值
      retryDelay: 1000, // 每次重试间隔 1 秒，默认值
      loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
      fetchOptions: {
        // 该参数会透传给 fetch，默认值为 undefined
        mode: 'cors',
      },
    },
    meta: {
      width: 300,
    },
  });
};
onMounted(() => {
  getVideo();
});
</script>

<style scoped lang="less">
.video-container {
  box-sizing: border-box;
  position: relative;
  width: 300px;
}

#mse {
  width: 300px;
}
</style>
