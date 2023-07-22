<template>
  <div>
    <v-card-title>Songs
      <v-spacer/>
      <v-btn @click="songFormDialog = true" small depressed style="background-color: #32BCA3;color: white"><span
        class="mdi mdi-plus mdi-18px"></span>
      </v-btn>
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="songs"
      :loading="isLoading"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.image="{item}">
        <div style="padding: 5px">
          <img :src="item.image_url?image_base+item.image_url:'/no-image.jpg'" alt="" style="width: 100px">
        </div>
      </template>
      <template v-slot:item.actions="{item}">
        <span @click="openUploadTrackDialog(item)" class="mdi mdi-upload mdi-18px icon-button-class"></span>
        <span @click="goToDetail(item)" class="mdi mdi-eye mdi-18px icon-button-class"></span>
        <span @click="selectForEdit(item)" class="mdi mdi-pencil mdi-18px icon-button-class"></span>
        <span @click="selectForDelete(item)" class="mdi mdi-delete mdi-18px icon-button-class"></span>
      </template>
    </v-data-table>
    <v-pagination v-model="page" circle :length="totalPage"/>
    <create-song
      v-if="songFormDialog"
      :song="selectedSong"
      @closeDialog="closeSongFormDialog"
      @refreshData="reloadData"
    />
    <upload-track-component v-if="uploadTrackDialog" :song="selectedSong" @closeDialog="closeUploadTrackDialog"/>
    <delete-confirm-dialog v-if="deleteConfirmDialog"
                           message="Please be carefully. This will delete all data!!!"
                           :is-loading="isDeleting"
                           @closeDialog="closeDeleteConfirmDialog"
                           @deleteAccepted="deleteSongHandler"/>
    <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import CreateSong from "../../components/CreateSong";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import ErrorComponent from "../../components/ErrorComponent";
import UploadTrackComponent from "../../components/UploadTrackComponent";

export default {
  components: {UploadTrackComponent, ErrorComponent, DeleteConfirmDialog, CreateSong},
  data() {
    return {
      isLoading: false,
      headers: [
        {text: 'ID', value: 'id'},
        {text: 'Image', value: 'image'},
        {text: 'Name', value: 'name'},
        {text: 'Date', value: 'date'},
        {text: "Actions", value: "actions", align: 'right'}
      ],
      page: 1,
      selectedSong: null,
      songFormDialog: false,
      deleteConfirmDialog: false,
      isDeleting: false,
      errorMessage: null,
      uploadTrackDialog: false
    }
  },
  watch: {
    page() {
      this.reloadData()
    }
  },
  methods: {
    ...mapActions({
      loadAllSongs: 'songs/loadAllSongs',
      deleteSong: 'songs/removeSong'
    }),
    async reloadData() {
      this.isLoading = true
      await this.loadAllSongs({page: this.page})
      this.isLoading = false
    },
    async deleteSongHandler() {
      if (this.isDeleting) return
      this.isDeleting = true
      let success = await this.deleteSong(this.selectedSong.id)
      this.isDeleting = false
      if (success) {
        this.closeDeleteConfirmDialog()
        this.reloadData()
      } else {
        this.errorMessage = "Cannot delete data. Please try again!!!"
      }
    },
    openUploadTrackDialog(item) {
      this.selectedSong = item
      this.uploadTrackDialog = true
    },
    closeUploadTrackDialog() {
      this.selectedSong = null
      this.uploadTrackDialog = false
    },
    selectForDelete(item) {
      this.selectedSong = item
      this.deleteConfirmDialog = true
    },
    selectForEdit(item) {
      this.selectedSong = item
      this.songFormDialog = true
    },
    closeSongFormDialog() {
      this.selectedSong = null
      this.songFormDialog = false
    },
    closeDeleteConfirmDialog() {
      this.selectedSong = null
      this.deleteConfirmDialog = false
    },
    goToDetail(item) {
      this.$router.push('/songs/' + item.id)
    }
  },
  computed: {
    ...mapGetters({
      songs: "songs/get_songs_list",
      total: 'songs/get_total_count',
      image_base: 'get_image_base_url'
    }),
    totalPage() {
      return Math.ceil(this.total / 20)
    }
  },
  mounted() {
    this.reloadData()
  }
}
</script>
