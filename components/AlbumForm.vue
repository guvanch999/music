<template>
  <div class="popUpBg" :style="isDialog?{height: 'fit-content',transform: 'none'}:{}">
    <div class="popUpCardClass" :style="isDialog?{width: '100%'}:{}">
      <v-card tile style="position: relative">
        <v-card-title>
          Album form
          <v-spacer></v-spacer>
          <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="albumModel.name" dense outlined label="Name(TM):"/>
          <v-text-field v-model="albumModel.name_ru" dense outlined label="Name(RU):"/>
          <v-text-field v-model="albumModel.album_date" dense outlined label="Album years:"/>

          <div class="select-with-component">Artist:{{ selectedArtist?.name || 'Not selected' }}
            <v-btn @click="openSelectDialog('artist')" small depressed style="background-color: #32BCA3;color: white">
              select
            </v-btn>
          </div>

          <div @click="openSelectDialog('era')" class="select-with-component">
            Era:{{ selectedEra?.active_years || 'Not selected' }}
            <v-btn small depressed style="background-color: #32BCA3;color: white">select</v-btn>
          </div>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="closeDialog" small depressed>cancel</v-btn>
          <v-btn @click="saveHandler" small depressed style="color: white;background-color: #32BCA3">save</v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
    </div>
    <select-component
      v-if="!!select_crud_type"
      :crud_type="select_crud_type"
      @closeDialog="select_crud_type = null"
      @select="selectedItem"
      :default-selected="defaultSelected"
    />
  </div>
</template>
<script>
import SelectComponent from "./SelectComponent";
import LoadingComponent from "./LoadingComponent";
import {mapActions} from "vuex";

export default {
  props: {
    album: {
      type: Object,
      default: null
    },
    isDialog: {
      type: Boolean,
      default: true
    }
  },
  components: {LoadingComponent, SelectComponent},
  data() {
    return {
      select_crud_type: null,
      albumModel: {
        name: null,
        name_ru: null,
        album_date: null,
      },
      selectedArtist: null,
      selectedEra: null,
      isLoading: false,
      errorMessage: null,
      defaultSelected: null
    }
  },
  methods: {
    ...mapActions({
      createAlbum: 'albums/createAlbum',
      updateAlbum: "albums/updateAlbumDetail"
    }),
    freshData() {
      this.albumModel.name = null
      this.albumModel.name_ru = null
      this.albumModel.album_date = null
      this.selectedArtist = null
      this.selectedEra = null

      if (this.album) {
        this.albumModel.name = this.album.name
        this.albumModel.name_ru = this.album.name_ru
        this.albumModel.album_date = this.album.album_date
        this.selectedEra = this.album.era
        this.selectedArtist = this.album.artist
      }
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    checkValidation() {
      if (!this.selectedEra) {
        alert("Please choose an era")
        return false
      }
      if (!this.selectedArtist) {
        alert("Please choose an Artist")
        return false
      }
      return true
    },
    async saveHandler() {
      if (!this.checkValidation()) return
      if (this.isLoading) return
      this.isLoading = true
      let body = {
        ...this.albumModel,
        era_id: this.selectedEra.id,
        artist_id: this.selectedArtist.id
      }
      let success = false
      if (this.album) {
        success = await this.updateAlbum({album_id: this.album.id, data: body})
      } else {
        success = await this.createAlbum(body)
      }
      this.isLoading = false
      if (success) {
        this.closeDialog()
      } else {
        this.errorMessage = "Cannot handle request!!! Please try again!"
      }
    },
    openSelectDialog(type) {
      console.log(this.selectedEra)
      switch (type) {
        case "artist": {
          this.defaultSelected = this.selectedArtist;
          break
        }
        case 'era': {
          this.defaultSelected = this.selectedEra;
          break
        }
      }
      console.log(this.defaultSelected)
      this.select_crud_type = type
    },
    selectedItem(item) {
      switch (this.select_crud_type) {
        case "artist": {
          this.selectedArtist = item;
          break
        }
        case 'era': {
          this.selectedEra = item
          break
        }
      }
      this.select_crud_type = null
    }
  },
  mounted() {
    this.freshData()
  }
}
</script>

