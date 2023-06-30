<template>

  <textarea ref="noutti" id="notes" class="string-example hwt-input hwt-content" v-model="nootit" spellcheck="false" @keydown.enter="processEnterRealtime" @keydown="kbdShortcut">
  </textarea>

  <Transition>
  <div v-if="errorMsg != null" class="error">{{errorMsg}}</div>
  </Transition>

</template>

<script>

import { makeJsonArray, callRegex } from "../fleb";

export default {
  props: ['realtimemode', 'interpolate'],
  data() {
    return {
      //nootit: 'mycall oh2cme\noperator oh2cme\nmygrid KP20lf\n\ndate 2023-05-28\n20m cw\n14.044\n\n1533\n34 ik1xr @Paolo < message > { comment } #JN53er\n10m ssb\nla/oh1xy/p laff-0123\n58 oz4ek 577\n80m ssb\ns53cq\nfa4psq\non3ed #IO91wm',
      nootit: '# Header\nmycall \nmygrid\noperator \n\n# Log\ndate ' + (new Date()).toISOString().substring(0, 10) + '\n',
      //nootit: '',
      noottijson: '',
      myValue: '',
      errorMsg: ''
    }
  },
  watch: {
    nootit: {
      handler(newNootit, oldNootit) {
        this.myValue = makeJsonArray(newNootit, this.$props.interpolate);
        this.errorMsg = this.validate(newNootit, this.myValue);
        this.$parent.kdata = this.myValue;
      },
      immediate: true
    }
  },



  methods: {
    validate (newNootit, data) {

      // Validate text

      if (!/date/.test(newNootit)) {
        return "Please insert date as 'date yyyy-mm-dd'";
      }
      if (!/mycall/.test(newNootit)) {
        return "Please add your own radio call sign as 'mycall xx1yyy";
      }


      // Validate data JSON

      // if (data.find(it => it.station_callsign === "???" || it.station_callsign === null)) {
      //   return "MYCALL MISSING";
      // }

      if (data.find(it => it.band === null)) {
        return "Please insert band, e.g. '10m' or '20m'";
      }

      if (data.find(it => it.mode === null)) {
        return "Please insert operating mode, e.g. 'ssb' or 'cw'";
      }

      return null;
    },
    processEnterRealtime() {

      if (this.$props.realtimemode === false) {
        return;
      }

      let notes = $('#notes');
      let cursorPos = notes.prop('selectionStart');
      let newlinePos = cursorPos;
      let v = notes.val();

      // Empty line, no timestamp needed
      if (/\n/.test(v[cursorPos]) === true && /\n/.test(v[cursorPos-1]) === true) {
        return;
      }
      // Find beginning of current line
      for (let ind=cursorPos-1; ind>=0; ind--) {
        if (/\n/.test(v[ind]) === true && /[0-9]/.test(v[ind+1]) === false) {
          newlinePos = ind;
          break;
        }
      }
      // Abort if a callsign is not found on the current line
      let currentLine = v.substring(newlinePos, cursorPos);
      if (callRegex.test(currentLine) === false) {
        return;
      }
      // Append hhmm UTC timestamp to the beginning of the current line
      let textBefore = v.substring(0,  newlinePos);
      let textAfter  = v.substring(newlinePos+1, v.length);
      let now = new Date();
      let timeString = now.getUTCHours().toString().padStart(2, '0') + "" + now.getUTCMinutes().toString().padStart(2, '0') +  " ";
      notes.val(textBefore + "\n" + timeString + textAfter);
      notes.prop('selectionStart', cursorPos+timeString.length);
      notes.prop('selectionEnd', cursorPos+timeString.length);
    },

    getUTCDate() {
      let now = new Date();
      return now.getUTCFullYear() + "-" + now.getUTCMonth().toString().padStart(2, '0') + "-" + now.getUTCDate().toString().padStart(2, '0');
    },

    getUTCTime() {
      let now = new Date();
      return now.getUTCHours().toString().padStart(2, '0') + "" + now.getUTCMinutes().toString().padStart(2, '0');
    },


    kbdShortcut(e) {
      // F1: insert "date yyyy-mm-dd"
      if (e.keyCode === 112) {
        let notes = $('#notes');
        let cursorPos = notes.prop('selectionStart');
        let v = notes.val();
        notes.val(v.substring(0,  cursorPos) + "date " + this.getUTCDate() + " " + v.substring(cursorPos, v.length));
      }
      // F2: insert "hhmm"
      if (e.keyCode === 113) {
        let notes = $('#notes');
        let cursorPos = notes.prop('selectionStart');
        let v = notes.val();
        notes.val(v.substring(0,  cursorPos) +  this.getUTCTime() + " " + v.substring(cursorPos, v.length));
      }
    }
  }
}
</script>


<style>

.error {
  background-color: pink;
  text-align: center;
  height: 1rem;
  padding: .3rem 0;
}

#notes {
  width: 26rem;
  height: 31rem;
  color: rgba(0, 0, 0, 0.6);
  font-family: monospace;
  margin: 0;
  padding: 0;
}

@media only screen and (max-width: 600px) {
  #notes {
    /*width: 24rem;*/
    /*width: 520px;*/
    width: 97vw;
    max-width: 100%;
    min-width: 100%;
  }

}

</style>