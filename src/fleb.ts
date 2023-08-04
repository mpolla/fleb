const dateformat = require("dateformat");
let fields = require("./fields.ts");


const wsjtmodes = ["JT65", "JT9", "JT6M", "JT4", "JT44", "FSK441", "FT8", "FT4", "ISCAT", "MSK144", "QRA64", "T10", "WSPR"];

export const modelist = ["bar", "cw", "ssb", "am", "fm", "rtty", "ft8", "ft4", "psk", "jt65", "jt9", "ardop", "atv", "c4fm", "chip", "clo",
    "contesti", "digitalvoice", "domino", "dstar", "fa", "fsk441", "hell", "iscat", "js8", "jt4", "jt6m",
    "jt44", "mfsk", "msk144", "mt63", "olivia", "opera", "pac", "pax", "pkt", "psk2k", "q15", "qra64", "ros",
    "rttym", "sstv", "t10", "thor", "thrb", "tor", "v4", "voi", "winmor", "wspr"];

const regexBand = RegExp(/(?<=\b)((2190|630|560|160|80|60|40|30|20|17|15|12|10|6|4|2|1\.25|70c|33c|23c|13c|9c|6c|3c|1\.25m|6m|4m|2\.5m|2m|1m)m)(?=\b)/, 'gm');

export const callRegex = RegExp(/(?<=[\s0-9]*)([a-z0-9]{1,3}\/)?\d?[a-z]{1,2}\d{1,4}[a-z]{0,6}(\d[a-z])?(\/[0-9a-z]{1,3})?/, 'im');

const sotaRefRegex = RegExp(/[a-z]{1,2}\/[a-z]{2}-[0-9]{3}/, 'im');
const potaRefRegex = RegExp(/[a-z]{1,2}-[0-9]{4}/, 'im');

const MY_SIG_WWFF = "WWFF";

const flagmap = {
    // Finland
    "oh|og|oi": "🇫🇮",
    // Norway
    "la|ln": "🇳🇴",
    // Italy
    "i[a-z]?": "🇮🇹",
    // Denmark
    "oz": "🇩🇰",
    // Belgium
    "o[nopqrst]": "🇧🇪",
    // Slovenia
    "s5": "🇸🇮",
    // France
    "f[abcdef]|tm": "🇫🇷",
    // Sweden
    "s[a-m]": "🇸🇪",
    // Poland
    "s[nopqr]|3z": "🇵🇱",
    // Russia
    "(u[a-i])|(r[a-z])": "🇷🇺",
    // Ukraine
    "u[r-z]|em|eo": "🇺🇦",
    // Estonia
    "es": "🇪🇪",
    // Spain
    "e[a-h]": "🇪🇸",
    // Germany
    "d[a-m]": "🇩🇪",
    // Crozet
    "ft8w": "🇹🇫",
    // The Netherlands
    "p[abdei]": "🇳🇱",
    // Latvia
    "yl": "🇱🇻",
    // Lithuania
    "ly": "🇱🇹",
    // Romania
    "y[o-r]": "🇷🇴",
    // Czech Republic
    "o[kl]": "🇨🇿",
    // Slovak Republic
    "om": "🇸🇰",
    // Portugal
    "ct": "🇵🇹",
    // USA
    "k|w|n|a[a-k]": "🇺🇸",
    // Canada
    "v[ecoy]|ci": "🇨🇦",
    // Hungary
    "h[ag]": "🇭🇺",
    // France
    "f[abcdef]?|tm": "🇫🇷",
    // Bulgaria
    "lz": "🇧🇬",
    // England
    "g": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    // Austria
    "oe": "🇦🇹",
    // Croatia
    "9a": "🇭🇷",
    // Switzerland
    "hb": "🇨🇭"
};


// Originally from https://www.npmjs.com/package/adif
let AdiWriter = function(programversion: String) {
    this.data = "ADIF Export for Fast Log Entry in-Browser by OH2CME\n";
    this.writeField("programid", "FLEB");
    this.data += "\n";
    this.writeField("adif_ver", "3.1.0");
    //if (programversion) this.writeField("programversion", programversion);
    this.data += "\n<EOH>\n";
};

interface AdiWriter {
    data: String

    writeContact(obj: Object): void

    writeProperty(obj1: Object, obj2: Object): void

    writeField(obj3: String, obj4: String): void

    writeAll(obj: Object): String
}


AdiWriter.prototype.getData = function() {
    return this.data;
}

AdiWriter.prototype.writeAll = function(contacts: Object[]) {
    for (let i = 0; i < contacts.length; i++) {
        this.writeContact(contacts[i]);
    }
    return this.data;
};

// Originally from https://www.npmjs.com/package/adif
AdiWriter.prototype.writeContact = function(contact: Object) {
    let first = true;
    for (let key in contact) {

        // Ignore FLEB meta attribute
        if (key === "qsotimeknown") {
            continue;
        }

        if (contact[key as keyof Object] === null || contact[key as keyof Object] === undefined) {
            continue;
        }

        if (first === true) {
            first = false;
        }
        else {
            this.data += " ";
        }
        this.writeProperty(key, contact[key as keyof Object]);
    }
    this.data += " <EOR>\n";
};

// Originally from https://www.npmjs.com/package/adif
AdiWriter.prototype.writeProperty = function(key: any, value: any) {
    if (key === "_id") key = "app_cloudshack_id" as keyof Object;
    else if (key === "_rev") key = "app_cloudshack_rev" as keyof Object;
    else if (key === "start") {

        let date = null;
        if (value !== null) {
            try {
                date = new Date(value.toISOString());
            } catch (e) {
                console.warn("Invalid date " + value);
            }
        }
        this.writeField("qso_date", dateformat(date, "UTC:yyyymmdd"));
        this.data += " ";
        this.writeField("time_on", dateformat(date, "UTC:HHMM"));
        return;
    }
    else if (key === "end") {
        let date = new Date(value.toISOString());
        this.writeField("qso_date_off", dateformat(date, "UTC:yyyymmdd"));
        this.data += " ";
        this.writeField("time_off", dateformat(date, "UTC:HHMM"));
        return;
    }

    if (!(key in fields)) {
        console.log("adif: unkown adif field", key);
        return;
    }

    var field = fields[key];
    var value = field.encode(value);

    this.writeField(key, value);
};

AdiWriter.prototype.writeField = function(key: String, value: String) {
    if (value !== undefined && value !== null) {
        this.data += "<" + key.toUpperCase() + ":" + value.length + ">";
        this.data += value;
    }

}

export function parseName(line: String) {
    let res = line.match(/(?<=@)[a-z]+/i);
    if (res != null) {
        return res[0];
    }
    return null;
}

export function parseGrid(line: String) {
    let res = line.match(/(?<=(mygrid\s+|#))[A-Z]{2}[0-9]{2}([a-z]{2})?/gi);
    if (res != null) {
        return res[0];
    }
    return null;
}


export function parseSTX(line: String) : String {
    let res = line.match(/(?<=,)([0-9]+)?/gi);
    if (res != null) {
        return res[0];
    }
    return null;
}

export function parseSRX(line: String) : String {
    let res = line.match(/(?<=\.)([0-9]+)?/gi);
    if (res != null) {
        return res[0];
    }
    return null;
}


export function parseQsoComment(line: string) {
    let res = line.match(/(?<=<).*(?=>)/);
    if (res != null) {
        return res[0].trim();
    }
    return null;
}

export function parseQsoQslMsg(line: string) {
    let res = line.match(/(?<=\{).*(?=\})/);
    if (res != null) {
        return res[0];
    }
    return null;
}

export function parseWwffref(line: string) {
    let res = line.match(/[a-z]{1,2}ff-[0-9]{4}/i);
    if (res != null) {
        return res[0].toUpperCase();
    }
    return null;
}


let NUMBER = 0;
let MYCALL = null;
let MYGRID = null;

let DATE = null;
let TIME = null;
let HOUR = "00";
let MINUTE = "00";
let FREQ_SET_ON_CURRENT_ROW = false;
let CALL = "";
let BAND = null;
let FREQ = null;
let MODE = null;
let MYWWFF = null;
let MYSOTA = null;
let MYPOTA = null;
let OPERATOR = null;
let NICK = null;
let GLOBALQSLMSG = null;
let STX = null;

function parseOperator(line) {
    let koolit = callRegex.exec(line);
    if (koolit != null) {
        return koolit[0].toUpperCase();
    }
    return null;
}

export function parseNick(line) {
    let nikit = /(?<=nickname ).*/.exec(line);
    if (nikit != null) {
        return nikit[0];
    }
    return null;
}

function parseGlobalQslMsg(line) {
    let qslmsg = /(?<=qslmsg ).*/.exec(line);
    if (qslmsg != null) {
        return qslmsg[0];
    }
    return null;
}

export function parseSotaref(line) {
    let sotat = sotaRefRegex.exec(line);
    if (sotat != null) {
        return sotat[0].toUpperCase();
    }
    return null;
}

export function parsePotaref(line) {
    let potat = potaRefRegex.exec(line);
    if (potat != null) {
        return potat[0].toUpperCase();
    }
    return null;
}

export function printAdif(jsonit, raw) {
    let adiWriter = new AdiWriter("0.1");
    let outjson = jsonit;
    let out: string;

    // Use CRLF for newlines for FLE compatibility
    if (!raw) {
        const tmpOut : String = adiWriter.writeAll(outjson)
        out = tmpOut.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    } else {
        out = adiWriter.writeAll(outjson);
    }
    return out.replaceAll("\n", "\r\n");
}


const fileNameString = () => {
    let s = "";
    if (MYCALL !== null) {
        s += MYCALL.replaceAll("/", "-");
    }

    if (MYWWFF !== null) {
        s += " @ " + MYWWFF;
    } else if (MYSOTA !== null) {
        s += " @ " + MYSOTA.replaceAll("/", "_");
    } else if (MYPOTA !== null) {
        s += " @ " + MYPOTA;
    }

    if (DATE !== null) {
        s += " " + DATE.replaceAll("-", "");
    }
    if (s === "") {
        return "fleb_" + new Date().toISOString();
    }
    return s;

}


export function downloadAdif() {

    const notesElem = document.getElementById('notes') as HTMLInputElement | null;
    let nootit = notesElem?.value

    let jnootit = makeJsonArray(nootit);

    let fil = fileNameString() + ".adi";

    // Generate .adi data
    let adiWriter = new AdiWriter("0.1");
    let adiData : string = adiWriter.writeAll(jnootit);

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(adiData));
    element.setAttribute('download', fil);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function downloadCsv() {
    const nootitElem = document.getElementById('notes') as HTMLInputElement | null;
    const nootit = nootitElem?.value
    let jnootit = makeJsonArray(nootit);
    let fil = fileNameString() + ".csv";
    // TODO JSON to CSV
    let csvData = "a,b,c,TODO";
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvData));
    element.setAttribute('download', fil);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function downloadTxt() {
    const nootitElem = document.getElementById('notes') as HTMLInputElement | null
    const nootit = nootitElem?.value;
    let fil = fileNameString() + ".txt";
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(nootit));
    element.setAttribute('download', fil);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


export function flagIcon(call) {
    for (const [prefix, flag] of Object.entries(flagmap)) {
        let rege = RegExp(`^${prefix}`, 'im');
        if (rege.test(call.split('/')[0])) {
            return flag;
        }
    }
    return "&nbsp;&nbsp;&nbsp;";
}

function handleDate(line) {

    let rx = /date ([0-9]{4}-[0-9]{2}-[0-9]{2})/g;
    let dated = rx.exec(line);
    if (dated != null) {
        DATE = dated[1];
    }
}

function handleDateIncrement(line) {

    let days = line.match(/\+/g).length;


    let today = new Date(DATE);
    let tomorrow = new Date(today.setDate(today.getUTCDate() + days));
    DATE = tomorrow.toISOString().split("T")[0];
}


export const detectband = (freqString) => {
    let freq = parseFloat(freqString);
    if (.1357 <= freq && freq <= .1378) { return "2190m"; }
    if (.472 <= freq && freq <=	.479) { return "630m"; }
    if (.501 <= freq && freq <=.504) { return "560m"; }
    if (1.8 <= freq && freq <=2.0) { return "160m"; }
    if (3.5 <= freq && freq <=	4.0) { return "80m"; }
    if (5.06 <= freq && freq <=	5.45) { return "60m"; }
    if (7.0 <= freq && freq <= 7.3) { return "40m"; }
    if (10.1 <= freq && freq <=	10.15) { return "30m"; }
    if (14.0 <= freq && freq <=14.35) { return "20m"; }
    if (18.068 <= freq && freq <= 18.168) { return "17m"; }
    if (21.0 <= freq && freq <= 21.45) { return "15m"; }
    if (24.890 <= freq && freq <= 24.99) { return "12m"; }
    if (28.0 <= freq && freq <=	29.7) { return "10m"; }
    if (50 <= freq && freq <= 54) { return "6m"; }
    if (70 <= freq && freq <= 71) { return "4m"; }
    if (144 <= freq && freq <= 148) { return "2m"; }
    if (222 <= freq && freq <= 225) { return "1.25m"; }
    if (420 <= freq && freq <= 450) { return "70cm"; }
    if (902 <= freq && freq <= 928) { return "33cm"; }
    if (1240 <= freq && freq <=	1300) { return "23cm"; }
    if (2300 <= freq && freq <=	2450) { return "13cm"; }
    if (3300 <= freq && freq <=	3500) { return "9cm"; }
    if (5650 <= freq && freq <=	5925) { return "6cm"; }
    if (10000 <= freq && freq <= 10500) { return "3cm"; }
    if (24000 <= freq && freq <= 24250) { return "1.25cm"; }
    if (47000 <= freq && freq <= 47200) { return "6mm"; }
    if (75500 <= freq && freq <= 81000) { return "4mm"; }
    if (119980 <= freq && freq <= 120020) { return "2.5mm"; }
    if (142000 <= freq && freq <= 149000) { return "2mm"; }
    if (241000 <= freq && freq <= 250000) { return "1mm"; }
    return null;
}

export function parseMode(line) {
    let moodi = null;
    modelist.forEach(it => {
        let regg = RegExp(` ${it}\\s*[0-9]*`, "gim");
        if (regg.test(line)) {
            moodi = it.toUpperCase();
        }
    });
    return moodi;
}

function handleBand(line) {
    let bandi = line.match(regexBand);
    if (bandi != null) {
        BAND = bandi[0];
    }
}

/**
 * Parse time with no connection to a spqcific qso (on a separate line).
 */
function handleTime(line) {

    if (! (new RegExp('^ *[0-9]+ *$', 'gim')).test(line)) {
        return;
    }

    let timedata = null; // line.match(new RegExp(/(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))/, "m"));

    let td1 = line.match(/^(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))$/m);
    let td2 = line.match(/^(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))\s/m);
    let td3 = line.match(/\s(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))$/m);
    let td4 = line.match(/\s(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))\s/m);

    if (td1 !== null) { timedata = td1[0].trim(); }
    if (td2 !== null) { timedata = td2[0].trim(); }
    if (td3 !== null) { timedata = td3[0].trim(); }
    if (td4 !== null) { timedata = td4[0].trim(); }

    if (timedata !== null) {
        if (timedata.length === 1) {
            MINUTE = MINUTE.substring(0,1) + timedata;
            FREQ_SET_ON_CURRENT_ROW = true;
        } else if (timedata.length === 2) {
            MINUTE = timedata;
            FREQ_SET_ON_CURRENT_ROW = true;
        } else if (timedata.length === 4) {
            HOUR = timedata.substring(0,2);
            MINUTE = timedata.substring(2,4);
            FREQ_SET_ON_CURRENT_ROW = true;
        } else {
            console.log("Error: Can't parse time from " + timedata[1]);
        }
    }
}

export function parseTime(line) {

    let QHOUR = null;
    let QMINUTE = null;

    let timedata = null;

    let trimmedline = line.split(callRegex)[0].trim();

    //           hhmm                 mm           m
    let rx = /\b([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9])\b/im;
    let result = rx.exec(line);
    if (result == null) {
        return null;
    }
    timedata = result[0];

    // ^time$
    let td1 = trimmedline.match(/^(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))$/m);
    // ^time
    let td2 = trimmedline.match(/^(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))\s/m);
    // time$
    let td3 = trimmedline.match(/\s(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))$/m);
    // time
    let td4 = trimmedline.match(/\s(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))\s/m);
    if (td1 !== null) { timedata = td1[0].trim(); }
    else if (td2 !== null) { timedata = td2[0].trim(); }
    else if (td3 !== null) { timedata = td3[0].trim(); }
    else if (td4 !== null) { timedata = td4[0].trim(); }
    else { timedata = null;}

    if (timedata !== null) {

        // Single digit --> update minute
        if (timedata.length === 1) {
            QHOUR = HOUR;
            QMINUTE = MINUTE.substring(0,1) + timedata;
            MINUTE = QMINUTE;
        }
        // Two-digits --> update minute
        else if (timedata.length === 2) {
            QHOUR = HOUR;
            QMINUTE = timedata;
            MINUTE = QMINUTE;
        }
        // Four digits --> update hour and minute
        else if (timedata.length === 4) {
            QHOUR = timedata.substring(0,2);
            QMINUTE = timedata.substring(2,4);
            HOUR = QHOUR;
            MINUTE = QMINUTE;
        }
        else {
            console.log("Error: Can't parse time from " + timedata[1]);
        }

        return [QHOUR, QMINUTE];
    }
    return null;
}

const resetData = () => {
    NUMBER = 0;
    MYCALL = null;
    MYGRID = null;
    DATE = null;
    TIME = null;
    CALL = null;
    BAND = null;
    MODE = null;
    FREQ = null;
    MYWWFF = null;
    MYSOTA = null;
    MYPOTA = null;
    OPERATOR = null;
    NICK = null;
    GLOBALQSLMSG = null;
    STX = null;
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

export function parseCall(qsoline) {

    let calls = callRegex.exec(qsoline);
    if (calls != null) {
        let callsign = calls[0].toUpperCase();

        for (let i = 0; i < modelist.length ; i++) {
            if (modelist[i].toUpperCase() === callsign) {
                return null;
            }
        }
        return callsign;
    }
    return null;
}

const addQso = (qsoline) => {

    // Default to 59/59

    let RSTS: string;
    let RSTR: string;
    if (wsjtmodes.includes(MODE)) {
        RSTS = "-10";
        RSTR = "-10";
    } else {
        RSTS = "59";
        RSTR = "59";
    }

    let rsts = null;
    if (!wsjtmodes.includes(MODE)) {
        rsts = qsoline.match(/(?<=[a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{0,3}[a-zA-Z](\/(P|M|MM|AM))?.* +)[1-9]{1,3}\b([1-9]{1,3})?/gim);
    } else {
        rsts = qsoline.match(/(?<=[a-zA-Z0-9]{1,3}[0-9][a-zA-Z0-9]{0,3}[a-zA-Z](\/(P|M|MM|AM))?.* +)\-[0-9]+\b(\-[0-9]+)?/gim);
    }


    if (rsts != null) {
        let rands = rsts;


        // Only RST sent given
        if (rands.length === 1) {
            if (rands[0].length === 1) {
                RSTS = setCharAt(RSTS, 1, rands[0]);
            } else {
                RSTS = rands[0];
            }
        }
        // RST sent and received given
        else if (rands.length === 2) {
            if (rands[0].length === 1) {
                RSTS = setCharAt(RSTS, 1, rands[0]);
            } else {
                RSTS = rands[0];
            }

            if (rands[1].length === 1) {
                RSTR = setCharAt(RSTR, 1, rands[1]);
            } else {
                RSTR = rands[1];
            }
        }
    }
    if (MODE === "CW") {
        while (RSTR.length < 3) {
            RSTR += "9";
        }
        while (RSTS.length < 3) {
            RSTS += "9";
        }
    }

    let CALL = parseCall(qsoline);
    if (CALL !== null) {
        NUMBER++;
    } else {
        return null;
    }

    let NAME = parseName(qsoline);
    let GRID = parseGrid(qsoline);
    let QSLMSG = parseQsoQslMsg(qsoline);

    if (GLOBALQSLMSG !== null && QSLMSG === null) {
        QSLMSG = GLOBALQSLMSG;
    }

    let COMMENT = parseQsoComment(qsoline);
    let WWFF = parseWwffref(qsoline);
    let THEIRSOTA = parseSotaref(qsoline);
    let THEIRPOTA = parsePotaref(qsoline);
    let qsotime = parseTime(qsoline);
    //parseTime(qsoline);


    let QHH = null;
    let QMM = null;
    if (qsotime !== null && qsotime[0] !== null) {
         QHH = qsotime[0];
    }
    if (qsotime !== null && qsotime[1] !== null) {
         QMM = qsotime[1];
    }

    if (FREQ_SET_ON_CURRENT_ROW == true && QHH == null && QMM == null) {
        QHH = HOUR;
        QMM = MINUTE;
        FREQ_SET_ON_CURRENT_ROW = false;
    }

    //let endD = new Date(DATE + "T" + HOUR + ":" + MINUTE + ":00Z");

    let qSTX = parseSTX(qsoline);
    let qSRX = parseSRX(qsoline);
    if (qSTX !== null) {
        STX = qSTX;
    } else {
        if (STX !== null) {
            STX++;
        }
    }

    let uu = {
        "station_callsign": MYCALL,
        "call": CALL,
        //"date": DATE,
        "start": null as Date, //startD.toISOString(),
        //"end": endD.toISOString(),
        "band": BAND,
        "mode": MODE !== null ? MODE.toUpperCase() : null,
        freq: undefined as String,
        qsotimeknown: undefined as boolean,
        rst_sent: undefined as String,
        stx: null as String,
        rst_rcvd: undefined as String,
        srx: undefined as String,
        gridsquare: undefined as String,
        comment: undefined as String,
        name: undefined as String,
        qslmsg: undefined as String,
        my_sig: undefined as String,
        my_sig_info: undefined as String,
        sig: undefined as String,
        sig_info: undefined as String,
        my_sota_ref: undefined,
        sota_ref: undefined as String,
        operator: undefined as String,
        app_eqsl_qth_nickname: undefined as String,
        my_gridsquare: undefined as String
    };

    if (FREQ != null) {
        uu.freq = FREQ;
    }




    if (QHH !== null && QMM !== null) {
        uu.start = (new Date(DATE + "T" + QHH + ":" + QMM + ":00Z"));
        uu.qsotimeknown = true;
    } else {
        uu.start = null;
        uu.qsotimeknown = false;
    }

    uu.rst_sent = RSTS;

    if (STX !== null) {
        uu.stx = STX.toString().padStart(3, '0');

    }

    uu.rst_rcvd = RSTR;

    if (qSRX !== null) {
        uu.srx = qSRX.toString().padStart(3, '0');
    }

    if (GRID != null) {
        uu.gridsquare = GRID.toUpperCase();
    }

    if (COMMENT != null) {
        uu.comment = COMMENT;
    }

    if (NAME != null) {
        uu.name = NAME;
    }

    if (QSLMSG != null) {
        uu.qslmsg = QSLMSG;
    }

    // Set MY_SIG only if own WWFF or POTA reference is set
    if (MYWWFF != null) {
        uu.my_sig = MY_SIG_WWFF;
        uu.my_sig_info = MYWWFF;
    }
    if (MYPOTA != null) {
        uu.my_sig = "POTA";
        uu.my_sig_info = MYPOTA;
    }

    if (WWFF != null) {
        uu.sig = "WWFF";
        uu.sig_info = WWFF;
    }

    if (MYSOTA != null) {
        uu.my_sota_ref = MYSOTA;
    }

    if (MYPOTA != null) {
        uu.sig = "POTA"
        uu.sig_info = THEIRPOTA;
    }

    if (THEIRSOTA != null) {
        uu.sota_ref = THEIRSOTA;
    }

    if (OPERATOR != null) {
        uu.operator = OPERATOR;
    }

    if (NICK !== null) {
        uu.app_eqsl_qth_nickname = NICK;
    }

    if (MYGRID != null) {
        uu.my_gridsquare = MYGRID;
    }

    if (MYGRID != null && MYSOTA == null) {
        uu.my_gridsquare = MYGRID;
    }



    return uu;
}

/**
 * Set QSO date/time information based on available data
 * 1) Interpolate between known time points
 * 2) Copy time from previous if newer times are not known
 *
 * @param qsos Array of QSOs as JSON
 * @return Array os QSOs with interpolated time data
 */
function interpolateTimes(qsos) {

    let interpolateStart = null;

    for (let i = 0; i < qsos.length; i++) {
        let qsox = qsos[i];
        if (qsox.start != null) {
            interpolateStart = qsox.start;
        }
        // First QSO with no time specified
        if (qsox.start == null) {
            // Go through the rest of the QSO list until a timestamp is found
            for (let j = i+1; j < qsos.length; j++) {
                let qsoy = qsos[j];


                if (qsoy.start != null && interpolateStart != null) {
                    let interpolateTo = qsoy.start;

                    for (let k=i; k<=j-1; k++) {
                        let stepno = k-i+1;
                        let rangelen = j-i;
                        let factorA = (stepno)/(rangelen+1);
                        let factorB = 1 - factorA;
                        let interpTime = new Date(Math.round(factorB * interpolateStart.getTime()) + Math.round(factorA * interpolateTo.getTime()));
                        qsos[k].start = new Date(interpTime);
                    }
                    i = 0;
                    j = qsos.length;
                }
            }
        }
    }

    // Last QSO and no time set: copy the last timestamp to all remaining QSOs
    for (let li = qsos.length-1; li >=0; li--) {
        if (qsos[li].start != null) {
            for (let g = li; g < qsos.length; g++) {
                qsos[g].start = qsos[li].start;
            }
            break;
        }

    }
    return qsos;
}

function fillTimes(qsos) {

    let lastKnownTime = null;

    for (let i = 0; i < qsos.length; i++) {
        if (qsos[i].start !== null) {
            lastKnownTime = qsos[i].start;
        }
        if (qsos[i].start === null && lastKnownTime !== null) {
            qsos[i].start = lastKnownTime;
        }


    }



    return qsos;
}

/**
 * Insert serial number (beginning with 001) to all QSOs.
 *
 * @param qsos List of QSOs.
 */
function fixSerials(qsos) {
    let serial = 1;
    for (let i = 0; i < qsos.length; i++) {
        if (qsos[i].stx === null) {
            for (const [key, value] of Object.entries(qsos[i])) {
                if (key == "rst_sent") {
                    qsos[i].stx = serial.toString().padStart(3, '0');
                    serial++;
                }
            }
        }
    }
    return qsos;
}

export function makeJsonArray(notestuff, interpolate = true, consecutiveserials = false) {

    resetData();
    let jsonarray = [];
    let notesWithoutComments = notestuff.replaceAll("\{.*\}", "");
    let lines = notesWithoutComments.split("\n");

    HOUR = "00";
    MINUTE = "00";
    STX = null;

    for (let i = 0; i < lines.length; i++) {

        let FREQ_SET_ON_THIS_LINE = false;

        let line = lines[i];

        if (line.match(/mycall /)) {
            MYCALL = parseCall(line);
            continue;
        }

        if (line.match(/mygrid /)) {
            MYGRID = parseGrid(line);
            if (MYGRID != null) {
                MYGRID = MYGRID.substring(0, 2).toUpperCase() + MYGRID.substring(2, MYGRID.length);
            }
            continue;
        }

        if (line.match(/operator /)) {
            OPERATOR = parseOperator(line);
            continue;
        }

        if (line.match(/nickname /)) {
            NICK = parseNick(line);
        }

        if (line.match(/qslmsg /)) {
            GLOBALQSLMSG = parseGlobalQslMsg(line);
        }

        if (line.match(/date [0-9]{4}/)) {
            handleDate(line);
            continue;
        }

        if (line.match(/day \+\+/)) {
            handleDateIncrement(line);
        }

        if (line.match(/[0-9]+\.[0-9]*/)) {
            let res = line.match(/[0-9]*\.[0-9]+/im);
            if (res != null) {
                FREQ = res[0];
                FREQ_SET_ON_THIS_LINE = true;
            }
        }

        if (line.match(/mywwff/)) {
            MYWWFF = handleMywwff(line);
        }

        if (line.match(/mysota/)) {
            MYSOTA = parseSotaref(line);
        }

        if (line.match(/mypota/)) {
            MYPOTA = parsePotaref(line);
        }

        let mode = parseMode(line);
        if (mode != null) {
            MODE = mode;
            if (!FREQ_SET_ON_THIS_LINE) {
                FREQ = null;
            }
        }

        if (line.match(regexBand)) {
            handleBand(line);
        }

        if (BAND === null && FREQ !== null) {
            BAND = detectband(FREQ);
        }
        // hhmm mm or m

        //if(/(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))/mig.test(line)) {

        if(
            /^(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))$/mi.test(line)
            ||
            /^(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))\s/mi.test(line)
            ||
            /\s(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))$/mi.test(line)
            ||
            /\s(([0-2][0-9][0-5][0-9])|([0-5][0-9])|([0-9]))\s/mi.test(line)
        )
        {
            handleTime(line);
        }

        let qsoline = addQso(line);
        if (qsoline != null) {
            jsonarray.push(qsoline);
        }
    }

    let interpolated = interpolate ? interpolateTimes(jsonarray) : fillTimes(jsonarray);
    return consecutiveserials ? fixSerials(interpolated) : interpolated;
}

const handleMywwff = (line) => {
    let rx = /mywwff ([a-z]{1,2}ff-[0-9]{4})/gi;
    let mywwff = rx.exec(line);
    if (mywwff != null) {
        return mywwff[1].toUpperCase();
    }
    return null;
}

export function previewAdif() {
    let newWindow = window.open("", "newWindow", "width=800, height=600");
    const notesElem = document.getElementById('notes') as HTMLInputElement | null
    let notes = notesElem?.value;
    let jnootit = makeJsonArray(notes);
    newWindow.document.write('<div class="adif-preview">');
    newWindow.document.write(printAdif(jnootit, false));
    newWindow.document.write('</div>');
    newWindow.document.write('<script src="main.js"></script>');
}

export function notesReset() {
    if (confirm("Clear notes and lose all input data?") === true) {
        let notet = document.getElementById("notes").innerHTML = "foo";
        $("#notes").val("");
        $(".hwt-content").empty();
        //updateQsoList();
    }
}
