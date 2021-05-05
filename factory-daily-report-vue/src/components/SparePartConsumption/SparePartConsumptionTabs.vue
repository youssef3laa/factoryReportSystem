<template>
  <v-card>
    <v-tabs dark background-color="primary " show-arrows>
      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

      <v-tab
        v-for="m in options"
        :key="m.id"
        @change="$emit('tabs_filter', m.id)"
      >
        {{ m.name }}
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { id: 1, name: "All Consumptions" },
        { id: 2, name: "Grouped Consumptions" },
      ],
    };
  },
};
</script>