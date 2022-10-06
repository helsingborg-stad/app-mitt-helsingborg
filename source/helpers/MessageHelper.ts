type BankIDMessageKey =
  | "userCancel"
  | "startFailed"
  | "expiredTransaction"
  | "certificateErr"
  | "userSign"
  | "unknownError"
  | "technicalError"
  | "userNotFound"
  | "unkownError";

const messages: Record<BankIDMessageKey, string> = {
  /** BankID recommended user messages * */
  userCancel: "Åtgärden avbruten.",
  certificateErr:
    "Det BankID du försöker använda är för gammalt eller spärrat. Använd ett annat BankID eller hämta ett nytt hos din internetbank.",
  expiredTransaction:
    "BankID-appen svarar inte. Kontrollera att den är startad och att du har internetanslutning. Om du inte har något giltigt BankID kan du hämta ett hos din Bank. Försök sedan igen.",
  userSign:
    "Skriv in din säkerhetskod i BankID-appenoch välj Legitimera eller Skriv under.",
  startFailed:
    "BankID-appenverkar inte finnas i din dator eller telefon. Installera denoch hämta ett BankID hos din internetbank.Installera appenfrån din appbutik eller https://install.bankid.com",
  /** Other * */
  technicalError: "Ett tekniskt fel uppstod. Försök igen.",
  unknownError: "Okänt fel. Försök igen.",
  userNotFound:
    "Du har tyvärr inte åtkomst till tjänsten. För vidare hjälp ring kontaktcenter på 042-10 50 00.",
  unkownError: "Okänt fel. Försök igen.",
};

/**
 * Get readable messages from error codes and other events
 *
 * @param {String} key  Key for the message
 * @return {String}     Value of the message
 */
const getMessage = (key: BankIDMessageKey): string =>
  messages[key] || messages.unknownError;

export default getMessage;
