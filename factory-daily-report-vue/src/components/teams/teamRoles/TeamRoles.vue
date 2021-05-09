<template>
  <v-data-table
    :headers="headers"
    :items="roles"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Roles</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mr-5 mb-1"
          hide-details
          outlined
          clearable
          dense
          @keyup="getTeamRoleBySearchValue"
        ></v-text-field>
        <v-btn color="primary" dark class="mb-2" @click="addModalMode">
          Add Role
        </v-btn>
        <v-dialog
          v-model="dialog"
          max-width="500px"
          @keydown.esc="dialog = false"
        >
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
                        v-model="item.name_eng"
                        label="Name (English)"
                        :rules="[rules.required, rules.english]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.name_ar"
                        label="Name (Arabic)"
                        :rules="[rules.required, rules.arabic]"
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
                text
                :disabled="!validate"
                @click="add"
              >
                Add
              </v-btn>
              <v-btn
                v-else
                color="blue darken-1"
                text
                :disabled="!validate"
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
              >Are you sure you want to delete this item?</v-card-title
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
      search: "",
      dialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Name (English)",
          align: "start",
          sortable: false,
          value: "name_eng",
        },
        {
          text: "Name (Arabic)",
          sortable: false,
          value: "name_ar",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      roles: [],
      item: {
        id: "",
        name: "",
      },
    };
  },

  computed: {
    formTitle() {
      return this.mode ? "Add Role" : "Edit Role";
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
    currentItem() {
      return {
        name_eng: this.item.name_eng,
        name_ar: this.item.name_ar,
      };
    },
  },

  created() {
    this.reloadTeamRolesData("getAllTeamRoles");
  },

  methods: {
    async reloadTeamRolesData(dispatch, payload) {
      let snapshot = (await this.$store.dispatch(dispatch, payload)).data;
      let tempArr = [];
      snapshot.map((role) => {
        let obj = {
          id: role._id,
          name_eng: role.name_eng,
          name_ar: role.name_ar,
        };
        tempArr.push(obj);
      });

      this.roles = tempArr;
    },
    addModalMode() {
      this.mode = true;
      this.open();
      this.item = Object.assign({});
    },
    add() {
      this.$store.dispatch("addTeamRole", this.currentItem).then(() => {
        this.reloadTeamRolesData("getAllTeamRoles");
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
      this.$store.dispatch("editTeamRole", this.currentItem).then(() => {
        this.reloadTeamRolesData("getAllTeamRoles");
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
      this.teamRolesRef
        .doc(this.item.id)
        .delete()
        .then(() => {
          this.closeDelete();
          this.reloadTeamRolesData("getAllTeamRoles");
        });
    },
    save() {
      if (this.mode) this.add();
      else this.editItem();
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
    async getTeamRoleBySearchValue() {
      this.reloadTeamRolesData("getTeamRoleByName", {
        name: this.search,
      });
    },
  },
};
</script>