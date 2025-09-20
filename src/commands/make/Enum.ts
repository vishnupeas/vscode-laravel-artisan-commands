import Common from '../../Common';
const fs = require('fs');

const optionsMap: Record<string, string> = {
    'Pure Enum': '',
    'Backed Enum (String)': 'string',
    'Backed Enum (Integer)': 'int',
};

export default class Enum extends Common {
  static async run() {
    let enumName = await this.getInput('Enum Name');
    if (enumName.length === 0) {
      this.showError('A Enum name is required');
      return;
    }

		let enumType = optionsMap[(await this.getListInput('Enum Type', Object.keys(optionsMap)))];

		let command = `make:enum ${enumName} ${enumType ? `--${enumType}` : ''}`;

		// Generate the enum
    this.execCmd(command, async info => {
      if (info.err) {
        this.showError('Could not create the Enum', info.err);
      } else {
				const enumDirPath = info.artisan.dir + 'app/Enums';

				if (fs.existsSync(enumDirPath) && fs.statSync(enumDirPath).isDirectory()) {
					await this.openFile(info.artisan.dir, '/app/Enums/' + enumName + '.php');
				} else {
					await this.openFile(info.artisan.dir, '/app/' + enumName + '.php');
				}
      }
    });
  }
}
