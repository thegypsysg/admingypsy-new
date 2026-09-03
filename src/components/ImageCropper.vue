<template>
  <div class="border rounded vue-avatar-cropper-demo text-center">
    <div class="p-6">
      <div class="relative">
        <img :src="user.avatar" @click="showCropper = true" class="avatar" />
      </div>
    </div>
    <!-- NOTE: v-html di sini aman — variabel 'message' adalah hardcoded string 'ready', bukan user input.
         Jika komponen ini diaktifkan di masa depan dengan data dinamis, tambahkan sanitizeHtml(). -->
    <div class="border-t p-6 text-gray-500" v-html="message"></div>
    <avatar-cropper
      @changed="handleUpload"
      :cropper-options="{ zoomable: true }"
      v-model="showCropper"
    />
  </div>
</template>

<script>
import AvatarCropper from 'vue-avatar-cropper';

export default {
  name: 'ImageCropper',
  components: { AvatarCropper },
  data() {
    return {
      showCropper: false,
      message: 'ready',
      user: {
        id: 1,
        nickname: '安正超',
        username: 'overtrue',
        avatar: 'https://avatars0.githubusercontent.com/u/1472352?s=460&v=4',
      },
    };
  },
  methods: {
    handleUploaded(e) {
      var files = e.target.files || e.dataTransfer.files;
      console.log(files);
    },
  },
};
</script>

<style>
.vue-avatar-cropper-demo {
  max-width: 18em;
  margin: 0 auto;
}
.avatar {
  width: 160px;
  border-radius: 6px;
  display: block;
  margin: 20px auto;
}
.card-img-overlay {
  display: none;
  transition: all 0.5s;
}
.card-img-overlay button {
  margin-top: 20vh;
}
.card:hover .card-img-overlay {
  display: block;
}
</style>
