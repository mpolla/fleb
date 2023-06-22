<template xmlns="http://www.w3.org/1999/html">

<div>

</div>

  <table class="qsotable">
<thead>
  <tr>
    <th>#</th>
    <th v-if="show.col_station_callsign">My Call</th>
    <th v-if="show.col_date">Date</th>
    <th v-if="show.col_time">Time</th>
    <th v-if="show.col_call" class="callcolumn">Call</th>
    <th v-if="show.col_band">Band</th>
    <th v-if="show.col_mode">Mode</th>
    <th v-if="show.col_freq">Freq</th>
    <th v-if="show.col_rst_sent">RSTs</th>
    <th v-if="show.col_stx">STX</th>
    <th v-if="show.col_rst_rcvd">RSTr</th>
    <th v-if="show.col_srx">SRX</th>
    <th v-if="show.col_name">Name</th>
    <th v-if="show.col_gridsquare">Grid</th>
    <th v-if="show.col_comment">Comment</th>
    <th v-if="show.col_qslmsg">QSL Message</th>
    <th v-if="show.col_sig">My WWFF Ref</th>
    <th v-if="show.col_sig_info">Their WWFF Ref</th>
    <th v-if="show.col_sota_ref">Their SOTA Ref</th>
    <th v-if="show.col_operator">Operator</th>
    <th v-if="show.my_gridsquare">My grid</th>
  </tr>
</thead>
    <tbody>


        <tr v-for="(qso, index) in qsolist" :key="index">
          <td>{{ index+1 }}</td>

          <td v-if="show.col_station_callsign">{{ qso.station_callsign }}</td>
          <td v-if="show.col_date" class="datecell">{{ formatDate(qso) }}</td>
          <td v-if="show.col_time" class="timecell">{{ formatTime(qso) }}</td>
          <td v-if="show.col_call"><span v-html="flag(qso.call)"></span>&nbsp;<a target="_new" :href="'https://qrz.com/db/' + qso.call">{{ qso.call }}</a></td>
          <td v-if="show.col_band">{{ qso.band !== null ? qso.band : "?" }}</td>
          <td v-if="show.col_mode">{{ qso.mode !== null ? qso.mode : "?"}}</td>
          <td v-if="show.col_freq">{{ qso.freq }}</td>
          <td v-if="show.col_rst_sent">{{ qso.rst_sent }}</td>
          <td v-if="show.col_stx">{{ qso.stx }}</td>
          <td v-if="show.col_rst_rcvd">{{ qso.rst_rcvd }}</td>
          <td v-if="show.col_srx">{{ qso.srx }}</td>
          <td v-if="show.col_gridsquare">{{ qso.gridsquare }}</td>
          <td v-if="show.col_comment">{{ qso.comment }}</td>
          <td v-if="show.col_name">{{ qso.name }}</td>
          <td v-if="show.col_qslmsg">{{ qso.qslmsg }}</td>
          <td v-if="show.col_sig">{{ qso.sig }}</td>
          <td v-if="show.col_sig_info">{{ qso.sig_info }}</td>
          <td v-if="show.col_sota_ref">{{ qso.sota_ref }}</td>
          <td v-if="show.col_operator">{{ qso.operator }}</td>
          <td v-if="show.col_my_gridsquare">{{ qso.my_gridsquare }}</td>
        </tr>

    </tbody>

  </table>


</template>

<style>


table.qsotable, table.flebstats {
  box-sizing: border-box;
  color: #0a246a;
  font-size: 80%;
  border-collapse: collapse;
  font-family: sans-serif;
  border-top: 1px solid darkblue;
  margin-bottom: .3rem;


  width: 23rem;
}

table td + td { border-left:2px solid rgba(255, 255, 255, 0.5); }


thead tr {
  background-color: #ededed;
}

th.callcolumn {
  width: 7rem;
}


tbody td {
  text-align: left;
  padding-right: 8px;
  border: 0px;
}

tbody tr:nth-child(even) {
  background-color: #e4f7d9;
}

tbody tr:nth-child(odd) {
  background-color: #c6f0bd;
}

.datecell {
  width: 5rem;
}

.timecell {
  width: 2rem;
}

</style>


<script lang="js">
import { flagIcon } from "../fleb";

export default {
  props: [ 'qsolist', 'show' ],
  methods: {
    flag(call) {
      return flagIcon(call);
    },
    formatDate: function(qso) {
      if (qso.start === null) {
        return "?";
      }
      try {
        return qso.start.toISOString().split("T")[0];
      } catch (e) {
        return "?";
      }

    },
    formatTime: function(qso) {
      if (qso.start === null) {
        return "?";
      }
      try {
        return qso.start.toISOString().split("T")[1].substring(0,5);
      } catch (e) {
        return "?";
      }
    }
  }
}

</script>