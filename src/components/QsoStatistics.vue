<template>

  <table class="flebstats">
<!--    <tr><th class="headercol">Log start:</th><td>{{ (qsoData.length != 0 && qsoData[0].start !== null)? qsoData[0].start.toISOString().substring(0,16) + "Z" : "-"}}</td></tr>-->

    <tr><th class="headercol">Log start:</th><td class="timestampcell">{{ getStart(qsoData) }}</td></tr>

    <tr><th class="headercol">Log end:</th><td class="timestampcell">{{ getEnd(qsoData) }}</td></tr>
    <tr><th class="headercol">Activity time:</th><td>{{ getDuration(qsoData) }}</td></tr>
    <tr><th class="headercol">Σ QSOs:</th><td> {{ qsoData.length }} </td></tr>

    <tr><td colspan="2">
      <table>
        <thead>
        <tr>
          <th>Band</th><th class="numbercol">QSO</th><th class="numbercol">CW</th><th class="numbercol">Phone</th><th class="numbercol">Digi</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="band in new Set(qsoData.map(item => item.band).sort())">
          <td>{{ band }}</td>
          <td>{{ qsoData.filter(qs => qs.band === band ).length}}</td>
          <td>{{ countCW(qsoData, band) }}</td>

          <td>{{ countPhone(qsoData, band) }}</td>
          <td>{{ countDigi(qsoData, band) }}</td>
        </tr>
        </tbody>

      </table>
    </td></tr>

    <tr><th>Gridsquares</th><td> {{ new Set(qsoData.filter(q => q.gridsquare !== undefined).map(item => item.gridsquare.substring(0, 4))).size}}</td></tr>
    <tr><th>Gridfields</th><td> {{ new Set(qsoData.filter(q => q.gridsquare !== undefined).map(item => item.gridsquare.substring(0, 2))).size}}</td></tr>
  </table>


</template>

<style>

table {
  width: 100%;
}

.headercol {
  width: 8rem;
}

.timestampcell {
  min-width: 17rem;
}

.numbercol {
  width: 15%;
}


@media only screen and (max-width: 600px) {
  table.flebstats {
    width: 98vw;
  }
}


</style>

<script>

export default {
  props: ['qsoData'],
  methods: {
    countCW: function(qsos, band) {
      return qsos.filter(qso => qso.band === band ).filter(qso => ["CW"].includes(qso.mode)).length;
    },
    countPhone: function(qsos, band) {
      return qsos.filter(qso => qso.band === band ).filter(qso => ["SSB", "FM", "AM", "DMR", "DSTAR", "DIGITALVOICE"].includes(qso.mode)).length;
    },
    countDigi: function(qsos, band) {
      return qsos.filter(qso => qso.band === band).length - this.countCW(qsos, band) - this.countPhone(qsos, band);
    },
    getStart: function (dat) {
      if (dat === null || dat.length === 0 || dat[0].start === undefined) {
        return "-";
      }
      let isoString = null;
      try {
        isoString = dat[0].start.toISOString().substring(0,16) + "Z";
      } catch (e) {
        console.warn("Unable to format date " + dat[0].start);
      }
      return isoString;
    },
    getEnd: function (dat) {
      if (dat === null || dat.length === 0 || dat[0].start === undefined) {
        return "-";
      }
      let isoString = null;
      try {
        isoString = dat[dat.length-1].start.toISOString().substring(0,16) + "Z";
      } catch (e) {
        console.warn("Unable to format date " + dat[0].start);
      }
      return isoString;
    },
    getDuration: function (dat) {
      if (dat === null || dat.length === 0) {
        return "-";
      }
      try {
        let duration = Math.floor(((dat[dat.length - 1].start - dat[0].start) / 1000) / 60);
        if (!isNaN(duration)) {
          let hours = Math.floor(duration / 60);
          let minutes = duration % 60;
          if (minutes == 0) {
            minutes = 1;
          }
          return (hours > 0 ? hours + " hours " : "") + minutes + " minutes";
        }
      } catch (e) {
        return "error";
      }
    }
  }
}


</script>