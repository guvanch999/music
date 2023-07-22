<template>
  <div class="popUpBg">
    <div class="popUpCardClass" style="width: 30%">
      <v-card style="position: relative">
        <v-card-title style="background-color: red;color: white">
          Pay attention!!!
          <v-spacer/>
          <span @click="closeDialog" class="mdi mdi-close icon-button-class"></span>
        </v-card-title>
        <v-card-text>
          <div style="display: flex;min-height: 100px;align-items: center;color: red;justify-content: center">
            <span class="mdi mdi-alert" style="font-size: 56px;"></span>
            <label style="margin-left: 10px;font-size: 20px">{{ message }}</label>
          </div>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="closeDialog" depressed small>cancel</v-btn>
          <v-btn @click="deleteRecordHandler" depressed small style="color: white;background-color: red">delete</v-btn>
        </v-card-actions>
        <LoadingComponent v-if="isLoading"/>
      </v-card>
    </div>
  </div>
</template>
<script>

import LoadingComponent from "./LoadingComponent";

export default {
  components: {LoadingComponent},
  props: {
    message: {
      type: String,
      default: "Deleted record cant be restored!!"
    },
    isLoading: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog")
    },
    async deleteRecordHandler() {
      this.$emit("deleteAccepted")
    }
  }
}
</script>


<style>

</style>
