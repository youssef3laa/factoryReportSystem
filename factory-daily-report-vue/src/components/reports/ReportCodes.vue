<template>
  <v-data-table
    :loading="loader"
    :headers="headers"
    :items="reports"
    class="elevation-1"
    item-key="reportCode"
    :expanded.sync="expanded"
    show-expand
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Report Codes</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
    </template>
    <template v-slot:expanded-item="{ item }">
      <td class="maxWidth px-10 py-10" :cols="12" colspan="50%">
        <p class="subtitle-2 text-left">Problem Description</p>
        {{ item.problemDescription }}
      </td>
    </template>

    <template v-slot:no-data>
      <no-data></no-data>
    </template>
  </v-data-table>
</template>

<script>
import NoData from "../UI/NoData.vue";
import * as rules from "../../utils/vrules";
export default {
  components: {
    NoData,
  },
  data() {
    return {
      rules,
      loader: false,
      expanded: [],
      dialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Report Code",
          align: "start",
          sortable: true,
          value: "reportCode",
        },
        { text: "Equipment", value: "equipmentName", sortable: true },
      ],
      reports: [],
    };
  },

  async created() {
    this.reloadReports();
  },

  methods: {
    async reloadReports() {
      this.loader = true;
      let tempArr = [];
      let reports = (await this.$store.dispatch("getAllReports")).data;
      for (let report of reports) {
        let obj = {
          equipmentName: (
            await this.$store.dispatch("getEquipmentById", {
              id: report.machineId,
            })
          ).data.name_eng,
          problemDescription: report.problemDescription,
          reportCode: report.reportCodeValue,
        };
        tempArr.push(obj);
      }
      this.reports = tempArr;
      this.loader = false;
    },
  },
  directives: {
    machineName: {
      loaded: function (element) {
        // your code goes here
      },
    },
  },
};
</script>

<style scoped>
.maxWidth {
  word-wrap: break-word;
  max-width: 0px;
}
</style>