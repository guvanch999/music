<template>
  <div class="popUpBg" style="z-index: 9;height: -webkit-fill-available;">
    <div class="popUpCardClass">
      <v-card tile outlined style="position: relative">
        <v-card-title>Create or update
          <v-spacer/>
          <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-for="prop in dataModelKeys" :key="prop" :datatype="prop">
            <label>{{ get_model_props(prop)['label'] }}:</label>
            <v-text-field v-model="dataModel[prop]" v-if="get_model_props(prop)['type']==='text-field'" outlined dense
                          hide-details></v-text-field>
            <v-textarea v-model="dataModel[prop]" v-if="get_model_props(prop)['type']==='text-area'" outlined dense
                        hide-details></v-textarea>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="closeDialog" small depressed>cancel</v-btn>
          <v-btn @click="saveDataHandler" small depressed style="background-color:  #32BCA3;color: white">save</v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
      <error-component v-if="!!errorMessage" :message="errorMessage" @closeError="errorMessage = null"/>
    </div>
  </div>
</template>
<script>
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import {mapActions, mapGetters} from "vuex";
import SelectComponent from "./SelectComponent";

export default {
  name: "BaseCreateComponent",
  props: {
    crud_type: {
      type: String,
      default: "genre"
    },
    dataObj: {
      type: Object,
      default: null
    }
  },
  components: {SelectComponent, ErrorComponent, LoadingComponent},
  data() {
    return {
      isLoading: false,
      dataModel: {},
      errorMessage: null
    }
  },
  methods: {
    async updateData({data_id, data}) {
      return await this.$axios.$put(`v1/${this.url_base}/update/${data_id}`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
        .then(res => {
          console.log(res)
          this.$emit('update_from_list', res.data)
          return true
        }).catch(err => {
          console.log(err)
          return false
        })
    },
    async createData(data) {
      return await this.$axios.$post(`v1/${this.url_base}/create`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
        .then(res => {
          this.$emit("push_one_item", res.data)
          return true
        }).catch(err => {
          console.log(err)
          return false
        })
    },
    refreshData() {
      this.dataModel = Object.assign({}, this.crud_type_obj.model)
      if (this.dataObj) {
        for (let prop in this.dataModel) {
          this.dataModel[prop] = this.dataObj[prop]
        }
      }
    },
    async saveDataHandler() {
      if (this.isLoading) return;
      this.isLoading = true
      let success = false
      if (this.dataObj) {
        success = await this.updateData({data: this.dataModel, data_id: this.dataObj.id})
      } else {
        success = await this.createData(this.dataModel)
      }
      this.isLoading = false

      if (success) {
        this.closeDialog()
      } else {
        this.errorMessage = "Cannot handle request. Please check internet connection and try again!!!"
      }
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    get_model_props(key) {
      return this.crud_type_obj.modelParams[key]
    }
  },
  computed: {
    ...mapGetters({
      crud_types: 'base_crud/get_crud_type',
      token: 'get_auth_token'
    }),
    crud_type_obj() {
      return this.crud_types[this.crud_type]
    },
    dataModelKeys() {
      return Object.keys(this.crud_type_obj.model)
    },
    url_base() {
      return this.crud_type_obj.url_path
    }
  },
  mounted() {
    this.refreshData()
  }
}
</script>
