<template>
  <v-data-table
    :loading="loader"
    :headers="headers"
    :items="logs"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Logs</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-divider></v-divider>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td>{{ item.userId }}</td>
          <td :class="item.actionTaken.colorClass">
            {{ item.actionTaken.name }}
          </td>
          <td>{{ item.table }}</td>
          <td><router-link :to="item.link"> View</router-link></td>
          <td>{{ item.timestamp }}</td>
        </tr>
      </tbody>
    </template>
    <template v-slot:no-data>
      <no-data></no-data>
    </template>
  </v-data-table>
</template>

<script>
import NoData from "../UI/NoData.vue";
export default {
  components: {
    NoData,
  },
  data() {
    return {
      loader: true,
      search: "",
      dialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "User",
          align: "start",
          sortable: true,
          value: "userId",
        },
        {
          text: "Action Taken",
          sortable: true,
          value: "actionTaken",
        },
        {
          text: "Table",
          sortable: true,
          value: "table",
        },
        {
          text: "Details",
          value: "link",
        },
        {
          text: "Timestamp",
          sortable: true,
          value: "timestamp",
        },
      ],
      actions: [
        {
          id: "1",
          name: "CREATED",
          colorClass: "green--text font-weight-bold",
        },
        {
          id: "2",
          name: "EDITED",
          colorClass: "yellow--text text--darken-4 font-weight-bold",
        },
        { id: "3", name: "DELETED", colorClass: "red--text font-weight-bold" },
        {
          id: "4",
          name: "APPROVED",
          colorClass: "green--text font-weight-bold",
        },
        { id: "5", name: "REJECTED", colorClass: "red--text font-weight-bold" },
      ],
      logs: [],
      item: {
        id: "",
        name: "",
      },
    };
  },

  created() {
    this.reloadLogsData();
  },

  methods: {
    async reloadLogsData() {
      this.loader = true;
      let snapshot = (await this.$store.dispatch("getAllLogs")).data;
      let tempArr = [];
      await Promise.all(
        snapshot.map(async (log) => {
          let obj = {
            userId: (
              await this.$store.dispatch("getTeamById", { _id: log.userId })
            ).data.name,
            actionTaken: this.actions.find((a) => a.id == log.actionTaken),
            table: log.table,
            link: log.link,
            timestamp: log.timestamp,
          };
          tempArr.push(obj);
        })
      ).then(() => {
        this.logs = tempArr;
        this.loader = false;
      });
    },
  },
};
</script>