const FormTypes = ['EKB-recurring', 'EKB-new', 'EKB-completion'];

export const FormTypesDescription = {
  'EKB-recurring': {
    name: 'EKB löpande ansökan',
    description: 'Månadsvis ansökan för ekonomiskt bistånd',
  },
  'EKB-new': {
    name: 'EKB grundansökan',
    description: 'Första ansökan om ekonomiskt bistånd. Större, mer omfattande.',
  },
  'EKB-completion': {
    name: 'EKB komplettering',
    description: 'När en ansökan behöver kompletteras med bankutdrag eller kvitton',
  },
};

export default FormTypes;
