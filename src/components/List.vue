<template>
  <div class="app-container">

    <header>
        <img :src="require(`../assets/Mercedes-Logo.png`)" alt="Home" @click="home()" />
        <h2>Incident Reports</h2>
      
      <span class="button-bar">
        <button @click="exportCSV()" v-if="incidentCount > 0">Export as CSV</button>
        <button @click="addIncident()">Add Incident</button>
      </span>
    </header>

    <div class="content">

      <form id="search" v-if="incidentCount > 0">
        Search <input name="query" v-model="searchQuery">
        <span class="info">Select a row to view incident details</span>
      </form>

      <data-grid
        v-if="incidentCount > 0"
        :columns="incidentColumns"
        :data="incidents"
        :filterKey="searchQuery"
        @rowSelect="incidentSelected"
        @sortedData="onDataSort"
      ></data-grid>

      <p class="empty-msg" v-if="incidents.length === 0">There are currently no incident reports.<br>Select the <b>Add Incident</b> button to create an new incident report.</p>

    </div>

    <div class="loading-mask" v-if="isLoading"><span>{{loadingMessage}}</span></div>

  </div>
</template>

<script>
  import DataGrid from './DataGrid'

  export default {

    name:'list',

    components: {
      DataGrid
    },

    data() {
      return {
        isLoading: true,
        loadingMessage:'Loading Incidents...',
        incidentColumns: ['id','name','discovered','description','department'],
        searchQuery: ''
      }
    },

    computed: {
      incidents() {
        return this.$store.state.incidents;
      },
      incidentsLoaded() {
        return this.$store.state.incidentsLoaded;
      },
      incidentCount() {
        return this.$store.state.incidents.length;
      }
    },

    mounted() {
      if(!this.incidentsLoaded) {
        // get incidents from store
        this.$store.dispatch('getIncidents')
          .then(() => {
            this.isLoading = false;
          })
          .catch(this.handleError)
      } else {
        this.isLoading = false;
      }
    },

    methods: {

      addIncident() {
        this.$router.push('/incident-new')
      },

      incidentSelected(incident) {
        // set an active incident in store so view can pick it up
        this.$store.dispatch('setActiveIncident', incident)
          .then(() => {
            this.$router.push('/incident/'+incident.id);
          })

      },

      exportCSV() {
        this.$router.push('/csv')
      },

      home() {
        this.$router.push('/list')
      },

      onDataSort(data) {
        // record sorted state for CSV view
        this.$store.dispatch('setSortedIncidents', data);
      },

      handleError(err) {
        console.warn('List.handleError()');
        console.dir(err);
        this.isLoading = false;
      }
    }

  }
</script>

<style scoped>
  .content {
    padding: 20px;
  }
  table {
    width: 100%;
  }
  form {
    margin-bottom: 10px;
  }
  .info {
    font-size: smaller;
    float: right;
  }
  .empty-msg {
    text-align: center;
  }
  .incidents li {
    display: block;
    padding: 10px;
    border: solid 1px #ccc;
    margin-bottom: 4px;
  }
</style>