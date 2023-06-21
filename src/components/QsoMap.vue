<template>




  <div class="leaflet-container flebmap">
    <l-map v-model:zoom="zoom" :center="(qsoData !== null && qsoData.length > 0) ? gridtokood(qsoData[qsoData.length-1].gridsquare) : [51, 0]" :options="{scrollWheelZoom: false}">
      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
      ></l-tile-layer>

<!--      <l-marker v-if="qsoData !== null && qsoData.length > 0 && qsoData[0].my_gridsquare !== undefined" :lat-lng="gridtokood(qsoData[0].my_gridsquare)" :icon="torni"/>-->
      <l-marker v-if="qsoData !== null && qsoData.length > 0 && qsoData[0].my_gridsquare !== undefined" :lat-lng="gridtokood(qsoData[0].my_gridsquare)" :icon="torni"/>


      <l-marker v-if="qsoData !== null" v-for="(kuso, index) in qsoData.filter(it => it.gridsquare !== undefined)" :lat-lng="gridtokood(kuso.gridsquare)" :icon="igoni">
        <l-tooltip>
          <table>
            <tr v-for="(value, key) in kuso">
              <th>{{ key }}</th><td>{{ value }}</td>
            </tr>
          </table>
        </l-tooltip>

      </l-marker>

      <l-polyline v-if="qsoData !== null" v-for="(kuso, index) in qsoData.filter(it => it.gridsquare !== undefined)" :lat-lngs="[gridtokood(kuso.my_gridsquare), gridtokood(kuso.gridsquare)]" color="#cc0000"/>

    </l-map>


  </div>





</template>

<script lang="js">

const { locatorToLatLng, distance, bearingDistance, latLngToLocator } = require('qth-locator');

import "leaflet/dist/leaflet.css";

import Pin from '../pin.png';
import TorniUrl from '../signal-tower.png';

import L from 'leaflet';

import {
  LMap, LTileLayer, LMarker, LPolyline, LTooltip

} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap, LTileLayer, LMarker, LPolyline, LTooltip
  },
  props: ['qsoData'],
  data() {
    return {
      zoom: 2,
      igoni: L.icon({
        iconUrl: Pin,
        iconSize: [12, 16],
        iconAnchor: [6, 16]
      }),
      torni: L.icon({
        iconUrl: TorniUrl,
        iconSize: [26, 26],
        iconAnchor: [13, 26]
      })
    };
  },
  methods: {
    iconUrl() {
      return Pin;
    },
    gridtokood(maiden) {
      if (maiden !== undefined && maiden != null) {
        try {
          return locatorToLatLng(maiden);
        } catch (err) {
          return null;
        }
      } else {
        return null;
      }
    },
    makeTooltip(kuso) {
      return "Call: " + kuso.call + "<br/>" + "Grid: " + kuso.gridsquare;
    }
  }
};
</script>

<style>

.flebmap {
  height: 400px;
  min-height: 400px;
  min-width: 400px;
  box-sizing: border-box;
  width: 100%;
}


@media only screen and (max-width: 600px) {

  .flebmap {
    min-height: 200px;
    min-width: 200px;
    width: 200px;
    height: 200px;

    box-sizing: border-box;
  }


  div.leaflet-container {
    width: 100%;
  }
}

</style>