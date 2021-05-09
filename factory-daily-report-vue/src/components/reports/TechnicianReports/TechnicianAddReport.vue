<template>
  <v-app>
    <v-dialog
      v-model.trim="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card flat tile>
        <v-toolbar dark color="primary" extended extension-height="50">
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-right">بيانات التقرير</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              v-if="mode != 'view'"
              dark
              text
              :disabled="!validate"
              @click="add"
            >
              إضافة
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container class="pa-10">
          <v-form v-model="validate" ref="form">
            <v-row>
              <v-col cols="4">
                <v-menu
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  v-model="reportDateMenu"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model.trim="item.date"
                      label="تاريخ"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      clearable
                      :rules="[rules.required]"
                      :disabled="mode == 'view'"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model.trim="item.date"
                    outlined
                    @input="reportDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  :items="fields"
                  label="فيلد"
                  v-model.trim="item.fieldId"
                  color="blue-grey lighten-2"
                  item-text="name"
                  item-value="id"
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  :disabled="machines.length < 1 || mode == 'view'"
                  :items="machines"
                  label="ماكينة"
                  v-model.trim="item.machineId"
                  color="blue-grey lighten-2"
                  item-text="name"
                  item-value="id"
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  clearable
                  hide-selected
                  v-model.trim="item.incidentLocation"
                  :items="incidentLocationList"
                  label="مكان الحدث"
                  aria-rowspan="5"
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  clearable
                  hide-selected
                  v-model.trim="item.problemDescription"
                  :items="problemDescriptionList"
                  label="وصف المشكلة"
                  aria-rowspan="5"
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
                ></v-combobox>
              </v-col>
            </v-row>
            <div v-for="(part, index) in item.partsDetails" :key="index">
              <v-row v-if="index > 0" class="mt-5 justify-end">
                <v-btn icon @click="removePartSection(index)">
                  <v-icon class="primary--text">mdi-close</v-icon>
                </v-btn>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-autocomplete
                    :items="allParts"
                    v-model="item.partsDetails[index].partCode"
                    label="كود قطعة الغيار"
                    item-text="name"
                    item-value="id"
                    :disabled="allParts.length < 1 || mode == 'view'"
                    :rules="[rules.required]"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="item.partsDetails[index].quantity"
                    label="الكمية"
                    :rules="[rules.required, rules.number]"
                    :disabled="mode == 'view'"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12 ">
                  <v-autocomplete
                    :items="allParts"
                    v-model="item.partsDetails[index].partCode"
                    label="وصف قطعة الغيار"
                    item-text="partDescription"
                    item-value="id"
                    clearable
                    :disabled="allParts.length < 1 || mode == 'view'"
                    :rules="[rules.required]"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </div>
            <v-row class="justify-end" v-if="mode != 'view'">
              <v-btn
                color="primary "
                dark
                class="ma-2"
                @click="item.partsDetails.push({})"
              >
                قطعة الغيار جديدة
              </v-btn>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  :items="teamsList"
                  v-model="item.team"
                  label="فريق العمل"
                  item-text="name"
                  item-value="id"
                  multiple
                  chips
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
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
              <v-col cols="4">
                <v-autocomplete
                  :items="statusList"
                  v-model.trim="item.statusId"
                  label="الحالة"
                  item-text="name"
                  item-value="id"
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  :items="typeList"
                  v-model.trim="item.typeId"
                  label="النوع"
                  item-text="name"
                  item-value="id"
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12 ">
                <v-textarea
                  v-model.trim="item.actionDescription"
                  label="وصف القرار"
                  clearable
                  :rules="[rules.required]"
                  :disabled="mode == 'view'"
                >
                </v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-menu
                  ref="menu"
                  v-model.trim="fromPickerMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model.trim="item.fromPicker"
                      label="من"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :close-on-click="true"
                      clearable
                      :rules="[rules.required]"
                      :disabled="mode == 'view'"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="fromPickerMenu"
                    v-model.trim="item.fromPicker"
                    scrollable
                    @click:minute="$refs.menu.save(time)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="menu1"
                  v-model.trim="toPickerMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model.trim="item.toPicker"
                      label="إلى"
                      prepend-icon="mdi-clock-time-four-outline"
                      v-bind="attrs"
                      v-on="on"
                      clearable
                      :disabled="toPickerDisabled || mode == 'view'"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="toPickerMenu"
                    v-model.trim="item.toPicker"
                    scrollable
                    @click:minute="$refs.menu1.save(time)"
                    :disabled="mode == 'view'"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.trim="item.totalTime"
                  disabled
                  label="الوقت الكلي"
                  suffix="(HH:MM)"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import * as rules from "../../../utils/vrules";
export default {
  data() {
    return {
      validate: null,
      rules,
      time: null,
      fromPickerMenu: false,
      toPickerMenu: false,
      reportDateMenu: false,
      reports: [],
      parts: [],
      allParts: [],
      machines: [],
      allMachines: [],
      fields: [],
      teamsList: [],
      problemDescriptionList: [],
      incidentLocationList: [],
      typeList: [
        { id: 1, name: "تصحيحي" },
        { id: 2, name: "نمط" },
        { id: 3, name: "انفصال" },
        { id: 4, name: "مخطط" },
      ],
      statusList: [
        { id: 1, name: "منجز" },
        { id: 2, name: "مؤقت" },
        { id: 3, name: "مفتوح" },
      ],
    };
  },

  async created() {
    await this.loadAllFields();
    await this.loadAllMachines();
    await this.loadAllParts();
    await this.loadAllTeams();
  },
  computed: {
    toPickerDisabled() {
      return !this.item.fromPicker;
    },
    currentItem() {
      return {
        date: new Date(this.item.date),
        fieldId: this.item.fieldId,
        machineId: this.item.machineId,
        typeId: this.item.typeId,
        partsDetails: this.item.partsDetails,
        team: this.item.team,
        statusId: this.item.statusId,
        fromPicker: this.item.fromPicker,
        toPicker: this.item.toPicker,
        totalTime: this.item.totalTime,
        actionDescription: this.item.actionDescription,
        problemDescription: this.item.problemDescription,
        incidentLocation: this.item.incidentLocation,

        // reportedBy: this.$store.getters.currentUser,
      };
    },
    dialog() {
      return this.$store.getters["technicianDialog"];
    },
    item() {
      return this.$store.getters["technicianItem"];
    },
    mode() {
      return this.$store.getters["technicianMode"];
    },
  },
  watch: {
    dialog(newVal) {
      if (newVal) this.$vuetify.rtl = true;
      else this.$vuetify.rtl = false;
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
    "item.partsDetails": {
      immediate: true,
      handler(newVal) {
        if (!!newVal) {
          {
            // this.item.machineId = undefined;
            // this.item.partId = undefined;
          }
        }
      },
    },
    "item.fieldId": {
      immediate: true,
      handler(newVal) {
        if (!!newVal) {
          {
            // this.item.machineId = undefined;
            // this.item.partId = undefined;
            this.reloadMachinesData(newVal);
          }
        }
      },
    },
    "item.machineId": {
      immediate: true,
      handler(newVal) {
        if (!!newVal) {
          this.reloadPartsData(newVal);
        }
      },
    },
    "item.fromPicker"(newVal) {
      if (!!newVal) {
        if (!!this.item.toPicker) this.calculateTimeDifference();
      }
    },
    "item.toPicker"(newVal) {
      if (!!newVal) {
        if (!!this.item.toPicker) this.calculateTimeDifference();
      }
    },

    async reportCodeFilter(newVal) {
      if (!!newVal) {
        let report = await this.getReportById(newVal.rid);
        this.item.fieldId = report.fieldId;
        this.item.machineId = report.machineId;
        this.item.partsDetails = report.partsDetails;
      }
    },
  },

  methods: {
    async loadAllFields() {
      let snapshot = (await this.$store.dispatch("getAllFields")).data;
      let tempArr = [];
      snapshot.map((field) => {
        let obj = {
          id: field._id,
          name: field.name_ar,
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
          name: machine.name_ar,
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
          name: machine.name_ar,
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
          id: part._id,
          name: part.name,
          partDescription: part.partDescription,
        };
        tempArr.push(obj);
      });
      this.allParts = tempArr;
    },
    addModalMode() {
      this.$store.commit("setTechnicianMode", true);
      this.open();
    },
    async add() {
      await this.$store.dispatch("addTechnicianReport", this.currentItem);
      this.$store.dispatch("getTechReportsCount");
      this.close();
      this.$notify({
        group: "mainActionsNotifications",
        title: "تمت الإضافة",
        text: "تم إضافة البيانات بنجاح",
        type: "success",
      });
    },

    open() {
      this.emptyItem();
      this.$store.commit("openTechnicianDialog");
    },
    close() {
      this.$store.commit("closeTechnicianDialog");
    },
    emptyItem() {
      this.$store.commit("setTechnicianItem", { partsDetails: [{}] });
    },
    remove(item) {
      const index = this.item.team.indexOf(item);
      if (index >= 0) this.item.team.splice(index, 1);
    },
    removePartSection(index) {
      this.item.partsDetails.splice(index, 1);
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
  },
};
</script>