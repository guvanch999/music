<template>
  <div class="popUpBg" style="z-index: 999;height: -webkit-fill-available;">
    <div class="popUpCardClass" style="width: 50%">
      <v-card tile outlined style="position: relative">
        <v-card-title>Add image
          <v-spacer/>
          <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div style="text-align: center">
            <img :src="get_image" alt="" width="200">
          </div>
          <label>Please choose image:</label>
          <v-file-input v-model="image" hide-details dense outlined/>
        </v-card-text>
        <v-divider>
        </v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog" small depressed>cancel</v-btn>
          <v-btn @click="saveImageHandler" small depressed style="background-color:  #32BCA3;color: white">save</v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
      <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

export default {
  components: {ErrorComponent, LoadingComponent},
  props: {
    dataObj: {
      type: Object
    },
    crud_type: {
      type: String
    }
  },
  data() {
    return {
      image: null,
      isLoading: false,
      errorMessage: null
    }
  },
  methods: {
    ...mapActions({
      add_image: 'base_crud/addImageToData'
    }),
    async add_image({data_id, form}) {
      return await this.$axios.post(`v1/${this.url_base}/add-image/${data_id}`, form)
        .then(res => {
          this.$emit('update_from_list', res.data.data)
          return true
        }).catch(err => {
          console.log(err)
          return false
        })
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    async saveImageHandler() {
      if (this.isLoading) return
      if (!this.image) {
        alert("Please choose image!")
        return
      }
      this.isLoading = true
      const form = new FormData()
      form.append('photo', this.image)

      let success = await this.add_image({form, data_id: this.dataObj.id})
      this.isLoading = false
      if (success) {
        this.closeDialog()
      } else {
        this.errorMessage = "Cannot upload image file. Please check internet connection and try again!!!"
      }
    }
  },
  computed: {
    ...mapGetters({
      image_base_url: 'get_image_base_url',
      crud_types: 'base_crud/get_crud_type'
    }),
    get_image() {
      if (this.image) {
        return URL.createObjectURL(this.image)
      }
      if (this.dataObj && this.dataObj?.image_url) {
        return this.image_base_url + this.dataObj.image_url
      }
      return '/no-image.jpg'
    },
    url_base() {
      return this.crud_types[this.crud_type].url_path
    }
  }
}
</script>
