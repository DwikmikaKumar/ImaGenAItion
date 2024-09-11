<template>
  <div class="app-container">

    <header>
      <img :src="require(`../assets/Mercedes-Logo.png`)" alt="Home" @click="home()" />
      <h2>Export Report</h2>
      <button class="icon close" @click="closeExport()"><svg><use xlink:href="../assets/svg/symbols.svg#close">
        <title>Close Export</title>
      </use></svg></button>
    </header>

    <div class="content">
      <button @click="copyToClipboard" class="copy-button">Copy to Clipboard</button>
      <div id="csv">{{exportCSV}}</div>
    </div>

    <modal-dialog v-if="showConfirmModal" @close="showConfirmModal = false">
      <h3 slot="header">{{confirmHeader}}</h3>
      <div slot="body">{{confirmBody}}</div>
    </modal-dialog>

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
        exportCSV:'',
        showConfirmModal: false,
        confirmHeader:'',
        confirmBody:''
      }
    },

    computed: {
      state() {
        return this.$store.state;
      }
    },

    mounted() {
      if (this.state.incidentsLoaded) {
        this.generateCSV(this.state.sortedIncidents);
      } else {
        // deep-linked
        this.$store.dispatch('getIncidents')
          .then(() => {
            if (this.state.sortedIncidents.length > 0) {
              this.generateCSV(this.state.sortedIncidents);
            } else {
              this.closeExport();
            }
          })
      }
    },

    methods: {

      home() {
        this.$router.push('/list')
      },

      generateCSV(data) {
        this.exportCSV = 'Id,Name,Discovered,Description,Department,\r\n';
        data.forEach(incident => {
          // look out for commas
          this.exportCSV += incident.id + ',';
          this.exportCSV += (incident.name.indexOf(',') == -1) ? incident.name + ',' : `"${incident.name}",`;
          this.exportCSV += this.$moment(incident.discoverd).format('l') + ',';
          this.exportCSV += (incident.description.indexOf(',') == -1) ? incident.description + ',' : `"${incident.description}",`;
          this.exportCSV += incident.department + ',';
          this.exportCSV += '\r\n'
        })
      },

      closeExport() {
        this.$router.push('/list');
      },

      copyToClipboard() {
        let el = document.getElementById('csv'),
          range;
        if (el) {
          console.dir(el);
          if (document.selection) { // IE
            range = document.body.createTextRange();
            range.moveToElementText(el);
            range.select();
          } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(el);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
          }
          let result = document.execCommand('copy');
          if (result) {
            this.confirmHeader = 'Success';
            this.confirmBody = 'The report CSV has been copied to your clipboard.'
          } else {
            this.confirmHeader = 'Failed to Copy';
            this.confirmBody = 'Please copy the text manually.'
          }
          this.showConfirmModal = true;
        }

      }
    }

  }

</script>

<style>
  .content {
    padding: 20px;
    position: relative;
  }
  .copy-button {
    position: absolute;
    top: 25px;
    right: 25px;
  }
  #csv {
    font-family: monospace;
    white-space: pre;
    width: 100%;
    height: 100%;
    overflow: auto;
    border: 1px solid #999;
    padding: 30px 8px 10px;
  }
</style>