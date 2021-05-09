<template>
  <v-data-table
    :loading="loader"
    :headers="headers"
    :items="teams"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Teams</v-toolbar-title>
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
          Add User
        </v-btn>
        <v-dialog v-model="filterDialog" max-width="500px">
          <!-- <template v-slot:activator="{ on: addModalMode, attrs }"> </template> -->
          <v-card v-if="filterDialog" @keyup.enter="filter">
            <v-card-title>
              <span class="headline">Filter Options</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12 ">
                    <v-text-field v-model="filterOptions.name" label="Name">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="sections"
                      label="Team Section"
                      v-model="filterOptions.sectionId"
                      color="blue-grey lighten-2"
                      item-text="name"
                      item-value="id"
                      multiple
                      ><template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.sectionId.length - 1 }}
                          others)
                        </span>
                      </template></v-autocomplete
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="roles"
                      label="Team Role"
                      v-model="filterOptions.roleId"
                      color="blue-grey lighten-2"
                      item-text="name"
                      item-value="id"
                      multiple
                      ><template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0">
                          <span>{{ item.name }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ filterOptions.roleId.length - 1 }}
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
        <v-dialog
          v-model="dialog"
          max-width="500px"
          @keydown.esc="dialog = false"
        >
          <v-card v-if="dialog">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-model="validate">
                  <span class="red--text" v-if="showErrorMsg"
                    >*{{ errorMsg }}</span
                  >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.name"
                        label="Name"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <div v-if="mode == 1">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model.trim="item.email"
                          label="Email"
                          :rules="[rules.required, rules.email]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="item.password"
                          label="Password"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          name="input-10-1"
                          counter
                          :rules="[rules.required]"
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="item.confirmPassword"
                          label="Confirm Password"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show2 ? 'text' : 'password'"
                          name="input-10-1"
                          counter
                          :rules="[rules.required]"
                          @click:append="show2 = !show2"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                        v-model="item.roleId"
                        :items="roles"
                        label="Role"
                        item-text="name"
                        item-value="id"
                        :rules="[rules.required]"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                        v-model="item.sectionId"
                        label="Section"
                        :items="sections"
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
      errorMsg: "",
      showErrorMsg: false,
      show1: false,
      show2: false,
      loader: true,
      filterDialog: false,
      dialog: false,
      dialogDelete: false,
      mode: true, //add = true, edit = false
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Role", value: "roleName", sortable: false },
        { text: "Section", value: "sectionName", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      teams: [],
      roles: [],
      sections: [],
      item: {},
      filterOptions: {},
    };
  },

  computed: {
    formTitle() {
      return this.mode ? "Add Team Member" : "Edit Team Member";
    },
    currentItem() {
      return {
        name: this.item.name,
        sectionId: this.item.sectionId,
        roleId: this.item.roleId,
      };
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
  },

  async created() {
    await this.loadTeamRolesData();
    await this.loadTeamSectionsData();
    if (this.$route.params.id) {
      this.reloadTeamsData("getTeamById", {
        _id: this.$route.params.id,
      });
    } else this.reloadTeamsData("getAllTeams");
  },

  methods: {
    async loadTeamSectionsData() {
      let snapshot = (await this.$store.dispatch("getAllTeamSections")).data;
      let tempArr = [];
      snapshot.map((section) => {
        let obj = {
          id: section._id,
          name: section.name_eng,
        };
        tempArr.push(obj);
      });
      this.sections = tempArr;
    },
    async loadTeamRolesData() {
      let snapshot = (await this.$store.dispatch("getAllTeamRoles")).data;
      let tempArr = [];
      snapshot.map((role) => {
        let obj = {
          id: role._id,
          name: role.name_eng,
        };
        tempArr.push(obj);
      });
      this.roles = tempArr;
    },
    async reloadTeamsData(dispatch, payload) {
      this.loader = true;
      let snapshot = (await this.$store.dispatch(dispatch, payload)).data;
      let tempArr = [];
      let arr = [];
      if (Array.isArray(snapshot)) arr = snapshot;
      else arr.push(snapshot);
      arr.map(async (team) => {
        let section = (
          await this.$store.dispatch("getTeamSectionById", {
            id: team.sectionId,
          })
        ).data;
        let role = (
          await this.$store.dispatch("getTeamRoleById", { id: team.roleId })
        ).data;
        let obj = {
          id: team._id,
          name: team.name,
          roleId: team.roleId,
          roleName: role.name_eng,
          sectionId: team.sectionId,
          sectionName: section.name_eng,
        };
        tempArr.push(obj);
      });
      this.teams = tempArr;
      this.loader = false;
    },
    addModalMode() {
      this.mode = true;
      this.open();
      this.item = {};
    },
    async add() {
      this.currentItem.email = this.item.email.toLowerCase();
      this.currentItem.password = this.item.password;
      let val = await this.validateAddForm();
      if (val) {
        this.$store.dispatch("addTeam", this.currentItem).then(() => {
          this.reloadTeamsData("getAllTeams");
          this.close();
          this.$notify({
            group: "mainActionsNotifications",
            title: "Added!",
            text: "Data has been added successfully.",
            type: "success",
          });
        });
      }
    },

    editModalMode(item) {
      this.item = { ...item };
      this.mode = false;
      this.open();
    },
    editItem() {
      this.currentItem.id = this.item.id;
      this.$store.dispatch("editTeam", this.currentItem).then(() => {
        this.reloadTeamsData("getAllTeams");
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
      this.teamsRef
        .doc(this.item.id)
        .delete()
        .then(() => {
          this.closeDelete();
          this.reloadTeamsData("getAllTeams");
        });
    },
    async validateAddForm() {
      let checkEmail = (
        await this.$store.dispatch("getTeamByEmail", {
          email: this.item.email.toLowerCase(),
        })
      ).data;
      if (typeof checkEmail != "string") {
        this.errorMsg = "Email already exists.";
        this.showErrorMsg = true;
        return false;
      } else if (this.item.password != this.item.confirmPassword) {
        this.errorMsg = "Passwords do not match.";
        this.showErrorMsg = true;
        return false;
      }
      this.showErrorMsg = false;
      return true;
    },
    save() {
      if (this.mode) this.add();
      else this.editItem();
    },
    open() {
      this.dialog = true;
      this.showErrorMsg = false;
    },
    close() {
      this.dialog = false;
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    async getSectionById(id) {
      let snapshot = await this.$store.dispatch("getTeamSectionById", {
        id: id,
      });
      return snapshot;
    },
    async getRoleById(id) {
      let snapshot = await this.$store.dispatch("getTeamRoleById", {
        id: id,
      });
      return snapshot;
    },
    openFilterModal() {
      this.filterDialog = true;
    },
    closeFilterModal() {
      this.filterDialog = false;
    },
    async filter() {
      await this.reloadTeamsData("getFilteredTeams", this.filterOptions);
      this.closeFilterModal();
    },
    emptyFilterOptions() {
      this.filterOptions = {};
    },
  },
};
</script>