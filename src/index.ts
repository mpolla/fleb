import { modelist } from "./fleb";

import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';

import { highlightWithinTextarea } from "highlight-within-textarea";

import Favicon from 'favicon.ico';

import About from './components/About.vue';

const routes = [
  { path: "/", component: App },
  { path: "/about", component: About }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app')

require("highlight-within-textarea");

const highlightRegexGrid = /(mygrid |#)[a-z]{2}[0-9]{2}([a-z]{2})?/gim;

const modeRegex = RegExp("(?<=\\b)(" + modelist.join("|") + ")(?=\\b)", "gim");

const highlightRegexpName = /@[a-z]+/gim;

const highlightRegexpMycall = /mycall\s+[a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{0,3}[a-zA-Z](\/(P|M|MM|AM|[0-9]))?/gi;
const theirCallRegex = /(?<=[\s0-9]*)([a-z0-9]{1,3}\/)?\d?[a-z]{1,2}\d{1,4}[a-z]{0,6}(\d[a-z])?(\/[0-9a-z]{1,3})?/gim;


const operatorRegex = /operator\s+[a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{0,3}[a-zA-Z](\/(P|M|MM|AM|[0-9]))?/gi;

const regexM  = /(?<=^\s*)[0-9](?=\s)/gm;
const regexMm = /(?<=^\s*)[0-5][0-9](?=\s)/gim;
const regexHhmm = /(?<=\s*)[0-2][0-9][0-5][0-9](?=\s)/gim;
const highlightRegexCommentline = /^#.*$/mg;

const regexFreq = /(?<=\s)[0-9]+\.[0-9]{1,}(?=\s)/gim;

const regexRst = /(?<=[a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{0,3}[a-zA-Z](\/(P|M|MM|AM|[0-9]))?.* +)[1-9]{1,3}( +[1-9]{1,3})?(?=\s)/gim;
const regexQsocomment = /(?<=\s*)<.*>(?=\s)/gim;
const regexQslmsg = /(?<=\s*)\[.*\](?=\s)/gim;

const regexSerial = /(?<=\s*)[,\.][0-9]+(?=\s)/gim;

import './style.css';
import './jquery.highlight-within-textarea.css';

(<any>$('#notes')).highlightWithinTextarea({

    highlight: [
        {
            highlight: /^\{.*\}/gm,
            className: 'fleb-commentline'
        },


        {
            highlight: /\{.*\}/gm,
            className: 'fleb-commentsegment'
        },


        {
          highlight: highlightRegexCommentline,
          className: 'fleb-commentline'
        },
        {
            highlight: /date [0-9]{4}-[0-9]{2}-[0-9]{2}/gi,
            className: 'fleb-date'
        },
        {
            highlight: /day \++/gi,
            className: 'fleb-reserved-word'
        },
        {
            highlight: modeRegex,
            className: 'fleb-reserved-word'
        },
        {
            highlight: /\b((2190|630|560|160|80|60|40|30|20|17|15|12|10|6|4|2|1\.25|70c|33c|23c|13c|9c|6c|3c|1\.25m|6m|4m|2\.5m|2m|1m)m)(?=\s)/gm,
            className: 'fleb-reserved-word'
        },
        {
            highlight: highlightRegexpMycall,
            className: 'fleb-reserved-word'
        },
        {
            //highlight: /operator [a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{1,4}[a-zA-Z](\/(P|M|MM|AM|[0-9]))?/gi,
            highlight: operatorRegex,
            className: 'fleb-reserved-word'
        },

        {
            highlight: theirCallRegex,
            className: 'fleb-theircall'
        },

        {
            highlight: highlightRegexpName,
            className: 'fleb-name'
        },
        {
            highlight: highlightRegexGrid,
            className: 'fleb-grid'
        },
        {
            highlight: regexRst,
            className: 'fleb-rst'
        },
        {
            highlight: regexQsocomment,
            className: 'fleb-qsocomment'
        },

        {
            highlight: regexQslmsg,
            className: 'fleb-qslmsg'
        },
        {
            highlight: /mywwff [a-z]{1,2}ff-[0-9]{4}/gi,
            className: 'fleb-wwff'
        },
        {
            highlight: /(wwff )?[a-z]{1,2}ff-[0-9]{4}/gi,
            className: 'fleb-wwff'
        },
        {
            highlight: /mysota [a-z]{1,2}\/[a-z]{2}-[0-9]{3}/gi,
            className: 'fleb-sota'
        },
        {
            highlight: /sota [a-z]{1,2}\/[a-z]{2}-[0-9]{3}/gi,
            className: 'fleb-sota'
        },
        {
            highlight: /mypota [a-z]{1,2}-[0-9]{4}/gi,
            className: 'fleb-pota'
        },
        {
            highlight: /pota [a-z]{1,2}-[0-9]{4}/gi,
            className: 'fleb-pota'
        },
        {
            highlight: regexFreq,
            className: 'fleb-freq'
        },
        // m
        {
            highlight: regexM,
            className: 'fleb-time'
        },
        // mm
        {
            highlight: regexMm,
            className: 'fleb-time'
        },
        // hhmm
        {
            highlight: regexHhmm,
            className: 'fleb-time'
        },
        {
            highlight: regexSerial,
            className: 'fleb-serial'
        }
    ]
});
