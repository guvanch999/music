<template>
  <div class="popUpBg">
    <div class="popUpCardClass" style="width: 30%">
      <v-card tile style="position: relative">
        <v-card-title>
          Upload photo
          <v-spacer/>
          <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <div class="text-center">
            <img :src="image_url" alt="" width="90%">
          </div>
          <v-file-input v-model="image" dense label="Choose image:" placeholder="Choose image:" outlined/>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="closeDialog" small depressed>cancel</v-btn>
          <v-btn @click="uploadPhotoHandler" small depressed style="background-color: #32BCA3;color: white">upload
          </v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
    </div>
    <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage =null"/>
  </div>
</template>
<script>
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import {mapActions, mapGetters} from "vuex";

export default {
  props: {
    album: {
      type: Object,
    }
  },
  components: {ErrorComponent, LoadingComponent},
  data() {
    return {
      isLoading: false,
      image: null,
      errorMessage: null
    }
  },
  methods: {
    ...mapActions({
      uploadPhoto: 'albums/addImage'
    }),
    closeDialog() {
      this.$emit("closeDialog")
    },
    async uploadPhotoHandler() {
      if (!this.image) {
        alert("Please choose an image!!!")
        return
      }
      if (this.isLoading) return
      this.isLoading = true
      let form = new FormData()
      form.append('photo', this.image)
      let success = await this.uploadPhoto({album_id: this.album.id, form})
      this.isLoading = false
      if (success) {
        this.closeDialog()
      } else {
        this.errorMessage = "Cannot upload photo!!! Please check internet connection and try again!!!"
      }
    }
  },
  computed: {
    ...mapGetters({
      image_base: "get_image_base_url"
    }),
    image_url() {
      if (this.image) {
        return URL.createObjectURL(this.image)
      }
      if (this.album && this.album.image_url) {
        return this.image_base + this.album.image_url
      }

      return '/no-image.jpg'
    }
  }
}
</script>
