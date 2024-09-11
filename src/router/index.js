import Vue from 'vue'
import VueRouter from 'vue-router'

// component route endpoints
import List from '../components/List'
import CSV from '../components/CSV'
import Incident from '../components/Incident'
import IncidentEdit from '../components/IncidentEdit'

Vue.use(VueRouter);

export default new VueRouter({
  routes:[
    // Component Routes
    {
      path:'/',
      redirect:'/list'
    },{
      path:'/list',
      name:'list',
      component: List
    },{
      path:'/csv',
      name:'csv',
      component: CSV
    },{
      path:'/incident/:incident_id',
      name:'incident',
      component: Incident
    },{
      path:'/incident-new',
      name:'incident-new',
      component: IncidentEdit
    },{
      path:'/incident-edit/:incident_id',
      name:'incident-edit',
      component: IncidentEdit
    }
    // Route Error
    ,{
      path:'*',
      redirect:'/list'
    }
  ]
})