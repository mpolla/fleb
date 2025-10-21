<template>

  <div class="leaflet-container flebmap">
    <!--    <l-map ref="map" :zoom="methodZoom()" :center="methodCenter()" :options="{scrollWheelZoom: false, dragging: false, zoomAnimation: true}">-->
    <l-map ref="map" :zoom="1" :center="[35, 0]" :options="{scrollWheelZoom: false, dragging: false, zoomAnimation: true, maxZoom: 8}" @ready="onMapReady">

      <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
      ></l-tile-layer>

      <!-- mygrid -->
      <l-marker v-if="qthgrid !== null" :lat-lng="gridtokood(qthgrid)" :icon="torni"/>

      <!-- grid -->
      <l-marker v-if="qsoData !== null" v-for="(qso, index) in qsoData" :lat-lng="mapCoordinates(qso)" :icon="igoni">
        <l-tooltip>
          <table class="qsodetails">
            <tr><th>Call</th><td>{{ qso.call }}</td></tr>
            <tr><th>Grid</th><td>{{ qso.gridsquare }}</td></tr>
            <tr><th>DXCC</th><td>{{ findDxcc(qso.call).entity.name + " (" + findDxcc(qso.call).entity.dxcc + ")" }}</td></tr>
          </table>
        </l-tooltip>
      </l-marker>

      <!-- Geodesic lines between stations -->
      <LGeodesic v-if="mapReady && qsoData !== null && qsoData.length > 0 && qsoData[0].my_gridsquare !== undefined"
                 v-for="(qso, index) in qsoData" :latlngs="[gridtokood(qso.my_gridsquare), mapCoordinates(qso)]"
                 color="#aa1100" :map="map.leafletObject" />
    </l-map>

  </div>

</template>

<script lang="js">

const { locatorToLatLng, distance, bearingDistance, latLngToLocator } = require('qth-locator');

import "leaflet/dist/leaflet.css";

import Pin from '../pin.png';
import TorniUrl from '../signal-tower.png';
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import LGeodesic from './LGeodesic.vue';

import { ref, onMounted, nextTick } from 'vue'
import { findDxcc  } from "@ham-core/fast-dxcc";

export default {

  components: {
    LMap, LTileLayer, LMarker, LTooltip, LGeodesic
  },
  setup() {
    const map = ref(null);
    const mapReady = ref(false);
    const onMapReady = () => {
      mapReady.value = true;
    };
    return { map, mapReady, onMapReady };
  },
  props: ['qsoData', 'qthgrid'],
  data() {
    return {
      adifLabels: { call: "Call sign"},
      map: null,
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

  watch: {

    /** Fit map to own QTH and DX grid locations. */
    qsoData: function (val) {
      this.$nextTick(() => {
        if (val !== null) {
          let coords = val.map(it => this.mapCoordinates(it))
          if (this.qthgrid !== null) {
            coords.push(this.gridtokood(this.qthgrid));
          }
          if (coords.length > 0 && coords[0] !== null) {
            this.$refs.map.leafletObject.fitBounds(coords, {padding: [15, 15]});
          }
        }
      })
    }
  },

  methods: {
    findDxcc,
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
    // Get lat/long coordinates from logged grid square or approximate using DXCC entity.
    mapCoordinates(qso) {
      if (qso.gridsquare !== undefined) {
        return this.gridtokood(qso.gridsquare)
      } else {
        return [findDxcc(qso.call).entity.lat, findDxcc(qso.call).entity.long]
      }
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
  margin-top: -4px;
}

@media only screen and (max-width: 600px) {

  .flebmap {
    min-height: 200px;
    min-width: 200px;
    box-sizing: border-box;
  }

  div.leaflet-container {
    width: 100%;
  }
}

</style>