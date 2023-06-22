<template>

  <!--  <div id="app">-->

  <div class="grid-container">

    <div class="grid-item header">
      <h1 title="Fast Log Entry in-Browser">FLEB</h1>



      <div class="toolbar">

        <input type="submit" @click="nollaile" value="🗑 Clear" title="Delete current text without saving." />
        <!--        <input type="submit" @click="esikatsele" value="Preview ADIF" />-->
        <input type="submit" @click="latailetxt" value="⭳ TXT" title="Download text file." />
        <!--        <input type="submit" @click="latailecsv" value="⭳ CSV" title="Export to CSV format." />-->
        <input type="submit" @click="lataileadif" value="⭳ ADIF" title="Export to ADIF format." />
        <input type="submit" @click="show.menu = !show.menu" value="⚙ Settings" title="Display settings." />

      </div>


      <Transition>
        <div  v-if="show.menu">

          <fieldset>
            <legend>Settings</legend>
            <fieldset>
              <legend>Mode</legend>
              <label for="realtime">
                <input type="checkbox" name="realtimemode" value="realtime" v-model="realtimemode">
                Real time mode (add current timestamp on ENTER).
              </label><br>
              <label for="interpolate">
                <input type="checkbox" name="interpolate" value="interpolate" v-model="interpolate">
                Interpolate timestamps.
              </label>
            </fieldset>


            <label>Show QSO list<input v-model="show.list" type="checkbox" /></label>
            <label>Show map<input v-model="show.map" type="checkbox" /></label>
            <label>Show statistics<input v-model="show.statistics" type="checkbox" /></label>

            <fieldset>
              <legend>Show columns</legend>

              <table>
                <tr><td>
                  <label><input type="checkbox" v-model="show.col_station_callsign">Station callsign</label><br>
                  <label><input type="checkbox" disabled="disabled" v-model="show.col_call">Callsign</label><br>
                  <label><input type="checkbox" v-model="show.col_date">Date</label><br>
                  <label><input type="checkbox" v-model="show.col_time">Time</label><br>
                  <label><input type="checkbox" v-model="show.col_band">Band</label><br>
                  <label><input type="checkbox" v-model="show.col_mode">Mode</label><br>
                  <label><input type="checkbox" v-model="show.col_freq">Frequency</label><br>

                  <label><input type="checkbox" v-model="show.col_rst_sent" title="Received RST report.">RSTs</label><br>
                  <label><input type="checkbox" v-model="show.col_stx" title="Sent serial number">STX</label><br>
                  <label><input type="checkbox" v-model="show.col_rst_rcvd">RSTr</label><br>

                    </td>
                  <td>

                    <label><input type="checkbox" v-model="show.col_srx" title="Received serial number">SRX</label><br>
                    <label><input type="checkbox" v-model="show.col_gridsquare" title="Grid square">Grid</label><br>
                    <label><input type="checkbox" v-model="show.col_comment">Comment</label><br>
                    <label><input type="checkbox" v-model="show.col_name" title="Operators name">Name</label><br>



                    <label><input type="checkbox" v-model="show.col_qslmsg">QSL message</label><br>
                    <label><input type="checkbox" v-model="show.col_sig">SIG</label><br>
                    <label><input type="checkbox" v-model="show.col_sig_info">SIG INFO</label><br>
                    <label><input type="checkbox" v-model="show.col_sota_ref">SOTA Reference</label><br>
                    <label><input type="checkbox" v-model="show.col_operator">Operator</label><br>
                    <label><input type="checkbox" v-model="show.col_my_gridsquare">My gridsquare</label><br>
                  </td>
                </tr>
              </table>

            </fieldset>


          </fieldset>
        </div>
      </Transition>

    </div>

    <div class="grid-item">
      <FlebEditor :realtimemode="realtimemode" :interpolate="interpolate"/>
      <QsoMap v-if="show.map" :qsoData="kdata"/>
    </div>


    <div class="grid-item sidebar">
      <QsoStatistics :qsoData="kdata" v-if="show.statistics"/>
      <QsoTable v-if="show.list" :show="show" :qsolist="kdata"/>
    </div>

    <div class="grid-item footer">
      See also: Fast Log Entry (FLE) <a href="https://df3cb.com/fle/">https://df3cb.com/fle/</a>
    </div>

  </div>

  <!--  </div>-->

</template>

<script>

import {downloadAdif, downloadTxt, downloadCsv, notesReset, previewAdif} from "./fleb";

import FlebEditor from "./components/FlebEditor.vue";
import QsoTable from "./components/QsoTable.vue";
import {notes} from "./fields";
import QsoStatistics from "./components/QsoStatistics.vue";
import QsoMap from "./components/QsoMap.vue";


export default {
  components: {QsoStatistics, FlebEditor, QsoTable, QsoMap},
  data() {
    return {

      adif_fields: [
        "station_callsign",
        "call",
        "start",
        "band",
        "mode",
        "freq",
        "rst_sent",
        "stx",
        "rst_rcvd",
        "srx",
        "gridsquare",
        "comment",
        "name",
        "qslmsg",
        "sig",
        "sig_info",
        "sota_ref",
        "operator",
        "my_gridsquare"


      ],


      count: 0,
      zoom: 2,
      kdata: [],


      realtimemode: false,
      interpolate: true,





      show: {
        list: true,
        statistics: true,
        export: true,
        map: true,
        menu: false,
        // col_call: false,
        // col_rst: false,
        // col_wwff: false,

        col_station_callsign: false,
        col_call: true,
        col_date: true,
        col_time: true,
        col_band: true,
        col_mode: true,
        col_freq: false,
        col_rst_sent: false,
        col_stx: false,
        col_rst_rcvd: false,
        col_srx: false,
        col_gridsquare: false,
        col_comment: false,
        col_name: false,
        col_qslmsg: false,
        col_sig: false,
        col_sig_info: false,
        col_sota_ref: false,
        col_operator: false,
        col_my_gridsquare: false


      },
    }
  },




  watch: {
    kdata(uusi, vanha) {}
  },
  created() {
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },

  methods: {
    nollaile() {
      notesReset();
    },
    esikatsele() {
      previewAdif();
    },
    lataileadif() {
      downloadAdif();
    },
    latailecsv() {
      downloadCsv();
    },
    latailetxt() {
      downloadTxt();
    },
    confirmLeave() {
      return window.confirm('Do you really want to leave? you have unsaved changes!')
    },
    confirmStayInDirtyForm() {
      return !this.confirmLeave();
    },
    beforeWindowUnload(e) {
      if (this.confirmStayInDirtyForm()) {
        // Cancel the event
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = ''
      }
    },

  },
  name: 'app',
}
</script>

<style>




label {
  white-space: nowrap;
}






</style>



