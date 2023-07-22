<template>
  <div>
    <div class="popUpBg">
      <div class="popUpCardClass" style="width: 50%">
        <v-card style="position: relative" tile>
          <v-card-title>
            Songs form
            <v-spacer/>
            <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field v-model="songModel.name" outlined dense label="Name(TM):"
                          placeholder="Name(TM):"></v-text-field>
            <v-text-field v-model="songModel.name_ru" outlined dense label="Name(RU):"
                          placeholder="Name(RU):"></v-text-field>
            <v-text-field v-model="songModel.track_date" outlined dense label="Track date:"
                          placeholder="Track date:"></v-text-field>
            <div class="select-with-component">
              <strong>Country: {{ country?.name || 'Select country' }}</strong>
              <v-btn @click="openSelectDialog('country')" small depressed
                     style="background-color: #32BCA3;color: white">select
              </v-btn>
            </div>
            <div class="select-with-component">
              <strong>Era: {{ era?.active_years || 'Select era' }}</strong>
              <v-btn @click="openSelectDialog('era')" small depressed style="background-color: #32BCA3;color: white">
                select
              </v-btn>
            </div>
            <div class="select-with-component">
              <strong>Album: {{ album?.name || 'Select album' }}</strong>
              <v-btn @click="openSelectAlbumDialog" small depressed style="background-color: #32BCA3;color: white">
                select
              </v-btn>
            </div>
            <div class="select-with-component">
              <strong>Category: {{ category?.name || 'Select category' }}</strong>
              <v-btn @click="openSelectDialog('category')" small depressed
                     style="background-color: #32BCA3;color: white">select
              </v-btn>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="closeDialog" depressed small>cancel</v-btn>
            <v-btn @click="saveHandler" depressed small style="background-color: #32BCA3;color: white">save</v-btn>
          </v-card-actions>
          <loading-component v-if="isLoading"/>
        </v-card>
      </div>
    </div>
    <div v-if="!!select_crud_type" class="popUpBg" style="background-color: rgba(0,0,0,0.6)">
      <div class="popUpCardClass" style="width: 50%;background-color: white">
        <base-crud-component
          :crud_type="select_crud_type"
          selectable
          single-select
          @closeDialog="closeCrudDialog"
          @selected="selectObjHandler"/>
      </div>
    </div>

    <div v-if="selectAlbumDialog" class="popUpBg" style="background-color: rgba(0,0,0,0.6)">
      <div class="popUpCardClass" style="width: 50%;background-color: white">
        <album-crud-component
          @closeDialog="closeAlbumDialog"
          selectable
          single-select
          @selected="selectAlbumHandler"
        />
      </div>
    </div>

    <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import {mapActions} from "vuex";
import BaseCrudComponent from "./BaseCrudComponent";
import AlbumCrudComponent from "./AlbumCrudComponent";

export default {
  components: {AlbumCrudComponent, BaseCrudComponent, ErrorComponent, LoadingComponent},
  props: {
    song: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      songModel: {
        name: null,
        name_ru: null,
        track_date: null
      },
      country: null,
      album: null,
      era: null,
      category: null,
      errorMessage: null,
      select_crud_type: null,
      selectAlbumDialog: false
    }
  },
  methods: {
    ...mapActions({
      createSong: 'songs/creteSong',
      updateSong: 'songs/updateSongDetail'
    }),
    openSelectAlbumDialog() {
      this.selectAlbumDialog = true
    },
    selectObjHandler(item) {
      this[this.select_crud_type] = item
      this.select_crud_type = null
    },
    selectAlbumHandler(item) {
      this.album = item
      this.selectAlbumDialog = false
    },
    closeAlbumDialog() {
      this.selectAlbumDialog = false
    },
    refreshData() {
      this.songModel.name = null
      this.songModel.name_ru = null
      this.songModel.track_date = null

      if (this.song) {
        this.songModel.name = this.song.name
        this.songModel.name_ru = this.song.name_ru
        this.songModel.track_date = this.song.track_date
      }
    },
    closeCrudDialog() {
      this.select_crud_type = null
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    openSelectDialog(type) {
      this.select_crud_type = type
    },
    async saveHandler() {
      if (this.isLoading) return
      this.isLoading = true
      let success = false
      if (this.song) {
        success = await this.updateSong({song_id: this.song.id, data: this.songModel})
      } else {
        success = await this.createSong(this.songModel)
      }
      this.isLoading = false
      if (success) {
        if (!this.song) {
          this.$emit("refreshData")
        }
        this.closeDialog()
      } else {
        this.errorMessage = "Cannot handler request. Please check internet connection and try again!!!"
      }
    }
  },
  mounted() {
    this.refreshData()
  }
}
</script>
