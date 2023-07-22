<template>
  <div class="popUpBg">
    <div class="popUpCardClass" style="width: 30%">
      <v-card tile style="position: relative">
        <v-card-title>
          Upload track form
          <v-spacer/>
          <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <label>Choose an track file:</label>
          <v-file-input v-model="track" dense hide-details outlined/>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="closeDialog" small depressed>cancel</v-btn>
          <v-btn @click="uploadTrackHandler" small depressed style="background-color: #32BCA3;color: white">save</v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
    </div>
    <error-component v-if="errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

export default {
  components: {ErrorComponent, LoadingComponent},
  props: {
    song: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      track: null,
      errorMessage: null,
      isLoading: false
    }
  },
  methods: {
    ...mapActions({
      uploadTrack: 'songs/uploadTrack'
    }),
    closeDialog() {
      this.$emit('closeDialog')
    },
    async uploadTrackHandler() {
      if (!this.track) {
        alert("Choose an track please!!!")
        return
      }
      if (this.isLoading) return
      this.isLoading = true
      let form = new FormData()
      form.append("track", this.track)
      let success = await this.uploadTrack({song_id: this.song.id, form})
      this.isLoading = false
      if (success) {
        this.closeDialog()
      } else {
        this.errorMessage = "Cannot upload track. Please check internet connection and try again!!!"
      }
    }
  }
}
</script>
