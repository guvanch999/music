<template>
  <div>
    <v-tabs
      v-model="tab"
      >
      <v-tabs-slider color="#32BCA3"></v-tabs-slider>

      <v-tab
        v-for="(item,index) in tab_items"
        :key="index"
      >
        {{ item.tap_name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(item,index) in tab_items"
        :key="index"
      >
        <base-crud-component :crud_type="item.tap_crud_type" :selectable="false"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import BaseCrudComponent from "../../components/BaseCrudComponent";

export default {
  components: {BaseCrudComponent},
  data() {
    return {
      tab: null,
      tab_items: [
        {
          tap_name: "Categories",
          tap_crud_type: 'category'
        },
        {
          tap_name: "Countries",
          tap_crud_type: "country"
        },
        {
          tap_name: "Genres",
          tap_crud_type: "genre"
        },
        {
          tap_name: "Artists",
          tap_crud_type: "artist"
        },
        {
          tap_name: "Era",
          tap_crud_type: "era"
        },
        {
          tap_name: "Tags",
          tap_crud_type: "tag"
        }
      ]
    }
  }
}
</script>
