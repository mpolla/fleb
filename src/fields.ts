const NumberField = {
    decode: function (value) {
        return parseFloat(value);
    },
    encode: function (value) {
        return value ? value.toString() : "0";
    }
};

const BooleanField = {
    decode: function (value) {
        return value == "Y" || value == "y";
    },
    encode: function (value) {
        return value ? "Y" : "N";
    }
};

const EnumField = {
    decode: function (value) {
        return value;
    },
    encode: function (value) {
        return value;
    }
};

const StringField = {
    decode: function (value) {
        return value;
    },
    encode: function (value) {
        return value !== undefined ? value.toString() : null;
    }
};

const MultilineField = StringField;

module.exports = {
    "adif_ver": StringField,
    "programid": StringField,
    "programversion": StringField,
    "app_cloudshack_id": StringField,
    "app_cloudshack_rev": StringField,
    "address": MultilineField,
    "age": NumberField,
    "a_index": NumberField,
    "ant_az": NumberField,
    "ant_el": NumberField,
    "ant_path": EnumField,
    "arrl_sect": EnumField,
    "band": StringField,
    "band_rx": EnumField,
    "call": StringField,
    "check": StringField,
    "class": StringField,
    "clublog_qso_upload_status": EnumField,
    "cnty": EnumField,
    "comment": StringField,
    "cont": EnumField,
    "contacted_op": StringField,
    "contest_id": EnumField,
    "country": StringField,
    "cqz": NumberField,
    "distance": NumberField,
    "dxcc": NumberField,
    "email": StringField,
    "eq_call": StringField,
    "eqsl_qsl_rcvd": EnumField,
    "eqsl_qsl_sent": EnumField,
    "freq": NumberField,
    "freq_rx": NumberField,
    "gridsquare": EnumField,
    "guest_op": StringField,
    "iota": EnumField,
    "iota_island_id": StringField,
    "ituz": NumberField,
    "k_index": NumberField,
    "lat": StringField,
    "lon": StringField,
    "lotw_qsl_rcvd": EnumField,
    "lotw_qsl_sent": EnumField,
    "max_bursts": NumberField,
    "mode": EnumField,
    "my_city": StringField,
    "my_cnty": StringField,
    "my_country": StringField,
    "my_cq_zone": NumberField,
    "my_dxcc": NumberField,
    "my_gridsquare": EnumField,
    "my_iota": EnumField,
    "my_iota_island_id": StringField,
    "my_itu_zone": NumberField,
    "my_lat": StringField,
    "my_lon": StringField,
    "my_name": StringField,
    "my_postal_code": StringField,
    "my_rig": StringField,
    "my_sota_ref": EnumField,
    "my_pota_ref": EnumField,
    "my_state": EnumField,
    "my_street": StringField,
    "name": StringField,
    "notes": MultilineField,
    "nr_bursts": NumberField,
    "nr_pings": NumberField,
    "operator": StringField,
    "owner_callsign": StringField,
    "pfx": StringField,
    "precedence": StringField,
    "prop_mode": EnumField,
    "public_key": StringField,
    "qslmsg": MultilineField,
    "qsl_rcvd": EnumField,
    "qsl_rcvd_via": EnumField,
    "qsl_sent": EnumField,
    "qsl_sent_via": EnumField,
    "qso_complete": EnumField,
    "qso_date": StringField,
    "qso_date_off": StringField,
    "qso_random": BooleanField,
    "qsl_via": EnumField,
    "qth": StringField,
    "rig": StringField,
    "rst_rcvd": StringField,
    "rst_sent": StringField,
    "rx_pwr": NumberField,
    "sat_mode": StringField,
    "sat_name": StringField,
    "sfi": NumberField,
    "srx": NumberField,
    "srx_string": StringField,
    "state": EnumField,
    "station_callsign": StringField,
    "stx": StringField,
    "stx_string": StringField,
    "submode": EnumField,
    "swl": BooleanField,
    "time_on": StringField,
    "time_off": StringField,
    "tx_pwr": NumberField,
    "web": StringField,

    // WWFF fields
    "sig": StringField,
    "sig_info": StringField,
    "my_sig": StringField,
    "my_sig_info": StringField,
    "sota_ref": StringField,

    "app_eqsl_qth_nickname": StringField
};
