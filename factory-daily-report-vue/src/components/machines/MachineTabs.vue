<template>
  <v-card>
    <v-tabs dark fluid background-color="primary" show-arrows>
      <h3 class="ml-2 mt-2 mr-1 font-weight-medium basil--text">
        History Card:
      </h3>
      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

      <v-tab
        v-for="m in machines"
        :key="m.id"
        @click="$emit('equipments_tabs_filter', m.id)"
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
      machines: [],
    };
  },
  created() {
    this.loadMachines();
  },
  methods: {
    async loadMachines() {
      let snapshot = (await this.$store.dispatch("getAllEquipments")).data;
      let tempArr = [];
      snapshot.map(async (machine) => {
        let obj = {
          id: machine._id,
          name: machine.name_eng,
        };
        tempArr.push(obj);
      });
      this.machines = tempArr;
    },
  },
};
</script>