<template>
  <div class="app-container">

    <header>
      <img :src="require(`../assets/Mercedes-Logo.png`)" alt="Home" @click="home()" />
      <h2>Incident Report</h2>
      <button class="icon close" @click="closeIncident()"><svg><use xlink:href="../assets/svg/symbols.svg#close">
        <title>Close Incident</title>
      </use></svg></button>
      <span class="button-bar">
        <button @click="deleteSelected()">Delete Incident</button>
        <button @click="editIncident()">Edit Incident</button>
      </span>
    </header>

    <div v-if="!!incident" class="content">

      <div class="item">
        <label>Incident Id</label>
        <span>{{incident.id}}</span>
      </div>

      <div class="item">
        <label>Incident Name</label>
        <span>{{incident.name}}</span>
      </div>

      <div class="item">
        <label>Discovered On</label>
        <span>{{$moment(incident.discovered).format('dddd MMMM D YYYY')}}</span>
      </div>

      <div class="item">
        <label>Incident Description</label>
        <span>{{incident.description}}</span>
      </div>

      <div class="item">
        <label>Incident Department</label>
        <span>{{incident.department}}</span>
      </div>

    </div>

    <modal-dialog v-if="showConfirmModal" @close="showConfirmModal = false">
      <h3 slot="header">Confirm Delete</h3>
      <div slot="body">Are you sure you want to delete this incident report? This can not be undone.</div>
      <div slot="footer">
        <button class="modal-optional-button" @click="showConfirmModal = false">
          Cancel
        </button>
        <button class="modal-default-button" @click="deleteIncident()">
          Confirm
        </button>
      </div>
    </modal-dialog>

    <div class="loading-mask" v-if="isLoading"><span>{{loadingMessage}}</span></div>

  </div>
</template>

<script>
  import ModalDialog from './ModalDialog'

  export default {

    components: {
      ModalDialog
    },

    data() {
      return {
        isLoading: true,
        loadingMessage:'Loading Incident...',
        showConfirmModal: false
      }
    },

    computed: {
      incident() {
        return this.$store.state.activeIncident;
      }
    },

    mounted() {
      if (!this.incident) {
        // deep-linked
        this.$store.dispatch('getIncident', this.$route.params.incident_id)
          .then(() => {
            this.isLoading = false;
          })
          .catch(this.handleError)
      } else {
        this.isLoading = false;
      }
    },

    methods: {

      editIncident() {
        this.$router.push('/incident-edit/'+this.$route.params.incident_id);
      },

      deleteSelected() {
        this.showConfirmModal = true;
      },

      deleteIncident() {
        this.$store.dispatch('deleteActiveIncident')
          .then(() => {
            // return to list view
            this.$router.push('/list');
          })
      },

      closeIncident() {
        // don't want to use back because that could take us to the edit view
        this.$router.push('/list');
      },

      home() {
        this.$router.push('/list')
      },

      handleError(err) {
        console.warn('Incident.handleError()');
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
  .item {
    margin: 15px 0;
  }
  .item label {
    display: inline-block;
    width: auto;
    padding: 8px;
    background: #eee;
  }
  .item span {
    display: block;
    padding: 8px;
  }
</style>