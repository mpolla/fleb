import { findDxcc } from "@ham-core/fast-dxcc";

const PLACEHOLDER = "&nbsp;&nbsp;&nbsp;";

// DXCC entity number → flag emoji.
//
// Policy: each entity gets the flag of its ARRL-defined administering authority
// or self-designated flag. UK home nations (England #223, Scotland #279, Wales
// #294) use Unicode regional-indicator subdivision tag sequences. Northern
// Ireland (#265) has no widely-rendered subdivision flag and falls back to 🇬🇧.
// Entities omitted from this map (ITU HQ #117, UN HQ #289, Sovereign Military
// Order of Malta #246, Spratly Islands #247, Scarborough Reef #506) have no
// obvious flag and fall through to PLACEHOLDER.
export const dxccFlags: Record<number, string> = {
    1: "🇨🇦",          // Canada
    3: "🇦🇫",          // Afghanistan
    4: "🇲🇺",          // Agalega & St. Brandon
    5: "🇦🇽",          // Aland Islands
    6: "🇺🇸",          // Alaska
    7: "🇦🇱",          // Albania
    9: "🇦🇸",          // American Samoa
    10: "🇹🇫",         // Amsterdam & St. Paul Is.
    11: "🇮🇳",         // Andaman & Nicobar Is.
    12: "🇦🇮",         // Anguilla
    13: "🇦🇶",         // Antarctica
    14: "🇦🇲",         // Armenia
    15: "🇷🇺",         // Asiatic Russia
    16: "🇳🇿",         // N.Z. Subantarctic Is.
    17: "🇻🇪",         // Aves Island
    18: "🇦🇿",         // Azerbaijan
    20: "🇺🇸",         // Baker & Howland Islands
    21: "🇪🇸",         // Balearic Islands
    22: "🇵🇼",         // Palau
    24: "🇧🇻",         // Bouvet
    27: "🇧🇾",         // Belarus
    29: "🇮🇨",         // Canary Islands
    31: "🇰🇮",         // Central Kiribati
    32: "🇪🇦",         // Ceuta & Melilla
    33: "🇮🇴",         // Chagos Islands
    34: "🇳🇿",         // Chatham Islands
    35: "🇨🇽",         // Christmas Island
    36: "🇫🇷",         // Clipperton Island
    37: "🇨🇷",         // Cocos Island
    38: "🇨🇨",         // Cocos (Keeling) Islands
    40: "🇬🇷",         // Crete
    41: "🇹🇫",         // Crozet Island
    43: "🇺🇸",         // Desecheo Island
    45: "🇬🇷",         // Dodecanese
    46: "🇲🇾",         // East Malaysia
    47: "🇨🇱",         // Easter Island
    48: "🇰🇮",         // Eastern Kiribati
    49: "🇬🇶",         // Equatorial Guinea
    50: "🇲🇽",         // Mexico
    51: "🇪🇷",         // Eritrea
    52: "🇪🇪",         // Estonia
    53: "🇪🇹",         // Ethiopia
    54: "🇷🇺",         // European Russia
    56: "🇧🇷",         // Fernando de Noronha
    60: "🇧🇸",         // Bahamas
    61: "🇷🇺",         // Franz Josef Land
    62: "🇧🇧",         // Barbados
    63: "🇬🇫",         // French Guiana
    64: "🇧🇲",         // Bermuda
    65: "🇻🇬",         // British Virgin Islands
    66: "🇧🇿",         // Belize
    69: "🇰🇾",         // Cayman Islands
    70: "🇨🇺",         // Cuba
    71: "🇪🇨",         // Galapagos Islands
    72: "🇩🇴",         // Dominican Republic
    74: "🇸🇻",         // El Salvador
    75: "🇬🇪",         // Georgia
    76: "🇬🇹",         // Guatemala
    77: "🇬🇩",         // Grenada
    78: "🇭🇹",         // Haiti
    79: "🇬🇵",         // Guadeloupe
    80: "🇭🇳",         // Honduras
    82: "🇯🇲",         // Jamaica
    84: "🇲🇶",         // Martinique
    86: "🇳🇮",         // Nicaragua
    88: "🇵🇦",         // Panama
    89: "🇹🇨",         // Turks & Caicos Islands
    90: "🇹🇹",         // Trinidad & Tobago
    91: "🇦🇼",         // Aruba
    94: "🇦🇬",         // Antigua & Barbuda
    95: "🇩🇲",         // Dominica
    96: "🇲🇸",         // Montserrat
    97: "🇱🇨",         // St. Lucia
    98: "🇻🇨",         // St. Vincent
    99: "🇹🇫",         // Glorioso Islands
    100: "🇦🇷",        // Argentina
    103: "🇬🇺",        // Guam
    104: "🇧🇴",        // Bolivia
    105: "🇺🇸",        // Guantanamo Bay
    106: "🇬🇬",        // Guernsey
    107: "🇬🇳",        // Guinea
    108: "🇧🇷",        // Brazil
    109: "🇬🇼",        // Guinea-Bissau
    110: "🇺🇸",        // Hawaii
    111: "🇭🇲",        // Heard Island
    112: "🇨🇱",        // Chile
    114: "🇮🇲",        // Isle of Man
    116: "🇨🇴",        // Colombia
    // 117 ITU HQ — omitted
    118: "🇸🇯",        // Jan Mayen
    120: "🇪🇨",        // Ecuador
    122: "🇯🇪",        // Jersey
    123: "🇺🇸",        // Johnston Island
    124: "🇹🇫",        // Juan de Nova & Europa
    125: "🇨🇱",        // Juan Fernandez Islands
    126: "🇷🇺",        // Kaliningrad
    129: "🇬🇾",        // Guyana
    130: "🇰🇿",        // Kazakhstan
    131: "🇹🇫",        // Kerguelen Islands
    132: "🇵🇾",        // Paraguay
    133: "🇳🇿",        // Kermadec Islands
    135: "🇰🇬",        // Kyrgyzstan
    136: "🇵🇪",        // Peru
    137: "🇰🇷",        // Republic of Korea
    138: "🇺🇸",        // Kure Island
    140: "🇸🇷",        // Suriname
    141: "🇫🇰",        // Falkland Islands
    142: "🇮🇳",        // Lakshadweep Islands
    143: "🇱🇦",        // Laos
    144: "🇺🇾",        // Uruguay
    145: "🇱🇻",        // Latvia
    146: "🇱🇹",        // Lithuania
    147: "🇦🇺",        // Lord Howe Island
    148: "🇻🇪",        // Venezuela
    149: "🇵🇹",        // Azores
    150: "🇦🇺",        // Australia
    152: "🇲🇴",        // Macao
    153: "🇦🇺",        // Macquarie Island
    157: "🇳🇷",        // Nauru
    158: "🇻🇺",        // Vanuatu
    159: "🇲🇻",        // Maldives
    160: "🇹🇴",        // Tonga
    161: "🇨🇴",        // Malpelo Island
    162: "🇳🇨",        // New Caledonia
    163: "🇵🇬",        // Papua New Guinea
    165: "🇲🇺",        // Mauritius
    166: "🇲🇵",        // Mariana Islands
    167: "🇫🇮",        // Market Reef
    168: "🇲🇭",        // Marshall Islands
    169: "🇾🇹",        // Mayotte
    170: "🇳🇿",        // New Zealand
    171: "🇦🇺",        // Mellish Reef
    172: "🇵🇳",        // Pitcairn Island
    173: "🇫🇲",        // Micronesia
    174: "🇺🇸",        // Midway Island
    175: "🇵🇫",        // French Polynesia
    176: "🇫🇯",        // Fiji
    177: "🇯🇵",        // Minami Torishima
    179: "🇲🇩",        // Moldova
    180: "🇬🇷",        // Mount Athos
    181: "🇲🇿",        // Mozambique
    182: "🇺🇸",        // Navassa Island
    185: "🇸🇧",        // Solomon Islands
    187: "🇳🇪",        // Niger
    188: "🇳🇺",        // Niue
    189: "🇳🇫",        // Norfolk Island
    190: "🇼🇸",        // Samoa
    191: "🇨🇰",        // North Cook Islands
    192: "🇯🇵",        // Ogasawara
    195: "🇬🇶",        // Annobon Island
    197: "🇺🇸",        // Palmyra & Jarvis Islands
    199: "🇳🇴",        // Peter 1 Island
    201: "🇿🇦",        // Pr. Edward & Marion Is.
    202: "🇵🇷",        // Puerto Rico
    203: "🇦🇩",        // Andorra
    204: "🇲🇽",        // Revillagigedo
    205: "🇸🇭",        // Ascension Island
    206: "🇦🇹",        // Austria (and Vienna Intl Ctr)
    207: "🇲🇺",        // Rodriguez Island
    209: "🇧🇪",        // Belgium
    211: "🇨🇦",        // Sable Island
    212: "🇧🇬",        // Bulgaria
    213: "🇲🇫",        // St. Martin
    214: "🇫🇷",        // Corsica
    215: "🇨🇾",        // Cyprus
    216: "🇨🇴",        // San Andres & Providencia
    217: "🇨🇱",        // San Felix & San Ambrosio
    219: "🇸🇹",        // Sao Tome & Principe
    221: "🇩🇰",        // Denmark
    222: "🇫🇴",        // Faroe Islands
    223: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",  // England
    224: "🇫🇮",        // Finland
    225: "🇮🇹",        // Sardinia
    227: "🇫🇷",        // France
    230: "🇩🇪",        // Fed. Rep. of Germany
    232: "🇸🇴",        // Somalia
    233: "🇬🇮",        // Gibraltar
    234: "🇨🇰",        // South Cook Islands
    235: "🇬🇸",        // South Georgia Island
    236: "🇬🇷",        // Greece
    237: "🇬🇱",        // Greenland
    238: "🇬🇸",        // South Orkney Islands
    239: "🇭🇺",        // Hungary
    240: "🇬🇸",        // South Sandwich Islands
    241: "🇬🇸",        // South Shetland Islands
    242: "🇮🇸",        // Iceland
    245: "🇮🇪",        // Ireland
    // 246 Sov Mil Order of Malta — omitted
    // 247 Spratly Islands — omitted (disputed)
    248: "🇮🇹",        // Italy (also African Italy, Sicily)
    249: "🇰🇳",        // St. Kitts & Nevis
    250: "🇸🇭",        // St. Helena
    251: "🇱🇮",        // Liechtenstein
    252: "🇨🇦",        // St. Paul Island
    253: "🇧🇷",        // St. Peter & St. Paul
    254: "🇱🇺",        // Luxembourg
    256: "🇵🇹",        // Madeira Islands
    257: "🇲🇹",        // Malta
    259: "🇸🇯",        // Svalbard (and Bear Island)
    260: "🇲🇨",        // Monaco
    262: "🇹🇯",        // Tajikistan
    263: "🇳🇱",        // Netherlands
    265: "🇬🇧",        // Northern Ireland
    266: "🇳🇴",        // Norway
    269: "🇵🇱",        // Poland
    270: "🇹🇰",        // Tokelau Islands
    272: "🇵🇹",        // Portugal
    273: "🇧🇷",        // Trindade & Martim Vaz
    274: "🇸🇭",        // Tristan da Cunha & Gough Is.
    275: "🇷🇴",        // Romania
    276: "🇹🇫",        // Tromelin Island
    277: "🇵🇲",        // St. Pierre & Miquelon
    278: "🇸🇲",        // San Marino
    279: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",  // Scotland (and Shetland)
    280: "🇹🇲",        // Turkmenistan
    281: "🇪🇸",        // Spain
    282: "🇹🇻",        // Tuvalu
    283: "🇬🇧",        // UK Base Areas on Cyprus
    284: "🇸🇪",        // Sweden
    285: "🇻🇮",        // US Virgin Islands
    286: "🇺🇬",        // Uganda
    287: "🇨🇭",        // Switzerland
    288: "🇺🇦",        // Ukraine
    // 289 United Nations HQ — omitted
    291: "🇺🇸",        // United States
    292: "🇺🇿",        // Uzbekistan
    293: "🇻🇳",        // Vietnam
    294: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",  // Wales
    295: "🇻🇦",        // Vatican City
    296: "🇷🇸",        // Serbia
    297: "🇺🇸",        // Wake Island
    298: "🇼🇫",        // Wallis & Futuna Islands
    299: "🇲🇾",        // West Malaysia
    301: "🇰🇮",        // Western Kiribati
    302: "🇪🇭",        // Western Sahara
    303: "🇦🇺",        // Willis Island
    304: "🇧🇭",        // Bahrain
    305: "🇧🇩",        // Bangladesh
    306: "🇧🇹",        // Bhutan
    308: "🇨🇷",        // Costa Rica
    309: "🇲🇲",        // Myanmar
    312: "🇰🇭",        // Cambodia
    315: "🇱🇰",        // Sri Lanka
    318: "🇨🇳",        // China
    321: "🇭🇰",        // Hong Kong
    324: "🇮🇳",        // India
    327: "🇮🇩",        // Indonesia
    330: "🇮🇷",        // Iran
    333: "🇮🇶",        // Iraq
    336: "🇮🇱",        // Israel
    339: "🇯🇵",        // Japan
    342: "🇯🇴",        // Jordan
    344: "🇰🇵",        // DPR of Korea
    345: "🇧🇳",        // Brunei Darussalam
    348: "🇰🇼",        // Kuwait
    354: "🇱🇧",        // Lebanon
    363: "🇲🇳",        // Mongolia
    369: "🇳🇵",        // Nepal
    370: "🇴🇲",        // Oman
    372: "🇵🇰",        // Pakistan
    375: "🇵🇭",        // Philippines
    376: "🇶🇦",        // Qatar
    378: "🇸🇦",        // Saudi Arabia
    379: "🇸🇨",        // Seychelles
    381: "🇸🇬",        // Singapore
    382: "🇩🇯",        // Djibouti
    384: "🇸🇾",        // Syria
    386: "🇹🇼",        // Taiwan
    387: "🇹🇭",        // Thailand
    390: "🇹🇷",        // Turkey (Asiatic + European)
    391: "🇦🇪",        // United Arab Emirates
    400: "🇩🇿",        // Algeria
    401: "🇦🇴",        // Angola
    402: "🇧🇼",        // Botswana
    404: "🇧🇮",        // Burundi
    406: "🇨🇲",        // Cameroon
    408: "🇨🇫",        // Central African Republic
    409: "🇨🇻",        // Cape Verde
    410: "🇹🇩",        // Chad
    411: "🇰🇲",        // Comoros
    412: "🇨🇬",        // Republic of the Congo
    414: "🇨🇩",        // Dem. Rep. of the Congo
    416: "🇧🇯",        // Benin
    420: "🇬🇦",        // Gabon
    422: "🇬🇲",        // The Gambia
    424: "🇬🇭",        // Ghana
    428: "🇨🇮",        // Cote d'Ivoire
    430: "🇰🇪",        // Kenya
    432: "🇱🇸",        // Lesotho
    434: "🇱🇷",        // Liberia
    436: "🇱🇾",        // Libya
    438: "🇲🇬",        // Madagascar
    440: "🇲🇼",        // Malawi
    442: "🇲🇱",        // Mali
    444: "🇲🇷",        // Mauritania
    446: "🇲🇦",        // Morocco
    450: "🇳🇬",        // Nigeria
    452: "🇿🇼",        // Zimbabwe
    453: "🇷🇪",        // Reunion Island
    454: "🇷🇼",        // Rwanda
    456: "🇸🇳",        // Senegal
    458: "🇸🇱",        // Sierra Leone
    460: "🇫🇯",        // Rotuma Island
    462: "🇿🇦",        // South Africa
    464: "🇳🇦",        // Namibia
    466: "🇸🇩",        // Sudan
    468: "🇸🇿",        // Kingdom of Eswatini
    470: "🇹🇿",        // Tanzania
    474: "🇹🇳",        // Tunisia
    478: "🇪🇬",        // Egypt
    480: "🇧🇫",        // Burkina Faso
    482: "🇿🇲",        // Zambia
    483: "🇹🇬",        // Togo
    489: "🇫🇯",        // Conway Reef
    490: "🇰🇮",        // Banaba Island
    492: "🇾🇪",        // Yemen
    497: "🇭🇷",        // Croatia
    499: "🇸🇮",        // Slovenia
    501: "🇧🇦",        // Bosnia-Herzegovina
    502: "🇲🇰",        // North Macedonia
    503: "🇨🇿",        // Czech Republic
    504: "🇸🇰",        // Slovak Republic
    505: "🇹🇼",        // Pratas Island
    // 506 Scarborough Reef — omitted (disputed)
    507: "🇸🇧",        // Temotu Province
    508: "🇵🇫",        // Austral Islands
    509: "🇵🇫",        // Marquesas Islands
    510: "🇵🇸",        // Palestine
    511: "🇹🇱",        // Timor-Leste
    512: "🇳🇨",        // Chesterfield Islands
    513: "🇵🇳",        // Ducie Island
    514: "🇲🇪",        // Montenegro
    515: "🇦🇸",        // Swains Island
    516: "🇧🇱",        // St. Barthelemy
    517: "🇨🇼",        // Curacao
    518: "🇸🇽",        // Sint Maarten
    519: "🇧🇶",        // Saba & St. Eustatius
    520: "🇧🇶",        // Bonaire
    521: "🇸🇸",        // Republic of South Sudan
    522: "🇽🇰",        // Republic of Kosovo
};

export function flagIcon(call: string): string {
    if (!call) return PLACEHOLDER;
    const result = findDxcc(call);
    const dxcc = result?.entity?.dxcc;
    if (dxcc == null) return PLACEHOLDER;
    return dxccFlags[dxcc] ?? PLACEHOLDER;
}
