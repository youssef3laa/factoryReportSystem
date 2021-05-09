<template>
  <div>
    <v-data-table
      :loading="loader"
      :headers="headers"
      :items="machines"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Equipment</v-toolbar-title>
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
          <v-btn color="primary" dark class="mb-2" @click="addModalMode">
            Add Equipment
          </v-btn>
          <v-dialog v-model="filterDialog" max-width="500px">
            <!-- <template v-slot:activator="{ on: addModalMode, attrs }"> -->
            <!-- </template> -->
            <v-card v-if="filterDialog" @keyup.enter="filter">
              <v-card-title>
                <span class="headline">Filter Options</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12 ">
                      <v-autocomplete
                        v-model="filterOptions._id"
                        label="Equipment Name (English)"
                        :items="allMachines"
                        item-text="name_eng"
                        item-value="id"
                        multiple
                        chips
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index === 0">
                            <span>{{ item.name_eng }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption">
                            (+{{ filterOptions._id.length - 1 }}
                            others)
                          </span>
                        </template></v-autocomplete
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12 ">
                      <v-autocomplete
                        v-model="filterOptions._id"
                        label="Equipment Name (Arabic)"
                        :items="allMachines"
                        item-text="name_ar"
                        item-value="id"
                        multiple
                        chips
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index === 0">
                            <span>{{ item.name_ar }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption">
                            (+{{ filterOptions._id.length - 1 }}
                            others)
                          </span>
                        </template></v-autocomplete
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        :items="fields"
                        label="Field Name"
                        v-model="filterOptions.fieldId"
                        color="blue-grey lighten-2"
                        item-text="name"
                        item-value="id"
                        multiple
                        ><template v-slot:selection="{ item, index }">
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
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="filterOptions.code"
                        label="Equipment Code"
                        :items="allMachines"
                        item-text="code"
                        item-value="code"
                        multiple
                        chips
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index === 0">
                            <span>{{ item.code }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption">
                            (+{{ filterOptions.code.length - 1 }}
                            others)
                          </span>
                        </template></v-autocomplete
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue darken-1" text @click="emptyFilterOptions">
                  Clear
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeFilterModal">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="filter">
                  Filter
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog" max-width="500px">
            <!-- <template v-slot:activator="{ on: addModalMode, attrs }"> -->
            <!-- </template> -->
            <v-card v-if="dialog">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form v-model="validate">
                    <v-row>
                      <v-col cols="12 ">
                        <v-text-field
                          v-model="item.name_eng"
                          label="Equipment Name (English)"
                          :rules="[rules.required, rules.english]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12 ">
                        <v-text-field
                          v-model="item.name_ar"
                          label="Equipment Name (Arabic)"
                          :rules="[rules.required, rules.arabic]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <v-autocomplete
                          :items="fields"
                          label="Field Name"
                          v-model="item.fieldId"
                          color="blue-grey lighten-2"
                          :rules="[rules.required]"
                          item-text="name"
                          item-value="id"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="item.code"
                          label="Equipment Code"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  v-if="mode"
                  color="blue darken-1"
                  :disabled="!validate"
                  text
                  @click="add"
                >
                  Add
                </v-btn>
                <v-btn
                  v-else
                  color="blue darken-1"
                  :disabled="!validate"
                  text
                  @click="editItem"
                >
                  Edit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="570px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this Equipment?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="deleteConfirm"
                  >Yes</v-btn
                >
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <span class="headline"></span>

        <v-menu bottom left v-if="!item.isDeleted">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="editModalMode(item)" link>
              <v-list-item-title
                ><v-icon small class="mr-2"> mdi-pencil </v-icon
                ><span>Edit</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item @click="deleteModalMode(item)" link>
              <v-list-item-title
                ><v-icon small class="mr-2"> mdi-delete </v-icon
                ><span>Delete</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:no-data>
        <no-data></no-data>
      </template>
    </v-data-table>
    <!-- <machine-tabs @equipments_tabs_filter="filter"></machine-tabs> -->
  </div>
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
      validate: null,
      rules,
      loader: false,
      filterDialog: false,
      dialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Equipment Name (English)",
          align: "start",
          sortable: true,
          value: "name_eng",
        },
        {
          text: "Equipment Name (Arabic)",
          sortable: true,
          value: "name_ar",
        },
        { text: "Field Name", value: "fieldName", sortable: true },
        { text: "Code", value: "code", sortable: true },
        { text: "Actions", value: "actions", sortable: true },
      ],
      machines: [],
      allMachines: [],
      fields: [],
      item: {},
      filterOptions: {},
    };
  },
  computed: {
    formTitle() {
      return this.mode ? "Add Equipment" : "Edit Equipment";
    },
    currentItem() {
      return {
        name_eng: this.item.name_eng,
        name_ar: this.item.name_ar,
        fieldId: this.item.fieldId,
        code: this.item.code,
        id: this.item.id,
      };
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
  },

  async created() {
    await this.reloadFieldsData();
    if (this.$route.params.id) {
      this.reloadMachinesData("getEquipmentById", {
        id: this.$route.params.id,
      });
    } else this.reloadMachinesData("getAllEquipments");
  },

  methods: {
    async reloadMachinesData(dispatch, payload) {
      this.loader = true;
      this.machines = [];
      this.machines = await this.normalizeMachinesReturned(
        (await this.$store.dispatch(dispatch, payload)).data
      );
      this.loader = false;
      this.allMachines = await this.normalizeMachinesReturned(
        (await this.$store.dispatch("getAllEquipments")).data
      );
    },
    async normalizeMachinesReturned(machines) {
      let tempArr = [];
      let arr = [];
      if (Array.isArray(machines)) arr = machines;
      else arr.push(machines);
      arr.map(async (machine) => {
        let field = (await this.getFieldById(machine.fieldId)).data;
        let obj = {
          id: machine._id,
          name_eng: machine.name_eng,
          name_ar: machine.name_ar,
          fieldId: machine.fieldId,
          fieldName: field.name_eng,
          code: `${field.code}-${machine.code}`,
          isDeleted: machine.isDeleted,
        };
        tempArr.push(obj);
      });
      return tempArr;
    },
    reloadFieldsData() {
      this.$store.dispatch("getAllFields").then((fields) => {
        let tempArr = [];
        fields.data.map((field) => {
          let obj = {
            id: field._id,
            name: field.name_eng,
          };
          tempArr.push(obj);
        });
        this.fields = tempArr;
      });
    },
    addModalMode() {
      this.mode = true;
      this.open();
      this.item = {};
    },
    openFilterModal() {
      this.filterDialog = true;
    },
    closeFilterModal() {
      this.filterDialog = false;
    },
    add() {
      this.$store.dispatch("addEquipment", this.currentItem).then(() => {
        this.reloadMachinesData("getAllEquipments");
        this.close();
        this.$notify({
          group: "mainActionsNotifications",
          title: "Added!",
          text: "Data has been added successfully.",
          type: "success",
        });
      });
    },

    editModalMode(item) {
      this.item = { ...item, code: item.code.split("-")[1] };
      this.mode = false;
      this.open();
    },
    editItem() {
      this.currentItem.id = this.item.id;
      this.$store.dispatch("editEquipment", this.currentItem).then(() => {
        this.reloadMachinesData("getAllEquipments");
        this.close();
        this.$notify({
          group: "mainActionsNotifications",
          title: "Editted!",
          text: "Data has been editted successfully.",
          type: "success",
        });
      });
    },

    deleteModalMode(item) {
      this.item = item;
      this.dialogDelete = true;
    },

    deleteConfirm() {
      this.$store.dispatch("deleteEquipment", this.currentItem).then(() => {
        this.reloadMachinesData("getAllEquipments");
        this.closeDelete();
        this.$notify({
          group: "mainActionsNotifications",
          title: "Deleted!",
          text: "Data has been deleted successfully.",
          type: "success",
        });
      });
    },

    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    async getFieldById(id) {
      let ss = await this.$store.dispatch("getFieldById", { id: id });
      return ss;
    },

    async filter(emittedId) {
      let filterObj = {};
      if (typeof emittedId == "string") {
        this.loader = true;
        this.machines = await this.normalizeMachinesReturned([
          (await this.$store.dispatch("getEquipmentById", { id: emittedId }))
            .data,
        ]);
        this.loader = false;
        this.closeFilterModal();
        return;
      }
      filterObj = JSON.parse(JSON.stringify(this.filterOptions));

      if ("code" in filterObj) {
        for (let c in filterObj.code) {
          filterObj.code[c] = filterObj.code[c].split("-")[1];
        }
      }
      this.loader = true;
      this.machines = await this.normalizeMachinesReturned(
        (await this.$store.dispatch("getFilteredEquipments", filterObj)).data
      );
      this.loader = false;
      this.closeFilterModal();
    },
    emptyFilterOptions() {
      this.filterOptions = {};
    },
  },
};
</script>