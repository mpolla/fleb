<script>
import { defineComponent, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet.geodesic';

export default defineComponent({
  name: 'LGeodesic',
  props: {
    latlngs: {
      type: Array,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({ color: 'maroon', weight: 2, steps: 6 })
    }
  },
  setup(props) {
    let geodesicLayer = null
    onMounted(() => {
      if (!props.map) return
      geodesicLayer = new L.Geodesic(props.latlngs, props.options)
      geodesicLayer.addTo(props.map)
    });
    watch(() => props.latlngs, (newVal) => {
      if (geodesicLayer) geodesicLayer.setLatLngs(newVal)
    });
    onUnmounted(() => {
      if (geodesicLayer && props.map) props.map.removeLayer(geodesicLayer)
    });
    // render
    return () => null
  }
})
</script>