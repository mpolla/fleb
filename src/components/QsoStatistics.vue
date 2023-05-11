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
        <tr v-for="bandi in new Set(qsoData.map(item => item.band).sort())">
          <td>{{ bandi }}</td>
          <td>{{ qsoData.filter(qs => qs.band === bandi ).length}}</td>
          <td>{{ qsoData.filter(qs => qs.band === bandi ).filter(qs => qs.mode === "CW").length }}</td>
          <td>{{ qsoData.filter(qs => qs.band === bandi ).filter(qs => qs.mode === "SSB").length }}</td>
          <td>{{ qsoData.filter(qs => qs.band === bandi ).filter(qs => qs.mode === "FT8").length }}</td>
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


</style>

<script>

export default {
  props: ['qsoData'],
  methods: {
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
          return duration + " minutes";
        }
      } catch (e) {
        return "error";
      }
    }
  }
}


</script>