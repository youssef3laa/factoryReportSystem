<template>
  <v-data-table
    :loading="loader"
    :headers="headers"
    :items="suppliers"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Suppliers</v-toolbar-title>
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
          Add Supplier
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
                    <v-text-field
                      v-model="filterOptions.name"
                      label="Supplier Name"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="supplyTypes"
                      label="Supply Type"
                      v-model="filterOptions.supplyType"
                      color="blue-grey lighten-2"
                      item-text="name"
                      item-value="id"
                      multiple
                      ><template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.supplyType.length - 1 }}
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
                        label="Supplier Name"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        :items="supplyTypes"
                        label="Supplier Type"
                        v-model="item.supplyType"
                        color="blue-grey lighten-2"
                        item-text="name"
                        item-value="id"
                        :rules="[rules.required]"
                      ></v-autocomplete>
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
              >Are you sure you want to delete this Supplier?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteConfirm"
                >OK</v-btn
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
          <!-- <v-list-item @click="deleteModalMode(item)" link>
            <v-list-item-title
              ><v-icon small> mdi-delete </v-icon><span>Delete</span>
            </v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </template>

    <template v-slot:no-data>
      <no-data></no-data>
    </template>
  </v-data-table>
</template>

<script>
import NoData from "../../UI/NoData.vue";
import * as rules from "../../../utils/vrules";
export default {
  components: {
    NoData,
  },
  data() {
    return {
      validate: null,
      rules,
      loader: true,
      dialog: false,
      dialogDelete: false,
      filterDialog: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Supplier Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        { text: "Supply Type", value: "supplyTypeName", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      suppliers: [],
      supplyTypes: [
        { id: 1, name: "Local" },
        { id: 2, name: "Global" },
      ],
      item: {},
      filterOptions: {},
    };
  },
  computed: {
    formTitle() {
      return this.mode ? "Add Supplier" : "Edit Supplier";
    },
    currentItem() {
      return {
        name: this.item.name,
        supplyType: this.item.supplyType,
      };
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
  },

  created() {
    if (this.$route.params.id) {
      this.reloadSupplierData("getSupplierById", {
        id: this.$route.params.id,
      });
    } else this.reloadSupplierData("getAllSuppliers");
  },

  methods: {
    async reloadSupplierData(dispatch, payload) {
      this.loader = true;
      let snapshot = (await this.$store.dispatch(dispatch, payload)).data;
      let tempArr = [];
      let arr = [];
      if (Array.isArray(snapshot)) arr = snapshot;
      else arr.push(snapshot);
      arr.map((supplier) => {
        let obj = {
          id: supplier._id,
          name: supplier.name,
          supplyType: supplier.supplyType,
          supplyTypeName: this.supplyTypes.find(
            (t) => t.id == supplier.supplyType
          ).name,
        };
        tempArr.push(obj);
      });
      this.suppliers = tempArr;
      this.loader = false;
    },
    addModalMode() {
      this.mode = true;
      this.open();
      this.emptyItem();
    },
    add() {
      this.$store.dispatch("addSupplier", this.currentItem).then(() => {
        this.reloadSupplierData("getAllSuppliers");
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
      this.mode = false;
      this.open();
    },
    editItem() {
      this.currentItem.id = this.item.id;
      this.$store.dispatch("editSupplier", this.currentItem).then(() => {
        this.reloadSupplierData("getAllSuppliers");
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
      this.supplierRef
        .doc(this.item.id)
        .delete()
        .then(() => {
          this.closeDelete();
          this.reloadSupplierData("getAllSuppliers");
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
    },

    emptyFilterOptions() {
      this.filterOptions = {};
    },
    openFilterModal() {
      this.filterDialog = true;
    },
    closeFilterModal() {
      this.filterDialog = false;
    },
    async filter() {
      await this.reloadSupplierData("getFilteredSuppliers", this.filterOptions);
      this.closeFilterModal();
    },
  },
};
</script>