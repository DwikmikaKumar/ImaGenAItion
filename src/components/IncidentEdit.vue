<template>
  <div class="app-container">

    <header>
      <img :src="require(`../assets/Mercedes-Logo.png`)" alt="Home" @click="home()" />
      <h2>{{isNew ? 'New' : 'Edit'}} Incident</h2>
      <button class="icon" @click="closeIncident()"><svg><use xlink:href="../assets/svg/symbols.svg#close">
        <title>Close Incident</title>
      </use></svg></button>
    </header>

    <div v-if="incident" class="content form-content">

      <p class="error-msg" v-if="errors.length">
        <b>Please correct the following issue(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <div class="form-field">
        <label for="name">Incident Name</label>
        <input type="text" id="name" v-model="incident.name" placeholder="Name">
      </div>

      <div class="form-field">
        <label>Discovered On</label>
        <datepicker v-model="incident.discovered" format="MMMM dd yyyy" placeholder="Choose a date"></datepicker>
      </div>

      <div class="form-field">
        <label>Incident Description</label>
        <textarea v-model="incident.description" rows="4"></textarea>
      </div>

      <div class="form-field">
        <label>Incident Category</label>
        <span class="radio-option">
          <input type="radio" id="hr" value="HR" v-model="incident.department">
          <label for="hr">HR</label>
        </span>
        <span class="radio-option">
          <input type="radio" id="finance" value="Finance" v-model="incident.department">
          <label for="finance">Finance</label>
        </span>
        <span class="radio-option">
          <input type="radio" id="legal" value="Legal" v-model="incident.department">
          <label for="legal">Legal</label>
        </span>
        <span class="radio-option">
          <input type="radio" id="navigation" value="navigation" v-model="incident.department">
          <label for="navigation">Navigation</label>
        </span>
      </div>
      <!-- <div>
            <h2>Multiple Files</h2>
            <hr/>
            <label>Files
                <input type="file" multiple @change="handleFileUploads( $event )"/>
                <ul v-if="files.length">
                <li v-for="(name, i) in filesNames" :key="i">{{ name }}</li>
                <li>{{ files }}</li>
                </ul>
            </label>
            
            <div>
                <img v-for="image in images" :src="image" />
              </div>
            
            <br>
            <button v-on:click="submitFiles()">Submit</button>
        </div> -->

      <div class="button-bar">
        <button @click="saveIncident()">{{isNew ? 'Add Incident' : 'Update'}}</button>
        <button @click="closeIncident()">Cancel</button>
      </div>
    </div>

    <div class="loading-mask" v-if="isLoading"><span>{{loadingMessage}}</span></div>

  </div>
</template>

<script>
  import Datepicker from 'vuejs-datepicker'

  export default {

    components: {Datepicker},

    data() {
      return {
        isLoading: true,
        loadingMessage:'Loading Incident...',
        isNew: false,
        incident:null,
        errors:[]
      }
    },

    computed: {
      activeIncident() {
        return this.$store.state.activeIncident;
      }
    },

    mounted() {
      this.isNew = this.$route.name === 'incident-new';
      if (this.isNew) {
        this.incident = {
          name: '',
          discovered: new Date(),
          description: '',
          department: ''
        };
        this.isLoading = false;
      } else {
        if (!!this.activeIncident) {
          this.incident = Object.assign({}, this.activeIncident);
          this.isLoading = false;
        } else if (!!this.$route.params.incident_id) {
          // deep-linked
          this.$store.dispatch('getIncident', this.$route.params.incident_id)
            .then(() => {
              this.incident = Object.assign({}, this.activeIncident)
            })
            .catch(this.handleError);
          this.isLoading = false;
        }
      }
    },

    methods: {

      deleteIncident() {
        this.$store.dispatch('deleteActiveIncident')
          .then(() => {
            this.$router.push('/list');
          })
      },

      closeIncident() {
        this.$router.back();
      },

      saveIncident() {
        // Validate that there is content
        this.errors = [];
        if (!this.incident.name) {
          this.errors.push('You must provide a name for the incident.');
        }
        if (!this.incident.discovered) {
          this.errors.push('You must select a discovery date for the incident.');
        }
        if (!this.incident.description) {
          this.errors.push('You must provide a description for the incident.');
        }
        if (!this.incident.department) {
          this.errors.push('You must select a department for the incident.');
        }
        if (this.errors.length === 0) {
          let dispatchMethod = this.isNew ? 'addIncident' : 'updateIncident';
          this.$store.dispatch(dispatchMethod, this.incident)
            .then(() => {
              if (this.isNew) {
                // transition to incident detail view & remove edit from history
                this.$router.replace('/incident/' + this.activeIncident.id);
              } else {
                // send user back where they came from
                this.closeIncident();
              }
            })
            .catch(this.handleError)
        }
      },

      home() {
        this.$router.push('/list')
      },

      handleError(err) {
        console.warn('IncidentEdit.handleError()');
        console.dir(err);
        vm.isLoading = false;
      }

    }
  }

</script>

<style scoped>
  .content {
    padding: 20px;
  }
  .form-field {
    margin: 20px auto;
  }
  textarea {
    width: 100%;
  }
  input.invalid {
    color: darkred;
  }
  input.valid {
    color: darkgreen;
  }
  .form-field > label {
    display: block;
    margin-bottom: 4px;
  }
  .content .button-bar {
    margin-top: 30px;
  }
  .button-bar button {
    margin-right: 20px;
  }
  .radio-option {
    display: block;
    margin: 8px 0;
  }
  .error-msg {
    text-align: center;
    font-size: smaller;
  }
  .error-msg b {
    color: darkred;
  }
</style>