const os = require('os');
const { DateTime } = require('luxon');
const logger = require('log4js').getLogger();
logger.level = 'info';

class FIX_fragment {
	constructor(string) {
		if (string === undefined) {
			this.rec_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
			this.rec_trad_system = 'DEFAULT';
			this.BeginString = 4.2;
			this.BodyLength = 1;
			this.MsgType = 35;
			this.Checksum = 10;
			this.ListAttributes = {};
			this.listCompulKey = ['8', '9', '35', '10'];
		} else {
			this.listCompulKey = ['8', '9', '35', '10'];
			this.fix_message = string;
			const fix_attr = this.fix_message.split('|');
			const key_val_temp_stor = {};
			for (let i = 0; i < fix_attr.length - 1; i++) {
				const [key, val] = fix_attr[i].split('=');
				key_val_temp_stor[key] = val;
			}
			for (const mand_att of this.listCompulKey) {
				if (!(mand_att in key_val_temp_stor)) {
					throw new Error(`A mandatory key (${mand_att}) for FIX fragment ${string} is missing`);
				}
			}
			this.BeginString = key_val_temp_stor['8'].split('FIX.')[1];
			this.BodyLength = key_val_temp_stor['9'];
			this.MsgType = key_val_temp_stor['35'];
			this.Checksum = key_val_temp_stor['10'];
			delete key_val_temp_stor['8'];
			delete key_val_temp_stor['9'];
			delete key_val_temp_stor['35'];
			delete key_val_temp_stor['10'];
			this.ListAttributes = key_val_temp_stor;

			this.rec_datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
			this.rec_trad_system = 'DEFAULT';
		}
	}

	Load_from_TradString(string) {
		this.listCompulKey = ['8', '9', '35', '10'];
		const mess_metadata = string.split(' (INFO) : ')[0];
		this.fix_message = string.split(' (INFO) : ')[1];
		console.log(mess_metadata.split('[')[0].split("_")[0])

		this.rec_datetime = new Date(mess_metadata.split('[')[0].split("_")[0]).toISOString().slice(0, 19).replace('T', ' ');
		this.rec_trad_system = mess_metadata.split('[')[1].split(']')[0].replace('[', '').replace(']', '');
		const fix_attr = this.fix_message.split('|');
		const key_val_temp_stor = {};
		for (let i = 0; i < fix_attr.length - 1; i++) {
			const [key, val] = fix_attr[i].split('=');
			key_val_temp_stor[key] = val;
		}
		for (const mand_att of this.listCompulKey) {
			if (!(mand_att in key_val_temp_stor)) {
				throw new Error(`A mandatory key (${mand_att}) for FIX fragment ${string} is missing`);
			}
		}
		this.BeginString = key_val_temp_stor['8'].split('FIX.')[1];
		this.BodyLength = key_val_temp_stor['9'];
		this.MsgType = key_val_temp_stor['35'];
		this.Checksum = key_val_temp_stor['10'];
		delete key_val_temp_stor['8'];
		delete key_val_temp_stor['9'];
		delete key_val_temp_stor['35'];
		delete key_val_temp_stor['10'];
		this.ListAttributes = key_val_temp_stor;
	}

	Check_FIX_frag() {
		const string_for_checksum = this.fix_message.split('10=')[0];

		function getval(c) {
			const val = c.charCodeAt(0);
			if (val === 124) {
				return 1;
			} else {
				return val;
			}
		}

		const tot_val = Array.from(string_for_checksum).reduce((acc, c) => acc + getval(c), 0);
		if (tot_val % 256 !== parseInt(this.Checksum)) {
			logger.warn('Checksum control has failed');
			return false
		} else {
			logger.info('Checksum control succeeded');
			return true
		}
	}

	Check_FIX_frag_length() {
		var TF = true

		const string_for_checksum =  this.fix_message.split('|').slice(2).join('|').split('10=')[0];
		this.fix_message.split('|', 3)[2].split('10=')[0];
		if (string_for_checksum.length !== parseInt(this.BodyLength)) {
			logger.warn('Length control has failed');
			return false
		} else {
			logger.info('Length control succeeded');
			return true
		}
	}


	JSON_Frag() {

		var obj = {}

		obj["Datetime"] = this.rec_datetime
		obj["TradSys"] = this.rec_trad_system
		obj["BeginString"] = this.BeginString
		obj["BodyLength"] = this.BodyLength
		obj["MsgType"] = this.MsgType
		obj["Checksum"] = this.Checksum

		obj["Attributes"] = this.ListAttributes 

		return(obj)

	}
}

module.exports = FIX_fragment