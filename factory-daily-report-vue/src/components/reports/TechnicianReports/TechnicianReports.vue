<template>
  <v-app>
    <v-data-table
      :loading="loader"
      :headers="headers"
      :items="reports"
      :item-class="c"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Pending Reports</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            right
            color="grey darken-1"
            dark
            class="mb-2 mr-10 d-flex justify-end"
            @click="openFilterModal"
          >
            Filter
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-dialog v-model="filterDialog" max-width="600px">
          <!-- <template v-slot:activator="{ on: addModalMode, attrs }"> -->
          <!-- </template> -->
          <v-card v-if="filterDialog" @keyup.enter="filter">
            <v-card-title>
              <span class="headline">Filter Options</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-menu
                      ref="dateMenu"
                      v-model="filterDateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model.trim="filterOptions.date"
                          label="Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          clearable
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="filterOptions.date"
                        outlined
                        range
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="filterDateMenu = false"
                        >
                          CLOSE
                        </v-btn></v-date-picker
                      >
                    </v-menu>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      :items="fields"
                      label="Field"
                      v-model.trim="filterOptions.fieldId"
                      color="blue-grey lighten-2"
                      item-text="name"
                      item-value="id"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.fieldId.length - 1 }}
                          others)
                        </span>
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-autocomplete
                      :items="allMachines"
                      label="Equipment"
                      v-model.trim="filterOptions.machineId"
                      color="blue-grey lighten-2"
                      item-text="name"
                      item-value="id"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.machineId.length - 1 }}
                          others)
                        </span>
                      </template></v-autocomplete
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      :items="statusList"
                      v-model.trim="filterOptions.statusId"
                      label="Status"
                      item-text="name"
                      item-value="id"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.statusId.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model.trim="filterOptions.incidentLocation"
                      :items="incidentLocationList"
                      label="Incident Location"
                      aria-rowspan="5"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.incidentLocation.length - 1 }}
                          others)
                        </span>
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model.trim="filterOptions.problemDescription"
                      :items="problemDescriptionList"
                      label="Problem Description"
                      aria-rowspan="5"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.problemDescription.length - 1 }}
                          others)
                        </span>
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-autocomplete
                      :items="allParts"
                      v-model="filterOptions.partsDetails.partCode"
                      label="Spare Part Code"
                      item-text="name"
                      item-value="id"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.partsDetails.partCode.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model.number="filterOptions.partsDetails.quantity"
                      label="Quantity"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12 ">
                    <v-autocomplete
                      :items="allParts"
                      v-model="filterOptions.partsDetails.partCode"
                      label="Spare Part Description"
                      item-text="partDescription"
                      item-value="id"
                      clearable
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.partDescription }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.partsDetails.partCode.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-autocomplete
                      :items="teamsList"
                      v-model="filterOptions.team"
                      label="Teams"
                      item-text="name"
                      item-value="id"
                      multiple
                      chips
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          @click="data.select"
                          @click:close="remove(data.item.id)"
                        >
                          {{ data.item.name }}
                        </v-chip>
                      </template>
                      <template v-slot:item="data">
                        <template v-if="data.item != 'object'">
                          <v-list-item-content
                            v-text="data.item.name"
                          ></v-list-item-content>
                        </template>
                        <template v-else>
                          <v-list-item-content>
                            <v-list-item-title
                              v-html="data.item.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle
                              v-html="data.item.group"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="6">
                    <v-autocomplete
                      :items="typeList"
                      v-model.trim="filterOptions.typeId"
                      label="Type"
                      item-text="name"
                      item-value="id"
                      chips
                      multiple
                      deletable-chips
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.typeId.length - 1 }}
                          others)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue darken-1" text @click="clearFilterDialog">
                Clear
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeFilterDialog">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="filter"> Filter </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model.trim="dialogDelete" max-width="540px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to reject this report?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="reject">Yes</v-btn>
              <v-btn color="blue darken-1" text @click="closeDelete">No</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <span class="headline"></span>

        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :color="item.typeId == 3 ? 'white' : ''"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="viewModalMode(item)" link>
              <v-list-item-title
                ><v-icon small class="mr-2"> mdi-arrow-expand-all </v-icon
                ><span>View</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-if="item.state == 0"
              @click="openPrefilledReport(item)"
              link
            >
              <v-list-item-title
                ><v-icon small class="mr-2 green--text">
                  mdi-check-circle </v-icon
                ><span>Approve</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-if="item.state == 0"
              @click="deleteModalMode(item)"
              link
            >
              <v-list-item-title
                ><v-icon class="mr-2 red--text" small> mdi-delete </v-icon
                ><span>Reject</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:no-data>
        <no-data></no-data>
      </template>
      <technician-modal></technician-modal>
    </v-data-table>
  </v-app>
</template>

<script>
import NoData from "../../UI/NoData.vue";
import * as rules from "../../../utils/vrules";
import TechnicianModal from "./TechnicianAddReport.vue";
export default {
  components: {
    NoData,
    TechnicianModal,
  },
  data() {
    return {
      rules,
      showActions: true,
      loader: true,
      time: null,
      fromPickerMenu: false,
      toPickerMenu: false,
      filterDateMenu: false,
      reportDateMenu: false,
      dialog: false,
      filterDialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        { text: "Date", value: "date", sortable: true },
        { text: "Field", value: "fieldName", sortable: true },
        { text: "Equipment", value: "machineName", sortable: true },
        { text: "Type", value: "typeName", sortable: true },
        { text: "Status", value: "statusName", sortable: true },
        { text: "Total Time", value: "totalTime", sortable: true },
        { text: "Reported By", value: "reportedBy", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      reports: [],
      parts: [],
      allParts: [],
      partsCount: 1,
      machines: [],
      allMachines: [],
      fields: [],
      teamsList: [],
      problemDescriptionList: [],
      incidentLocationList: [],
      typeList: [
        { id: 1, name: "Corrective" },
        { id: 2, name: "Routine" },
        { id: 3, name: "Break Down" },
        { id: 4, name: "Planned" },
      ],
      statusList: [
        { id: 1, name: "Done" },
        { id: 2, name: "Temporary" },
        { id: 3, name: "Open" },
      ],
      item: { partsDetails: [{}] },
      filterOptions: { partsDetails: [{}] },
      reportCodeFilter: "",
      reportCodes: [],
    };
  },

  async created() {
    await this.loadAllFields();
    await this.loadAllMachines();
    await this.loadAllParts();
    await this.loadAllTeams();
    if (this.$route.params.id) {
      this.reports = await this.normalizeReturnedReports([
        await this.getReportById(this.$route.params.id),
      ]);
    } else this.reloadReports();
  },

  methods: {
    c(item) {
      return item.typeId == 3 ? "white--text red" : "";
    },
    async getReportById(id) {
      return (await this.$store.dispatch("getTechnicianReportById", { id: id }))
        .data;
    },
    async reloadReports() {
      this.loader = true;
      let respData = (await this.$store.dispatch("getAllTechnicianReports"))
        .data;
      for (let r of respData) {
        this.problemDescriptionList.push(r.problemDescription);
        this.incidentLocationList.push(r.incidentLocation);
      }
      this.reports = await this.normalizeReturnedReports(respData);
      this.loader = false;
    },
    async loadAllFields() {
      let snapshot = (await this.$store.dispatch("getAllFields")).data;
      let tempArr = [];
      snapshot.map((field) => {
        let obj = {
          id: field._id,
          name: field.name_eng,
          code: field.code,
        };
        tempArr.push(obj);
      });

      this.fields = tempArr;
      this.loader = false;
    },
    async reloadMachinesData(fieldId) {
      let ss = (
        await this.$store.dispatch("getEquipmentByFieldId", { fieldId })
      ).data;
      let tempArr = [];
      ss.map((machine) => {
        let obj = {
          id: machine._id,
          name: machine.name_eng,
        };
        tempArr.push(obj);
      });
      this.machines.splice(0);
      this.machines = tempArr;
    },
    async loadAllMachines() {
      let snapshot = (await this.$store.dispatch("getAllEquipments")).data;
      let tempArr = [];
      snapshot.map(async (machine) => {
        let obj = {
          id: machine._id,
          name: machine.name_eng,
          code: machine.code,
        };
        tempArr.push(obj);
      });
      this.allMachines = tempArr;
    },
    async loadAllTeams() {
      let snapshot = (await this.$store.dispatch("getAllTeams")).data;
      let tempArr = [];
      snapshot.map(async (team) => {
        let obj = {
          id: team._id,
          name: team.name,
        };
        tempArr.push(obj);
      });
      this.teamsList = tempArr;
    },
    async reloadPartsData(machineId) {
      let ss = (
        await this.$store.dispatch("getSparePartByEquipmentId", { machineId })
      ).data;
      let tempArr = [];
      ss.map((part) => {
        let obj = {
          id: part._id,
          name: part.name,
          partDescription: part.partDescription,
        };
        tempArr.push(obj);
      });

      this.parts = tempArr;
    },
    async loadAllParts() {
      let snapshot = (await this.$store.dispatch("getAllSpareParts")).data;
      let tempArr = [];
      snapshot.map((part) => {
        let obj = {
          id: part.id,
          name: part.name,
          partDescription: part.partDescription,
        };
        tempArr.push(obj);
      });
      this.allParts = tempArr;
    },
    openFilterModal() {
      this.filterDialog = true;
      // this.emptyItem();
    },
    // addModalMode() {
    //   this.mode = true;
    //   this.open();
    //   this.emptyItem();
    // },

    deleteModalMode(item) {
      this.item = item;
      this.dialogDelete = true;
    },

    reject() {
      this.$store.dispatch("rejectTechnicianReport", this.item).then(() => {
        this.closeDelete();
        this.reloadReports();
        this.$store.dispatch("getTechReportsCount");
        this.$notify({
          group: "mainActionsNotifications",
          title: "Rejected!",
          text: "Data has been rejected successfully.",
          type: "success",
        });
      });
    },
    openPrefilledReport(item) {
      this.$store.dispatch("approveTechnicianReport", item).then(() => {
        this.$store.dispatch("getTechReportsCount");
        this.$notify({
          group: "mainActionsNotifications",
          title: "Approved!",
          text: "Data has been approved successfully.",
          type: "success",
        });
        let routeData = this.$router.resolve({
          name: "Reports",
          query: { trid: item.id },
        });
        window.open(routeData.href, "_blank");
      });
    },

    open() {
      this.$store.commit("openTechnicianDialog");
    },
    close() {
      this.$store.commit("closeTechnicianDialog");
    },

    closeDelete() {
      this.dialogDelete = false;
    },
    emptyItem() {
      this.$store.commit("setTechnicianItem", { partsDetails: [{}] });
    },
    remove(item) {
      const index = this.filterOptions.team.indexOf(item);
      if (index >= 0) this.filterOptions.team.splice(index, 1);
    },
    clearToPicker() {
      this.item.toPicker = "";
    },

    calculateTimeDifference() {
      let start = this.item.fromPicker.split(":");
      let end = this.item.toPicker.split(":");
      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);

      if (hours < 0) hours = hours + 24;
      this.item.totalTime =
        (hours <= 9 ? "0" : "") +
        hours +
        ":" +
        (minutes <= 9 ? "0" : "") +
        minutes;
    },
    async filter() {
      this.loader = true;
      this.reports = await this.normalizeReturnedReports(
        (
          await this.$store.dispatch(
            "getFilteredTechnicianReports",
            this.filterOptions
          )
        ).data
      );
      this.loader = false;
      this.closeFilterDialog();
    },
    closeFilterDialog() {
      this.filterDialog = false;
    },
    clearFilterDialog() {
      this.filterOptions = { partsDetails: [{}] };
    },
    async normalizeReturnedReports(reports) {
      let tempArr = [];
      if (typeof reports[0] == "string") reports = [];
      for (let report of reports) {
        let obj = {
          id: report._id,
          state: report.state,
          date: report.date.split("T")[0],
          fieldId: report.fieldId,
          fieldName: this.fields.find((field) => report.fieldId == field.id)
            .name,
          machineId: report.machineId,
          machineName: this.allMachines.find(
            (machine) => report.machineId == machine.id
          ).name,
          typeId: report.typeId,
          typeName: this.typeList.find((type) => report.typeId == type.id).name,
          partsDetails: report.partsDetails,
          statusId: report.statusId,
          statusName: this.statusList.find(
            (status) => report.statusId == status.id
          ).name,
          fromPicker: report.fromPicker,
          toPicker: report.toPicker,
          totalTime: report.totalTime,
          actionDescription: report.actionDescription,
          problemDescription: report.problemDescription,
          incidentLocation: report.incidentLocation,
          reportCode: report.reportCode,
          reportedBy: (
            await this.$store.dispatch("getTeamById", {
              _id: report.reportedBy,
            })
          ).data.name,
        };
        //fill teams
        obj.team = [];
        for (let t of report.team) {
          obj.team.push(t);
        }
        tempArr.push(obj);
        console.log(obj);
      }
      return tempArr;
    },
    viewModalMode(item) {
      this.$store.commit("setTechnicianItem", { ...item });
      this.$store.commit("setTechnicianMode", "view");
      this.open();
    },
  },
};
</script>