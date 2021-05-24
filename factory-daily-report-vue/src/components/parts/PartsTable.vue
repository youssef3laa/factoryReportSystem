<template>
  <v-data-table
    :loading="loader"
    :headers="headers"
    :items="parts"
    class="elevation-1"
    :expanded.sync="expanded"
    show-expand
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Parts</v-toolbar-title>
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
          Add Spare Part
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
                    <v-combobox
                      @keyup="getSparePartsLikeName($event)"
                      :items="filterSpareParts"
                      item-text="name"
                      item-value="id"
                      label="Spare Part Code"
                      v-model.trim="filterOptions.name"
                      color="blue-grey lighten-2"
                      multiple
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="localSuppliers"
                      label="Local Supplier"
                      v-model.trim="filterOptions.localSupplierId"
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
                          (+{{ filterOptions.localSupplierId.length - 1 }}
                          others)
                        </span>
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="globalSuppliers"
                      label="Global Supplier"
                      v-model.trim="filterOptions.globalSupplierId"
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
                          (+{{ filterOptions.globalSupplierId.length - 1 }}
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
              <v-btn color="blue darken-1" text @click="filter"> Filter </v-btn>
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
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.name"
                        label="Spare Part Code"
                        :rules="[rules.required]"
                        :error-messages="partCodeErrors"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        :items="machines"
                        label="Equipment Name"
                        v-model="item.machineId"
                        color="blue-grey lighten-2"
                        item-text="name"
                        item-value="id"
                        :rules="[rules.required]"
                      ></v-autocomplete>
                    </v-col>
                  </v-row> -->
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        :items="localSuppliers"
                        label="Local Supplier"
                        v-model="item.localSupplierId"
                        color="blue-grey lighten-2"
                        item-text="name"
                        item-value="id"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        :items="globalSuppliers"
                        label="Global Supplier"
                        v-model="item.globalSupplierId"
                        color="blue-grey lighten-2"
                        item-text="name"
                        item-value="id"
                        clearable
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12 ">
                      <v-textarea
                        v-model="item.partDescription"
                        label="Spare Part Description"
                        :rules="[rules.required]"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this Spare Part?</v-card-title
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
    <template v-slot:expanded-item="{ item }">
      <td class="maxWidth px-10 py-10" :cols="12" colspan="50%">
        <p class="subtitle-2 text-left">Spare Part Description</p>
        {{ item.partDescription }}
      </td>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <span class="headline"></span>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="grey" icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="editModalMode(item)" link>
            <v-list-item-title
              ><v-icon small class="mr-2"> mdi-pencil </v-icon
              ><span class="">Edit</span></v-list-item-title
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
      loader: true,
      expanded: [],
      filterDialog: false,
      dialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Spare Part Code",
          align: "start",
          sortable: true,
          value: "name",
        },
        // { text: "Equipment", value: "machineName", sortable: true },
        { text: "Local Supplier", value: "localSupplierName", sortable: true },
        {
          text: "Global Supplier",
          value: "globalSupplierName",
          sortable: true,
        },
        { text: "Plant", value: "plant", sortable: true },
        { text: "Last Changed", value: "lastChanged", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      parts: [],
      // machines: [],
      suppliers: [],
      item: {},
      tempItem: {},
      filterOptions: {},
      filterSpareParts: [],
      partCodeErrors: [],
      isCodeValid: false,
    };
  },
  computed: {
    formTitle() {
      return this.mode ? "Add Spare Part" : "Edit Spare Part";
    },

    localSuppliers() {
      return this.suppliers.filter((s) => s.supplyType == 1);
    },
    globalSuppliers() {
      return this.suppliers.filter((s) => s.supplyType == 2);
    },

    currentItem() {
      return {
        name: this.item.name,
        // machineId: this.item.machineId,
        ...(!!this.item.localSupplierId && {
          localSupplierId: this.item.localSupplierId,
        }),
        ...(!!this.item.globalSupplierId && {
          globalSupplierId: this.item.globalSupplierId,
        }),
        plant: "0500",
        partDescription: this.item.partDescription,
        lastChanged: new Date().toLocaleString("en-NZ"),
      };
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
  },

  watch: {
    "item.name": {
      immediate: true,
      async handler(newVal) {
        if (!!newVal && newVal != this.tempItem.name) {
          let code = (await this.checkPartCodeExists()).data;
          if (code == "") this.partCodeErrors = "";
          else
            this.partCodeErrors =
              "Spare Part Code '" + this.item.name + "' already exists";
        }
      },
    },
    dialog() {
      if (this.$refs.form) this.$refs.form.reset();
      this.partCodeErrors = "";
    },
  },

  async created() {
    await this.loadSuppliersData();
    if (this.$route.params.id) {
      this.reloadPartsData("getSparePartById", {
        id: this.$route.params.id,
      });
    } else this.reloadPartsData("getAllSpareParts");
  },

  methods: {
    async getSparePartsLikeName(e) {
      let parts = (
        await this.$store.dispatch("getSparePartsLikeName", {
          value: e.target.value,
        })
      ).data;
      this.filterSpareParts = [];
      for (let part of parts) {
        this.filterSpareParts.push({ id: part._id, name: part.name });
      }
    },
    emptyFilterOptions() {
      this.filterOptions = {};
    },
    async reloadPartsData(dispatch, payload) {
      this.loader = true;
      let snapshot = (await this.$store.dispatch(dispatch, payload)).data;
      let tempArr = [];
      let arr = [];
      if (Array.isArray(snapshot)) arr = snapshot;
      else arr.push(snapshot);
      arr.map(async (part) => {
        let obj = {
          id: part._id,
          name: part.name,
          // machineId: part.machineId,
          // machineName: this.machines.find(
          //   (machine) => machine.id == part.machineId
          // ).name,
          plant: part.plant,
          ...("localSupplierId" in part && {
            localSupplierId: part.localSupplierId,
            localSupplierName: (
              await this.$store.dispatch("getSupplierById", {
                id: part.localSupplierId,
              })
            ).data.name,
          }),
          ...("globalSupplierId" in part && {
            globalSupplierId: part.globalSupplierId,
            globalSupplierName: (
              await this.$store.dispatch("getSupplierById", {
                id: part.globalSupplierId,
              })
            ).data.name,
          }),
          partDescription: part.partDescription,
          lastChanged: part.lastChanged,
        };
        tempArr.push(obj);
      });

      this.parts = tempArr;
      this.loader = false;
    },
    // async loadMachineData() {
    //   let snapshot = (await this.$store.dispatch("getAllEquipments")).data;
    //   let tempArr = [];
    //   snapshot.map((machine) => {
    //     let obj = {
    //       id: machine._id,
    //       name: machine.name_eng,
    //     };
    //     tempArr.push(obj);
    //   });
    //   this.machines = tempArr;
    // },
    async loadSuppliersData() {
      let snapshot = (await this.$store.dispatch("getAllSuppliers")).data;
      let tempArr = [];
      snapshot.map((supplier) => {
        let obj = {
          id: supplier._id,
          name: supplier.name,
          supplyType: supplier.supplyType,
        };
        tempArr.push(obj);
      });
      this.suppliers = tempArr;
    },
    addModalMode() {
      this.mode = true;
      this.open();
      this.emptyItem();
    },
    add() {
      this.$store.dispatch("addSparePart", this.currentItem).then(() => {
        this.reloadPartsData("getAllSpareParts");
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
      this.item = { ...item };
      this.tempItem = { ...item };
      this.mode = false;
      this.open();
    },
    editItem() {
      this.currentItem.id = this.item.id;
      this.$store.dispatch("editSparePart", this.currentItem).then(() => {
        this.reloadPartsData("getAllSpareParts");
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
      this.$store.dispatch("deleteSparePart", { id: this.item.id }).then(() => {
        this.closeDelete();
        this.$notify({
          group: "mainActionsNotifications",
          title: "Deleted!",
          text: "Data has been deleted successfully.",
          type: "success",
        });
        this.reloadPartsData("getAllSpareParts");
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

    emptyItem() {
      this.item = Object.assign({});
      this.tempItem = Object.assign({});
    },
    async checkPartCodeExists() {
      return await this.$store.dispatch("getSparePartByExactName", {
        name: this.item.name,
      });
    },
    openFilterModal() {
      this.filterDialog = true;
    },
    closeFilterModal() {
      this.filterDialog = false;
    },
    async filter() {
      this.loader = true;
      this.reloadPartsData("getFilteredSpareParts", this.filterOptions);
      this.closeFilterModal();
      this.loader = false;
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