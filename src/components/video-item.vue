<template>
  <div>
    <video ref="videoElement" :src="rtspUrl" controls></video>
  </div>
</template>

<script>
import DPlayer from 'dplayer';

export default {
  data() {
    return {
      rtspUrl: 'rtsp://admin:tct123456@172.48.0.252:554/1', // RTSP流的URL地址
      player: null
    };
  },
  mounted() {
    this.player = new DPlayer({
      container: this.$refs.videoElement, // 视频容器元素
      autoplay: true, // 自动播放
      loop: true, // 循环播放
      subtitles: { // 字幕配置
        url: 'example.vtt', // 字幕文件的URL地址
        lang: 'en' // 字幕语言（这里假设字幕文件是英文的）
      }
    });
    this.player.on('error', () => {
      console.error('DPlayer播放出错');
    });
  }
};
</script>