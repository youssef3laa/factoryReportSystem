<template>
  <div>
    <tabs @tabs_filter="changeFilter"></tabs>
    <v-data-table
      :loading="loader"
      :headers="headers"
      :items="parts"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Spare Parts Consumption</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-col cols="4" v-if="tabFilterId === 2">
            <v-select
              :items="filterOptions"
              label="Filter"
              dense
              outlined
              item-text="text"
              item-value="id"
              v-model="durationFilter"
              class="mt-7 pa-2"
            ></v-select>
          </v-col>
        </v-toolbar>
        <v-divider></v-divider>
      </template>

      <template v-slot:no-data>
        <no-data></no-data>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import NoData from "../UI/NoData.vue";
import SparePartConsumptionTabs from "./SparePartConsumptionTabs.vue";
export default {
  components: {
    NoData,
    tabs: SparePartConsumptionTabs,
  },
  data() {
    return {
      loader: false,
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
        },
        {
          text: "Spare Part",
          sortable: true,
          value: "partName",
        },
        {
          text: "Quantity",
          sortable: true,
          value: "quantity",
        },
      ],
      parts: [],
      filterOptions: [
        {
          id: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
          text: "Last 30 Days",
        },
        {
          id: new Date(new Date().setDate(new Date().getDate() - 90))
            .toISOString()
            .split("T")[0],
          text: "Last 90 Days",
        },
        {
          id: new Date(new Date().setDate(new Date().getDate() - 365))
            .toISOString()
            .split("T")[0],
          text: "Last Year",
        },
        { id: 0, text: "All Time" },
      ],
      tabFilterId: 1,
      durationFilter: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split("T")[0],
    };
  },

  created() {
    this.reloadConsumptions(this.tabFilterId);
  },

  watch: {
    tabFilterId(newVal) {
      this.parts = [];
      if (newVal == 1) {
        this.headers = [
          {
            text: "Date",
            align: "start",
            sortable: true,
            value: "date",
          },
          {
            text: "Spare Part",
            sortable: true,
            value: "partName",
          },
          {
            text: "Quantity",
            sortable: true,
            value: "quantity",
          },
        ];
      } else {
        this.headers = [
          {
            text: "Spare Part",
            align: "start",
            sortable: true,
            value: "partName",
          },
          {
            text: "Quantity",
            sortable: true,
            value: "quantity",
          },
        ];
      }
      this.reloadConsumptions(newVal);
    },

    durationFilter() {
      this.getGroupedParts();
    },
  },

  methods: {
    async reloadConsumptions(tabFilterId) {
      if (tabFilterId == 2) this.getGroupedParts();
      else this.getAllReports();
    },
    async getAllReports() {
      let c = 0;
      this.loader = true;
      let reports = (await this.$store.dispatch("getAllReports")).data;
      for (let r of reports) {
        c += r.partsDetails.length;
      }
      this.parts = [];
      reports.map(async (report) => {
        report.partsDetails.map(async (partDetails) => {
          let part = (
            await this.$store.dispatch("getSparePartById", {
              id: partDetails.partCode,
            })
          ).data;
          let obj = {
            date: report.date.split("T")[0],
            partName: part.name,
            quantity: partDetails.quantity,
          };
          this.parts.push(obj);
          if (this.parts.length == c) this.loader = false;
        });
      });
      if (this.parts.length == c) this.loader = false;
    },
    async getGroupedParts() {
      this.loader = true;
      let reports = (
        await this.$store.dispatch("getReportsMoreThanOrEqualDate", {
          date: this.durationFilter,
        })
      ).data;
      let c = 0;
      this.parts = [];
      reports.map(async (report) => {
        let part = (
          await this.$store.dispatch("getSparePartById", {
            id: report._id,
          })
        ).data;
        let obj = {
          partName: part.name,
          quantity: report.totalQuantity,
        };
        this.parts.push(obj);
        if (this.parts.length == c) this.loader = false;
      });
      if (this.parts.length == c) this.loader = false;
    },
    changeFilter(id) {
      this.tabFilterId = id;
    },
  },
};
</script>