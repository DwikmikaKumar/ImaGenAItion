import Vue from 'vue'
import Vuex from 'vuex'
import dexie from "dexie";

Vue.use(Vuex);

// Setup our IndexedDB database
let incidentsDB = new dexie('IncidentsDB');
incidentsDB.version(1).stores({
  incidents: '++id,name,discovered,description,departments',
});
Vuex.Store.prototype.$db = incidentsDB;

// Create Store

export default new Vuex.Store({
  strict: true,
  state: {
    incidents: [],
    sortedIncidents: [],
    activeIncident: null,
    incidentsLoaded: false
  },
  actions: {

    getIncidents({commit}) {
      return this.$db.incidents
        .reverse() // default sort on most recently added incident
        .toArray()
        .then(incidents => {
          return commit('setIncidents', incidents);
        })
    },

    getIncident({commit}, incident_id) {
      return this.$db.incidents
        .get({'id':Number(incident_id)})
        .then((incident) => {
          return commit('setActiveIncident', incident);
        })
    },

    setActiveIncident({commit}, incident) {
      return commit('setActiveIncident', incident);
    },
    clearActiveIncident({commit}) {
      return commit('clearActiveIncident');
    },

    addIncident({commit}, incident) {
      return this.$db.incidents
        .add(incident)
        .then(id => {
          incident.id = id;
          commit('addIncident', incident);
          return commit('setActiveIncident', incident)
        })
        .catch(err => {throw(err)})
    },

    updateIncident({commit}, incident) {
      return this.$db.incidents
        .put(incident)
        .then(() => {
          return commit('updateIncident', incident)
        })
        .catch(err => {throw(err)})
    },

    setSortedIncidents({commit}, sortedIncidents) {
      return commit('setSortedIncidents', sortedIncidents);
    },

    deleteIncident({commit}, id) {
      return this.$db.incidents
        .delete(id)
        .then(() => {
          return commit('deleteIncident', id)
        })
        .catch(err => {throw(err)})
    },

    deleteActiveIncident({commit, state}) {
      let id = state.activeIncident.id;
      if (id) {
        return this.$db.incidents
          .delete(id)
          .then(() => {
            commit('clearActiveIncident');
            return commit('deleteIncident', id)
          })
          .catch(err => {throw(err)})
      } else {
        throw({message:'Could not find active incident id'})
      }
    }

  },
  mutations: {

    setIncidents(state, incidents) {
      state.incidentsLoaded = true;
      state.incidents = incidents;
    },

    setActiveIncident(state, incident) {
      state.activeIncident = incident;
    },

    clearActiveIncident(state) {
      state.activeIncident = null;
    },

    addIncident(state, incident) {
      state.incidents.unshift(incident);
    },

    updateIncident(state, incident) {
      let i = state.incidents.findIndex(inc => inc.id === incident.id);
      if (i > -1) {
        state.incidents[i] = incident;
      } else {
        throw({message:'Could not find incident by id ['+incident.id+']'})
      }
    },

    setSortedIncidents(state, sortedIncidents) {
      state.sortedIncidents = sortedIncidents;
    },

    deleteIncident(state, id) {
      let i = state.incidents.findIndex(inc => inc.id === id);
      if (i > -1) {
        state.incidents.splice(i, 1);
      } else {
        throw({message:'Could not find incident by id ['+id+']'})
      }
    }

  }
})