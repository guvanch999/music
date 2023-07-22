<template>
  <div>
    <base-crud-component :selectable="false" crud_type="genre"/>
  </div>
</template>
<script>
import BaseCrudComponent from "../../components/BaseCrudComponent";

export default {
  components: {BaseCrudComponent}
}
</script>
