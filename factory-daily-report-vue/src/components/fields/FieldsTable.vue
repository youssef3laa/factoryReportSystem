<template>
  <v-data-table
    :headers="headers"
    :items="fields"
    :loading="loader"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Fields</v-toolbar-title>
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
          Add Field
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
                  <v-col cols="12">
                    <v-autocomplete
                      :items="allFields"
                      label="Field Name (English)"
                      v-model="filterOptions._id"
                      color="blue-grey lighten-2"
                      item-text="name_eng"
                      item-value="id"
                      multiple
                      ><template v-slot:selection="{ item, index }">
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
                  <v-col cols="12">
                    <v-autocomplete
                      :items="allFields"
                      label="Field Name (Arabic)"
                      v-model="filterOptions._id"
                      color="blue-grey lighten-2"
                      item-text="name_ar"
                      item-value="id"
                      multiple
                      ><template v-slot:selection="{ item, index }">
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
                      v-model="filterOptions.code"
                      label="Field Code"
                      :items="allFields"
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
              <v-btn color="blue darken-1" text @click="filter"> Filter </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px">
          <!-- <template v-slot:activator="{ on: addModalMode, attrs }"> -->
          <!-- </template> -->
          <v-card v-if="dialog" @keyup.enter="submit">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-model="validate">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.name_eng"
                        label="Field Name (English)"
                        :rules="[rules.required, rules.english]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.name_ar"
                        label="Field Name (Arabic)"
                        :rules="[rules.required, rules.arabic]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.code"
                        label="Code"
                        :rules="[rules.required]"
                      ></v-text-field>
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
              >Are you sure you want to delete this Field?</v-card-title
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
              ><span class="">Edit</span></v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="deleteModalMode(item)" link>
            <v-list-item-title
              ><v-icon small> mdi-delete </v-icon><span>Delete</span>
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
      filterDialog: false,
      dialog: false,
      loader: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Field Name (English)",
          align: "start",
          sortable: true,
          value: "name_eng",
        },
        {
          text: "Field Name (Arabic)",
          align: "start",
          sortable: true,
          value: "name_ar",
        },
        {
          text: "Code",
          sortable: true,
          value: "code",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      fields: [],
      allFields: [],
      item: {},
      filterOptions: {},
    };
  },
  watch: {
    validate(val) {
      console.log(val);
    },
  },
  computed: {
    formTitle() {
      return this.mode ? "Add Field" : "Edit Field";
    },
    currentItem() {
      return {
        name_eng: this.item.name_eng,
        name_ar: this.item.name_ar,
        code: this.item.code,
        id: this.item.id,
      };
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
  },

  created() {
    if (this.$route.params.id) {
      this.reloadFieldsData("getFieldById", {
        id: this.$route.params.id,
      });
    } else this.reloadFieldsData("getAllFields");
  },

  methods: {
    submit() {
      if (this.validate) {
        if (this.mode) this.add();
        else this.editItem();
      }
    },
    async reloadFieldsData(dispatch, payload) {
      this.loader = true;
      let snapshot = (await this.$store.dispatch(dispatch, payload)).data;
      let tempArr = [];
      let arr = [];
      if (Array.isArray(snapshot)) arr = snapshot;
      else arr.push(snapshot);
      arr.map((field) => {
        let obj = {
          id: field._id,
          name_eng: field.name_eng,
          name_ar: field.name_ar,
          code: field.code,
          isDeleted: field.isDeleted,
        };
        tempArr.push(obj);
      });
      if (dispatch == "getAllFields") this.allFields = tempArr;
      this.fields = tempArr;
      this.loader = false;
    },
    openFilterModal() {
      this.filterDialog = true;
    },
    closeFilterModal() {
      this.filterDialog = false;
    },
    addModalMode() {
      this.mode = true;
      this.open();
      this.item = {};
    },
    add() {
      this.$store.dispatch("addField", this.currentItem).then(() => {
        this.reloadFieldsData("getAllFields");
        this.$notify({
          group: "mainActionsNotifications",
          title: "Added!",
          text: "Data has been added successfully.",
          type: "success",
        });
        this.close();
      });
    },

    editModalMode(item) {
      this.item = { ...item };
      this.mode = false;
      this.open();
    },
    editItem() {
      this.currentItem.id = this.item.id;
      this.$store.dispatch("editField", this.currentItem).then(() => {
        this.reloadFieldsData("getAllFields");
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
      this.$store.dispatch("deleteField", this.currentItem).then(() => {
        this.reloadFieldsData("getAllFields");
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
    async filter() {
      await this.reloadFieldsData("getFilteredFields", this.filterOptions);
      this.closeFilterModal();
    },
    emptyFilterOptions() {
      this.filterOptions = {};
    },
  },
};
</script>