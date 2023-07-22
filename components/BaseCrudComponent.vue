<template>
  <div>
    <div style="position: relative;max-height: 80vh;overflow-y: auto">
      <v-card-title>{{ title }}
        <v-spacer/>
        <v-btn @click="openDialogForCreate" depressed small style="background-color: #32BCA3;color: white">+</v-btn>
      </v-card-title>
      <v-divider/>
      <br>
      <v-data-table
        v-model="selected"
        :single-select="singleSelect"
        item-key="id"
        selectable-key="id"
        :show-select="selectable"
        dense
        hide-default-footer
        disable-pagination
        :items="data_list"
        :headers="headers"
      >
        <template v-slot:item.image="{item}">
          <div style="padding: 5px;border-radius: 3px">
            <img :src="item.image_url?image_base+item.image_url:'/no-image.jpg'" height="100px" alt=""
                 style="border-radius: 3px"/>
          </div>
        </template>
        <template v-slot:item.name="{item}">
          <div style="font-size: 16px">
            TM: <strong>{{ item.name }}</strong><br>
            RU: <strong>{{ item.name_ru }}</strong>
          </div>
        </template>
        <template v-slot:item.actions="{item}">
          <span v-if="has_image" @click="selectForImage(item)"
                class="mdi mdi-image-edit mdi-18px icon-button-class"></span>
          <span @click="selectForEdit(item)" class="mdi mdi-pencil mdi-18px icon-button-class"></span>
          <span @click="selectForDelete(item)" class="mdi mdi-delete mdi-18px icon-button-class"></span>
        </template>
      </v-data-table>
      <br>
      <v-divider/>
      <v-card-actions v-if="selectable">
        <v-spacer/>
        <v-btn @click="$emit('closeDialog')" small depressed>cancel</v-btn>
        <v-btn @click="selectData" :disabled="!!!selected.length" small depressed
               style="background-color: #32BCA3;color: white">save
        </v-btn>
      </v-card-actions>
      <loading-component v-if="isLoading"/>
    </div>
    <base-create-component
      v-if="dataFormDialog"
      :crud_type="this.crud_type"
      :data-obj="selectedData"
      @closeDialog="closeDataFormDialog"
      @push_one_item="pushOneItemToList"
      @update_from_list="updateFromList"
    />
    <base-add-image-form
      v-if="imageFormDialog"
      :crud_type="this.crud_type"
      :data-obj="selectedData"
      @closeDialog="closeImageFormDialog"
      @update_from_list="updateFromList"
    />
    <delete-confirm-dialog
      v-if="deleteConfirmDialog"
      :is-loading="isDeleting"
      message="Please be carefully. Deleted data cant be restored and it will deleted all data belonging this item"
      @closeDialog="closeDeleteConfirmDialog"
      @deleteAccepted="deleteDataHander"
    />
    <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage= null"/>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import LoadingComponent from "./LoadingComponent";
import BaseAddImageForm from "./BaseAddImageForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ErrorComponent from "./ErrorComponent";
import BaseCreateComponent from "./BaseCreateComponent";

export default {
  props: {
    crud_type: {
      type: String,
      default: "genre"
    },
    selectable: {
      type: Boolean,
      default: false
    },
    singleSelect: {
      type: Boolean,
      default: false
    }
  },
  components: {BaseCreateComponent, ErrorComponent, DeleteConfirmDialog, BaseAddImageForm, LoadingComponent},
  data() {
    return {
      isLoading: true,
      selected: [],
      dataFormDialog: false,
      selectedData: null,
      imageFormDialog: false,
      data_list: [],
      deleteConfirmDialog: false,
      isDeleting: false,
      errorMessage: null
    }
  },
  methods: {
    async delete_date(data_id) {
      return await this.$axios.$delete(`v1/${this.url_base}/delete/${data_id}`)
        .then(() => {
          this.data_list = this.data_list.filter(x => x.id !== data_id)
          return true
        }).catch(err => {
          console.log(err)
          return false
        })
    },
    async load_all_data() {
      await this.$axios.$get(`/v1/${this.url_base}/all`)
        .then(response => {
          this.data_list = response.data
        }).catch(err => {
          console.log(err)
          this.data_list = []
        })
    },
    selectData() {

      this.$emit('selected', this.singleSelect ? this.selected[0] : this.selected)
    },
    updateFromList(data) {
      this.data_list = this.data_list.map(x => x.id === data.id ? data : x)
    },
    pushOneItemToList(item) {
      this.data_list.push(item)
    },
    async deleteDataHander() {
      if (this.isDeleting) return
      this.isDeleting = true
      let success = await this.delete_date(this.selectedData.id)
      this.isDeleting = false
      if (success) {
        this.closeDeleteConfirmDialog()
      } else {
        this.errorMessage = "Cannot delete item. Please try again!"
      }
    },
    closeDeleteConfirmDialog() {
      this.selectedData = null
      this.deleteConfirmDialog = false
    },
    selectForDelete(item) {
      this.selectedData = item
      this.deleteConfirmDialog = true
    },
    closeDataFormDialog() {
      this.selectedData = null
      this.dataFormDialog = false
    },
    selectForEdit(item) {
      this.selectedData = item
      this.dataFormDialog = true
    },
    selectForImage(item) {
      this.selectedData = item
      this.imageFormDialog = true
    },
    closeImageFormDialog() {
      this.selectedData = null
      this.imageFormDialog = false
    },
    openDialogForCreate() {
      this.dataFormDialog = true
    }
  },
  computed: {
    ...mapGetters({
      image_base: 'get_image_base_url',
      crud_types: 'base_crud/get_crud_type'
    }),
    headers() {
      return this.crud_types[this.crud_type].headers
    },
    has_image() {
      return this.crud_types[this.crud_type].has_image
    },
    title() {
      return this.crud_types[this.crud_type].title
    },
    url_base() {
      return this.crud_types[this.crud_type].url_path
    }
  },
  async mounted() {
    await this.load_all_data()
    this.isLoading = false
  }
}
</script>
