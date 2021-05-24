<template>
  <v-app>
    <v-data-table
      :loading="loader"
      :headers="headers"
      :items="reports"
      :item-class="rowColor"
      class="elevation-1"
      show-expand
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Reports</v-toolbar-title>
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
          <v-btn
            right
            color="primary"
            dark
            class="mb-2 d-flex justify-end"
            @click="addModalMode"
          >
            Add Report
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-dialog v-model="filterDialog" max-width="600px">
          <!-- <template v-slot:activator="{ on: addModalMode, attrs }"> -->
          <!-- </template> -->
          <v-form v-model="filterValidate">
            <v-card>
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
                            :rules="[rules.dateRangeOrEmpty]"
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
                        v-model.trim="filterOptions.partsDetails[0].partCode"
                        label="Spare Part Code"
                        item-text="name"
                        item-value="id"
                        chips
                        multiple
                        clearable
                        deletable-chips
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index === 0">
                            <span>{{ item.name }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption">
                            (+{{
                              filterOptions.partsDetails[0].partCode.length - 1
                            }}
                            others)
                          </span>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-combobox
                        v-model="filterOptions.partsDetails[0].quantity"
                        label="Quantity"
                        small-chips
                        multiple
                        :rules="[rules.numberArray]"
                      >
                        <!-- <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong></strong>". Press
                              <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template> -->
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12 ">
                      <v-autocomplete
                        :items="allParts"
                        v-model="filterOptions.partsDetails[0].partCode"
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
                            (+{{
                              filterOptions.partsDetails[0].partCode.length - 1
                            }}
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
                            @click:close="removeFilter(data.item.id)"
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
                <v-btn
                  color="blue darken-1"
                  :disabled="!filterValidate"
                  text
                  @click="filter"
                >
                  Filter
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog
          v-model.trim="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card flat tile>
            <v-toolbar dark color="primary" extended extension-height="50">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Report Details</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  v-if="mode == true"
                  dark
                  text
                  :disabled="!validate"
                  @click="add"
                >
                  Add
                </v-btn>
                <v-btn
                  v-if="mode == false"
                  dark
                  text
                  :disabled="!validate"
                  @click="editItem"
                >
                  Edit
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-container class="pa-10">
              <v-form v-model="validate" ref="form">
                <v-row v-if="mode != 'view'">
                  <v-col cols="8"> </v-col>
                  <v-col>
                    <v-combobox
                      @keyup="getReportsLikeReportCode($event)"
                      :items="reportCodes"
                      item-text="code"
                      item-value="rid"
                      label="Prefill by Report Code"
                      v-model.trim="reportCodeFilter"
                      color="blue-grey lighten-2"
                      :disabled="mode == 'view'"
                    ></v-combobox>
                  </v-col>
                </v-row>
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
                          label="Date"
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
                      label="Field"
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
                      :disabled="!item.fieldId || mode == 'view'"
                      :items="machines"
                      label="Equipment"
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
                      label="Incident Location"
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
                      label="Problem Description"
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
                        v-model.trim="item.partsDetails[index].partCode"
                        label="Spare Part Code"
                        item-text="name"
                        item-value="id"
                        clearable
                        :disabled="allParts.length < 1 || mode == 'view'"
                        :rules="[
                          !!item.partsDetails[index].quantity
                            ? rules.required
                            : true,
                        ]"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="item.partsDetails[index].quantity"
                        label="Quantity"
                        :rules="[
                          !!item.partsDetails[index].partCode
                            ? rules.required
                            : true,
                          !!item.partsDetails[index].partCode
                            ? rules.number
                            : true,
                        ]"
                        :disabled="mode == 'view'"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12 ">
                      <v-autocomplete
                        :items="allParts"
                        v-model.trim="item.partsDetails[index].partCode"
                        label="Spare Part Description"
                        item-text="partDescription"
                        item-value="id"
                        clearable
                        :disabled="allParts.length < 1 || mode == 'view'"
                        :rules="[
                          !!item.partsDetails[index].quantity
                            ? rules.required
                            : true,
                        ]"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
                <v-row v-if="mode != 'view'" class="justify-end">
                  <v-btn
                    color="primary "
                    dark
                    class="ma-2"
                    @click="item.partsDetails.push({})"
                  >
                    New Spare Part
                  </v-btn>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-autocomplete
                      :items="teamsList"
                      v-model="item.team"
                      label="Teams"
                      item-text="name"
                      item-value="id"
                      multiple
                      :rules="[rules.required]"
                      chips
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
                      label="Status"
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
                      label="Type"
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
                      label="Action Description"
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
                          label="From"
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
                          label="To"
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
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model.trim="item.totalTime"
                      disabled
                      label="Total Time"
                      suffix="(HH:MM)"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col v-if="item.reportCode" cols="6">
                    <v-text-field
                      v-model="reportCodeValue"
                      disabled
                      label="Report Code"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
        <v-dialog v-model.trim="dialogDelete" max-width="540px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this Report?</v-card-title
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
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <span class="headline"></span>

        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :color="item.typeId == 3 ? 'white' : 'grey'"
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
                ><v-icon small class="mr-2"> fa-expand </v-icon
                ><span class="">View</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-if="!item.isDeleted"
              @click="editModalMode(item)"
              link
            >
              <v-list-item-title
                ><v-icon small class="mr-2"> mdi-pencil </v-icon
                ><span class="">Edit</span></v-list-item-title
              >
            </v-list-item>
            <v-list-item
              v-if="!item.isDeleted"
              @click="deleteModalMode(item)"
              link
            >
              <v-list-item-title
                ><v-icon class="mr-2" small> mdi-delete </v-icon
                ><span>Delete</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td class="maxWidth px-10 py-10" :cols="4">
          <p class="subtitle-2 text-left">Status</p>
          {{ item.statusName }}
        </td>
        <td class="maxWidth px-10 py-10" :cols="4">
          <p class="subtitle-2 text-left">From</p>
          {{ item.fromPicker }}
        </td>
        <td class="maxWidth px-10 py-10" :cols="4">
          <p class="subtitle-2 text-left">To</p>
          {{ item.toPicker }}
        </td>
      </template>
      <template v-slot:no-data>
        <no-data></no-data>
      </template>
    </v-data-table>
    <machines-tabs @equipments_tabs_filter="adjustFilter"></machines-tabs>
  </v-app>
</template>

<script>
import NoData from "../UI/NoData.vue";
import MachinesTabs from "../machines/MachineTabs.vue";
import * as rules from "../../utils/vrules";
export default {
  components: {
    NoData,
    MachinesTabs,
  },
  data() {
    return {
      validate: null,
      filterValidate: null,
      rules,
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
        // { text: "Type", value: "typeName", sortable: true },
        // { text: "Status", value: "statusName", sortable: true },
        // { text: "From", value: "fromPicker", sortable: true },
        // { text: "To", value: "toPicker", sortable: true },
        // { text: "Total Time", value: "totalTime", sortable: true },
        {
          text: "Problem Description",
          value: "problemDescription",
          sortable: true,
        },
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
  computed: {
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
        reportCode: `${this.item.fieldId}-${this.item.machineId}-${
          this.item.typeId
        }-${this.item.reportCode ? this.item.reportCode.split("-")[2] : ""}`,
        // reportCodeValue: `${
        //   (
        //     await this.$store.dispatch("getFieldById", {
        //       id: this.item.fieldId,
        //     })
        //   ).data.code
        // }-${
        //   (
        //     await this.$store.dispatch("getEquipmentById", {
        //       id: this.item.machineId,
        //     })
        //   ).data.code
        // }-${this.item.reportCode ? this.item.reportCode.split("-")[2] : ""}`,
        reportedBy: this.$store.getters.currentUser.id,
      };
    },

    toPickerDisabled() {
      return !this.item.fromPicker;
    },
    addOrEditHandler() {
      return this.mode ? this.add : this.editItem;
    },
  },

  asyncComputed: {
    async reportCodeValue() {
      if (this.item.reportCode) {
        let field = await this.$store.dispatch("getFieldById", {
          id: this.item.reportCode.split("-")[0],
        });
        let equipment = await this.$store.dispatch("getEquipmentById", {
          id: this.item.reportCode.split("-")[1],
        });
        return `${field.data.code}-${equipment.data.code}-${
          this.item.reportCode.split("-")[2]
        }`;
      } else return "";
      // return `${
      //   this.fields.find((f) => f.id == this.item.reportCode.split("-")[0]).code
      // }-${
      //   this.allMachines.find((m) => m.id == this.item.reportCode.split("-")[1])
      //     .code
      // }-${this.item.reportCode.split("-")[2]}`;
    },
  },

  watch: {
    item(val) {},
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
        let {
          reportCode,
          team,
          date,
          fromPicker,
          toPicker,
          totalTime,
          id,
          _id,
          ...data
        } = report;
        this.item = { ...data };
      }
    },

    dialog() {
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
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
    } else if (this.$route.query.trid) {
      this.prefillReportModalByTechId(this.$route.query.trid);
    } else this.reloadReports();
  },
  methods: {
    rowColor(item) {
      return item.typeId == 3 ? "white--text red" : "";
    },
    async getReportById(id) {
      return (await this.$store.dispatch("getReportById", { id: id })).data;
    },
    async reloadReports() {
      this.loader = true;
      this.problemDescriptionList.splice(0, this.problemDescriptionList.length);
      this.incidentLocationList.splice(0, this.incidentLocationList.length);
      let respData = (await this.$store.dispatch("getAllReports")).data;
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
          id: part._id,
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
    addModalMode() {
      this.mode = true;
      this.open();
      this.emptyItem();
    },
    async add() {
      await this.$store.dispatch("addReport", this.currentItem);
      this.reloadReports();
      this.close();
      this.$notify({
        group: "mainActionsNotifications",
        title: "Added!",
        text: "Data has been added successfully.",
        type: "success",
      });
    },

    editModalMode(item) {
      this.item = { ...item };
      this.mode = false;
      this.open();
    },
    viewModalMode(item) {
      this.item = { ...item };
      this.mode = "view";
      this.open();
    },
    async editItem() {
      this.currentItem.id = this.item.id;
      await this.$store.dispatch("editReport", this.currentItem);
      this.reloadReports();
      this.close();
      this.$notify({
        group: "mainActionsNotifications",
        title: "Editted!",
        text: "Data has been editted successfully.",
        type: "success",
      });
    },

    deleteModalMode(item) {
      this.item = item;
      this.dialogDelete = true;
    },

    deleteConfirm() {
      this.$store.dispatch("deleteReport", { id: this.item.id }).then(() => {
        this.closeDelete();
        this.reloadReports();
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
    emptyItem() {
      this.item = { partsDetails: [{}] };
    },
    remove(item) {
      const index = this.item.team.indexOf(item);
      if (index >= 0) this.item.team.splice(index, 1);
    },
    removeFilter(item) {
      const index = this.filterOptions.team.indexOf(item);
      if (index >= 0) this.filterOptions.team.splice(index, 1);
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
    async adjustFilter(equipmentId) {
      this.loader = true;
      this.reports = await this.normalizeReturnedReports(
        (
          await this.$store.dispatch("getFilteredReports", {
            machineId: [equipmentId],
          })
        ).data
      );
      this.loader = false;
    },
    async filter() {
      this.loader = true;
      this.closeFilterDialog();
      this.reports = await this.normalizeReturnedReports(
        (await this.$store.dispatch("getFilteredReports", this.filterOptions))
          .data
      );
      this.loader = false;
    },
    closeFilterDialog() {
      this.filterDialog = false;
    },
    clearFilterDialog() {
      this.filterOptions = { partsDetails: [{}] };
    },
    async normalizeReturnedReports(reports) {
      let tempArr = [];
      for (let report of reports) {
        let obj = {
          id: report._id,
          isDeleted: report.isDeleted,
          date: report.date.split("T")[0],
          fieldId: report.fieldId,
          fieldName: (
            await this.$store.dispatch("getFieldById", { id: report.fieldId })
          ).data.name_eng,
          machineId: report.machineId,
          machineName: (
            await this.$store.dispatch("getEquipmentById", {
              id: report.machineId,
            })
          ).data.name_eng,
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
      }
      return tempArr;
    },
    async getReportsLikeReportCode(e) {
      let reports = (
        await this.$store.dispatch("getReportsLikeReportCode", {
          value: e.target.value,
        })
      ).data;
      this.reportCodes = [];
      for (let r of reports) {
        this.reportCodes.push({ rid: r._id, code: r.reportCodeValue });
      }
    },

    async prefillReportModalByTechId(id) {
      this.open();
      let t = await this.$store.dispatch("getTechnicianReportById", {
        id: id,
      });
      t = t.data;
      this.item = { ...t, date: t.date.split("T")[0] };

      this.reloadReports();
    },
  },
};
</script>