const statuses = [
  {
    type: 'notStarted',
    name: 'Ej påbörjad',
    description: 'Ansökan är ej påbörjad.',
  },
  {
    type: 'active.ongoing',
    name: 'Pågående',
    description:
      'Du har påbörjat en ansökan. Du kan öppna din ansökan och fortsätta där du slutade.',
  },
  {
    type: 'active.submitted',
    name: 'Inskickad',
    description: 'Ansökan är inskickad.',
  },
  {
    type: 'active.processing',
    name: 'Ansökan behandlas',
    description: 'Ditt ärende är mottaget och bearbetas.',
  },
  {
    type: 'closed',
    name: 'Avslutat',
    description: 'Ditt ärende är avslutat.',
  },
  /**
   * Service: Ekonomiskt bistånd
   */
  {
    type: 'notStarted.ekb',
    name: 'Öppen',
    description: 'Ansökan är öppen. Du kan nu söka ekonomiskt bistånd för perioden.',
  },
  {
    type: 'active.submitted.ekb',
    name: 'Inskickad',
    description:
      'Ansökan är inskickad. Du kommer att få besked om ansökan när din handläggare har granskat och bedömt den.',
  },
  {
    type: 'active.completionRequired.ekb',
    name: 'Stickprovskontroll',
    description:
      'Du måste komplettera din ansökan med bilder som visar dina utgifter och inkomster. Vi behöver din komplettering inom 4 dagar för att kunna betala ut pengar för perioden.',
  },
  {
    type: 'closed.approved.ekb',
    name: 'Godkänd',
    description: 'Din ansökan är godkänd. Pengarna sätts in på ditt konto.',
  },
  {
    type: 'closed.partiallyApproved.ekb',
    name: 'Delvis godkänd',
    description:
      'Delar av din ansökan är godkänd, men några av de utgifter du sökt för får du inte bistånd för. Pengarna för godkända utgifter sätts in på ditt konto.',
  },
  {
    type: 'closed.rejected.ekb',
    name: 'Avslagen',
    description:
      'Din ansökan är inte godkänd och du kommer inte att få någon utbetalning. Vill du överklaga beslutet lämnar du en skriftlig motivering med e-post eller brev till din handläggare.',
  },
  {
    type: 'closed.completionRejected.ekb',
    name: 'Avslagen',
    description:
      'Din ansökan är inte godkänd eftersom vi saknar stickprov för perioden. Därför kan vi inte gå vidare och godkänna din ansökan.',
  },
];

export const getStatusByType = type => statuses.find(status => status.type === type);

export default statuses;
