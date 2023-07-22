<template>
  <div>
    <v-card-title>Albums
      <v-spacer/>
      <v-btn @click="albumFormDialog = true" small depressed style="background-color: #32BCA3;color: white"><span
        class="mdi mdi-plus mdi-18px"></span>
      </v-btn>
    </v-card-title>
    <v-divider/>
    <v-data-table
      v-model="selected"
      :single-select="singleSelect"
      item-key="id"
      selectable-key="id"
      :show-select="selectable"
      hide-default-footer
      disable-pagination
      dense
      :items="albums"
      :loading="isLoading"
      :headers="headers"
    >
      <template v-slot:item.image="{item}">
        <div style="padding: 5px">
          <img :src="item.image_url?image_base+item.image_url:'/no-image.jpg'" alt="" width="100"
               style="border-radius: 3px">
        </div>
      </template>
      <template v-slot:item.era="{item}">
        {{ item.era?.active_years }}
      </template>
      <template v-slot:item.artist="{item}">
        {{ item.artist?.name }}
      </template>
      <template v-slot:item.actions="{item}">
        <span @click="selectForImage(item)" class="mdi mdi-image-edit mdi-18px icon-button-class"></span>
        <span @click="selectForEdit(item)" class="mdi mdi-pencil mdi-18px icon-button-class"></span>
        <span @click="selectForDelete(item)" class="mdi mdi-delete mdi-18px icon-button-class"></span>
      </template>
    </v-data-table>
    <v-divider/>
    <v-card-actions v-if="selectable">
      <v-spacer/>
      <v-btn @click="closeDialog" small depressed>cancel</v-btn>
      <v-btn small depressed style="background-color: #32BCA3;color: white">select</v-btn>
    </v-card-actions>
    <album-form v-if="albumFormDialog" @closeDialog="closeFormDialog" :album="selectedAlbum" :is-dialog="selectable"/>
    <delete-confirm-dialog v-if="deleteConfirmDialog"
                           :is-loading="isDeleting"
                           message="Be carefully. Deleted album cant be restored!!!"
                           @closeDialog='closeDeleteConfirmDialog'
                           @deleteAccepted="deleteAlbumHandler"
    />
    <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
    <upload-image-component v-if="uploadImageDialog" :album="selectedAlbum" @closeDialog="deleteImageDialog"/>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import AlbumForm from "./AlbumForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ErrorComponent from "./ErrorComponent";
import UploadImageComponent from "./UploadImageComponent";

export default {
  props: {
    selectable: {
      type: Boolean,
      default: false
    },
    singleSelect: {
      type: Boolean,
      default: false
    }
  },
  components: {UploadImageComponent, ErrorComponent, DeleteConfirmDialog, AlbumForm},
  data() {
    return {
      isLoading: true,
      headers: [
        {text: "ID", value: "id"},
        {text: "Image", value: "image"},
        {text: "Name", value: "name"},
        {text: "Album date", value: "album_date"},
        {text: "Artist", value: "artist"},
        {text: "Era", value: "era"},
        {text: "Actions", value: "actions", align: 'right'}
      ],
      albumFormDialog: false,
      selectedAlbum: null,
      deleteConfirmDialog: false,
      isDeleting: false,
      errorMessage: null,
      uploadImageDialog: false,
      selected: []
    }
  },
  methods: {
    ...mapActions({
      load_all_albums: "albums/loadAllAlbums",
      delete_album: "albums/removeAlbum"
    }),
    selectForEdit(item) {
      this.selectedAlbum = item
      this.albumFormDialog = true
    },
    deleteImageDialog() {
      this.selectedAlbum = null
      this.uploadImageDialog = false

    },
    selectForImage(item) {
      this.selectedAlbum = item
      this.uploadImageDialog = true
    },
    selectForDelete(item) {
      this.selectedAlbum = item
      this.deleteConfirmDialog = true
    },
    closeDeleteConfirmDialog() {
      this.selectedAlbum = null
      this.deleteConfirmDialog = false
    },
    closeFormDialog() {
      this.selectedAlbum = null
      this.albumFormDialog = false
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    async deleteAlbumHandler() {
      if (this.isDeleting) return
      this.isDeleting = true
      let success = await this.delete_album(this.selectedAlbum.id)
      if (success) {
        this.closeDeleteConfirmDialog()
      } else {
        this.errorMessage = "Cannot delete album. Please try again"
      }
    }
  },
  computed: {
    ...mapGetters({
      albums: 'albums/get_albums',
      image_base: 'get_image_base_url'
    }),
  },
  async mounted() {
    await this.load_all_albums()
    this.isLoading = false
  }
}
</script>
