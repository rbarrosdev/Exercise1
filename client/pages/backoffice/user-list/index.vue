<template>
  <div class="user-list mx-1 mb-12">
    <h1 class="title mx-4 ">User list</h1>

    <v-dialog 
    v-model="dialog"
    max-width="600px" class="ma-0 pa-0">
      <div>
        <v-card outlined class="ma-1 pa-0">
          <v-card-title>
            {{formTitle}}
          </v-card-title>
          <v-divider></v-divider>

          <v-form
          ref="form"
          v-model="valid"
          data-test="form"
          lazy-validation
          >

            <v-card-text>
              <v-row no-gutters>
                <v-col class="my-0 py-0" >
                  <v-text-field 
                  v-model="editedItem.firstname" 
                  label="Firstname" 
                  dense
                  :rules="firstnameRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="my-0 py-0">
                  <v-text-field 
                  v-model="editedItem.lastname" 
                  label="Lastname" 
                  dense
                  :rules="lastnameRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-text-field 
                  v-model="editedItem.email" 
                  label="Email" 
                  dense
                  :rules="emailRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-select
                  v-model="editedItem.roles"
                  clearable
                  multiple
                  small-chips
                  label="Roles"
                  :items="items"
                  dense
                  ></v-select>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-select
                  v-model="editedItem.organizations"
                  clearable
                  multiple
                  small-chips
                  label="Organizations"
                  :items="['Urban Garden','Chili Shop']"
                  dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="justify-space-between" >
              <v-btn 
              v-if="editedIndex === -1"
              outlined 
              color="primary"
              :loading="loading"
              :disabled="!valid || loading"
              @click="save(editedItem)">
                  <v-icon small left>mdi-plus</v-icon>Add
              </v-btn>
              <v-btn 
              v-else
              outlined 
              color="primary"
              :loading="loading"
              :disabled="!valid || loading"
              @click="save(editedItem)">
                  <v-icon small left>mdi-content-save</v-icon>Save
              </v-btn>

              <v-btn depressed @click="close">
                <v-icon small left>mdi-cancel</v-icon>Cancel
              </v-btn>
            </v-card-actions>

          </v-form>

        
        </v-card>
      </div>  
    </v-dialog> 

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="title">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed @click.prevent="deleteItemConfirm">
            OK
          </v-btn>
          <v-btn outlined color="primary" @click.prevent="closeDelete">
            Cancel  
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template>
      <v-row no-gutters class="mb-4 mt-4 px-8 outlined hidden-md-and-up">
        <v-btn 
        outlined
        block
        color="primary"
        @click.prevent="editItem({})"
        >
        <v-icon left small>mdi-account-plus</v-icon>
        New</v-btn>
      </v-row>

      <v-row no-gutters class="mb-4 outlined hidden-md-and-up">
        <v-expansion-panels >
          <v-expansion-panel>
            <v-expansion-panel-header>Filter</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row no-gutters>
                <v-col>
                  <v-text-field 
                  ref="inputSearch"
                  clearable
                  v-model="search"
                  dense 
                  label="Search"
                  @keyup.enter="onEnterClick($event)"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-select
                  v-model="filter"
                  multiple 
                  clearable
                  clear-icon="mdi-close-circle"
                  small-chips
                  :items="filterItems"
                  dense
                  label="Filter by"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row no-gutters >
                <v-col cols="9">
                  <v-select
                  v-model="sortField"
                  clearable
                  clear-icon="mdi-close-circle"
                  small-chips
                  :items="sortItems"
                  dense
                  class="caption"
                  label="Sort by"
                  ></v-select>
                  
                </v-col>
                <v-spacer></v-spacer>
                <v-col>
                  <v-btn 
                  @click.prevent="setSortDirection(sortDirection)"
                  text
                  color="secondary"
                  >{{sortDirection }}</v-btn>
                </v-col>
              </v-row>
              <v-card-actions class="mt-4 justify-space-around">
                <v-btn 
                outlined 
                block  
                @click.prevent="showUsers"
                >Show</v-btn>
              </v-card-actions>
                
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>

      <template v-if="!showNoData">
        <v-card 
          
          outlined
          :class="[
            'no-gutters',
            index % 2 === 0 ? 'color-border' : 'color-border-alternate',
            'mb-1',
            'hidden-md-and-up'
          ]"
          v-for="(user, index) in users"
          :key="user.userId"
        >
          <v-row xl="12" dense no-gutters>
            <v-col cols="5">
              <v-card-subtitle class="mx-2 mt-4 pa-1">Lastname</v-card-subtitle>
            </v-col>
            <v-col cols="7">
              <v-card-text class="mx-0 mt-4 pa-1">{{
                user.lastname
              }}</v-card-text>
            </v-col>
          </v-row>
          <v-row xl="12" dense no-gutters>
            <v-col cols="5">
              <v-card-subtitle class="mx-2 pa-1">Firstname</v-card-subtitle>
            </v-col>
            <v-col cols="7">
              <v-card-text class="ma-0 pa-1">{{ user.firstname }}</v-card-text>
            </v-col>
          </v-row>
          <v-row xl="12" dense no-gutters>
            <v-col cols="5">
              <v-card-subtitle class="mx-2 pa-1">Email</v-card-subtitle>
            </v-col>
            <v-col cols="7">
              <v-card-text class="ma-0 pa-1">{{ user.email }}</v-card-text>
            </v-col>
          </v-row>
          <v-row xl="12" dense no-gutters>
            <v-col cols="5">
              <v-card-subtitle class="mx-2 pa-1">Roles</v-card-subtitle>
            </v-col>
            <v-col cols="7">
              <v-card-text class="ma-0 pa-1">{{ user.roles }}</v-card-text>
            </v-col>
          </v-row>
          <v-row xl="12" dense no-gutters>
            <v-col cols="5">
              <v-card-subtitle class="mx-2 pa-1">Organizations</v-card-subtitle>
            </v-col>
            <v-col cols="7">
              <v-card-text class="ma-0 pa-1">{{
                user.organizations
              }}</v-card-text>
            </v-col>
          </v-row>
      
              <v-card-actions class="justify-space-around my-4">
                  <v-btn 
                  color="primary" 
                  depressed
                  @click="editItem(user)"
                  >
                    <v-icon small left>mdi-pencil</v-icon> Edit
                  </v-btn>

                  <v-btn 
                  color="warning" 
                  outlined
                  @click="deleteItem(user)"
                  >
                    <v-icon small left>mdi-delete</v-icon> Delete
                  </v-btn>
              </v-card-actions>
      
        </v-card>
      </template>

    </template>

    <template>
      <v-row no-gutters class="ml-4 hidden-sm-and-down">
        <v-btn 
        class="mt-4"
        small 
        color="primary" 
        outlined
        @click="editItem({})"
        >
        <v-icon left small>mdi-account-plus</v-icon>
        New</v-btn>
        <v-spacer></v-spacer>
      </v-row>
      <v-row no-gutters class="hidden-sm-and-down">
          <v-toolbar flat>
            
            <v-toolbar-title class="caption">Search</v-toolbar-title>&nbsp;
            <v-text-field 
            v-model="search" 
            clearable 
            clear-icon="mdi-close-circle" 
            class="body"></v-text-field>&nbsp;
            <v-toolbar-title class="caption">Filter by</v-toolbar-title>&nbsp;
            <v-select
            v-model="filter"
            multiple 
            clearable
            clear-icon="mdi-close-circle"
            small-chips
            :items="filterItems"
            dense
            class="caption"
            ></v-select>&nbsp;
            <v-toolbar-title class="caption">Sort by</v-toolbar-title>&nbsp;
            <v-select
            v-model="sortField"
            clearable
            clear-icon="mdi-close-circle"
            small-chips
            :items="sortItems"
            dense
            class="caption"
            ></v-select>&nbsp;

            <v-btn 
            @click.prevent="setSortDirection(sortDirection)"
            text
            x-small
            class="mr-8"
            color="secondary"
            >{{sortDirection }}</v-btn>

            <v-btn 
            small 
            text 
            class="caption" 
            color="primary"
            @click="showUsers"
            >Show</v-btn>

          </v-toolbar>
      </v-row>

      <template v-if="!showNoData">
      <v-card outlined dense class="ma-1 hidden-sm-and-down">
        <v-row class="ma-1 pl-1 subtitle-2">
          <v-col cols="2" class="ma-0 pa-1">FirstName</v-col>
          <v-col cols="2" class="ma-0 pa-1">LastName</v-col>
          <v-col cols="2" class="ma-0 pa-1">Email</v-col>
          <v-col cols="2" class="ma-0 pa-1">Roles</v-col>
          <v-col cols="3" class="ma-0 pa-1">Organizations</v-col>
          <v-col cols="1" class="ma-0 pa-1">Actions</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row
          no-gutters
          v-for="user in users"
          :key="user.userId"
          class="ma-0 pa-0 item"
        >
        <v-hover v-slot="{ hover }">
          <v-row no-gutters class="body " :class="{'on-hover': hover}">
 
            <v-col cols="2" class="ma-0 pl-3 py-1 pr-1">{{ user.firstname }}</v-col>
            <v-col cols="2" class="ma-0 pl-3 py-1 pr-1">{{ user.lastname }}</v-col>
            <v-col cols="2" class="ma-0 pa-1">{{ user.email }}</v-col>
            <v-col cols="2" class="ma-0 pa-1">{{ user.roles }}</v-col>
            <v-col cols="3" class="ma-0 pa-1">{{ user.organizations }}</v-col>
            <v-col cols="1" class="ma-0 pa-1">
              <v-row no-gutters justify="space-around">
                <v-icon small @click="editItem(user)" color="primary">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(user)" color="warning">mdi-delete</v-icon>
              </v-row>
            </v-col>
          </v-row>
        </v-hover>
          
        </v-row>
      </v-card>
      </template>
      <template v-else>
        <v-row no-gutters justify="space-around">
          <h1>No data available</h1>
        </v-row>
      </template>
    </template>

    <template v-if="!showNoData">
      <v-pagination
        class="mt-4"
        v-model="pagination.page"
        :length="pagination.totalPages"
      ></v-pagination>
    </template>

    
  </div>
</template>

<script>
export default {
  layout: "simple",
  name: "dashboard",
  middleware:"admin",
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      loading: false,
      valid: true,
      showNoData: false,
      users: null,
      pagination: {
        page: 1,
        totalPages: 0,
        itemPerPage: 2,
        totalItems: 0,
        rowsPerPageItems: [1, 2, 4, 8, 16]
      },
      editedIndex: -1,
      editedItem:{
        firstname:'',
        lastname:'',
        email:'',
        roles:[],
        organizations:[]
      },
      defaultItem: {
        lastname: '',
        firstname: '',
        email: '',
        roles: [],
        organizations: [],
      },
      items: ["role_admin","role_customer","role_manager"],
      search: "",
      filter: "",
      sortField: "",
      sortDirection: "Asc",
      filterItems: ['role_admin','role_customer','role_manager','Chili Shop','Urban Garden'],
      sortItems: ['firstname','lastname','email'],
      
      //Validations
      firstnameRules: [
        v => !!v || 'Firstname is required'
      ],
      lastnameRules: [
        v => !!v || 'Lastname is required'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
    };
  },

  watch: {
    pagination: {
      handler() {
        if (this.users!==null && this.pagination.page !== this.users.page) {
          this.initialize();
        }
      },
      deep: true
    }
  },

  created() {
     this.initialize();
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
  },

  methods: {
    async initialize() {
      let url = `/api/users/?page=${this.pagination.page}&limit=${this.pagination.itemPerPage}`;

      if (this.search !== "" && this.search !== null) {
        const keyword = this.search;
        url = `/api/users/?page=${this.pagination.page}&limit=${this.pagination.itemPerPage}&searchValue=${keyword}`;
      }

      if(this.filter) {
        url += `&filter=${this.filter}`
      }

      if(this.sortField) {
        url += `&sortField=${this.sortField}:${this.sortDirection}`
      }

      try {
        const { data, status } = await this.$axios.get(url);

        if (status === 200) {
          this.showNoData = data.users.totalDocs > 0? false : true;
          this.users = data.users.docs;
          this.users.page = data.users.page;

          this.pagination.page = data.users.page;
          this.pagination.totalPages = data.users.totalPages;
          this.pagination.totalItems = data.users.totalDocs;
        }

        if (status === 204) {
          this.showNoData = true;
          this.users = null;
          this.pagination.totalPages = 0;
        }
        
      } catch (e) {
        console.log( e.message )
      }

    },

    async onEnterClick(event){
      //This 2 codes works on bluring element
      //bluring will hide the softkeyboard of a mobile
      //event.target.blur();
      //this.$refs.inputSearch.blur();

      this.$refs.inputSearch.blur();
      await this.showUsers();
    },

    async showUsers() {
      await this.initialize()
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item)
      this.dialog = true;
    },

    async save(item){
      if(this.$refs.form.validate()){
        
        this.loading = true

        if (this.editedIndex > -1) {
          const userId = this.users[this.editedIndex].userId;
          await this.$axios.put(`/api/users/${userId}`, {
            lastname: this.editedItem.lastname,
            firstname: this.editedItem.firstname,
            email: this.editedItem.email,
            roles: this.editedItem.roles,
            organizations: this.editedItem.organizations
          });

          Object.assign(this.users[this.editedIndex], this.editedItem)

          this.$store.dispatch("updatSnackBarAction", {
            show: true,
            timeOut: 2000,
            text: "Update successfully done."
          })
        } else {
          await this.$axios.post("/api/users/admin/registration",
          {
            lastname: this.editedItem.lastname,
            firstname: this.editedItem.firstname,
            email: this.editedItem.email,
            roles: this.editedItem.roles,
            organizations: this.editedItem.organizations
          })

          this.$store.dispatch("updatSnackBarAction", {
            show: true,
            timeOut: 2000,
            text: "Save successfully done."
          })
          this.initialize()
        }
        this.loading = false
        this.close() 
      }
    },

    close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
    },

    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      const userId = this.users[this.editedIndex].userId;
      await this.$axios.delete(`/api/users/${userId}`);

      this.$store.dispatch("updatSnackBarAction", {
        show: true,
        timeOut: 2000,
        text: "Delete successfully done."
      })
      this.initialize()
      this.closeDelete()
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    setSortDirection(value) {
      this.sortDirection = value ==="Asc"? "Desc":"Asc";
    },
  }
};
</script>

<style>
.v-sheet.color-border {
  border-left: 4px solid orangered;
}
.v-sheet.color-border-alternate {
  border-left: 4px solid olive;
}

.row.item {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}

.body:hover {
  background-color: rgba(0, 0, 0, 0.12);
 }

</style>
