<template>
  <div class="popUpBg" style="z-index: 10;height: -webkit-fill-available;">
    <div class="popUpCardClass">
      <v-card tile style="position: relative">
        <v-card-title>
          Choose from list
          <v-spacer/>
          <span @click="closeDialog" class="mdi mdi-close mdi-18px icon-button-class"></span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <v-list dense>
            <v-list-item-group
              v-model="selected"
              color="primary"
            >
              <v-list-item
                v-for="(item, i) in items"
                :key="item.id" :value="item"
              >
                <v-list-item-icon v-if="has_image">
                  <img :src="item.image_url?image_base+item.image_url:'/no-image.jpg'" alt="">
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> {{ item.name || item.tag || item.active_years }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="closeDialog" depressed small>cancel</v-btn>
          <v-btn @click="selectHandler" :disabled="!!!selected" depressed small
                 style="background-color: #32BCA3;color: white">select
          </v-btn>
        </v-card-actions>
        <loading-component v-if="isLoading"/>
      </v-card>
    </div>
  </div>
</template>


<script>
import {mapGetters} from "vuex";
import LoadingComponent from "./LoadingComponent";

export default {
  components: {LoadingComponent},
  props: {
    crud_type: {
      type: String
    },
    defaultSelected: {
      type: Object,
      default:null
    }
  },
  data() {
    return {
      items: [],
      selected: null,
      isLoading: true
    }
  },
  methods: {
    async load_all_data() {
      await this.$axios.$get(`/v1/${this.url_base}/all`)
        .then(response => {
          this.items = response.data
        }).catch(err => {
          console.log(err)
          this.items = []
        })
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    selectHandler() {
      this.$emit("select", this.selected)
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
    this.selected = this.defaultSelected
  }
}
</script>
