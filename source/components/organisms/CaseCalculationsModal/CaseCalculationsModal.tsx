import React, { useState } from "react";
import { View, ScrollView } from "react-native";

import { Card, HelpButton, Modal } from "../../molecules";

import { Icon, Text, Button } from "../../atoms";

import {
  formatAmount,
  convertDataToArray,
} from "../../../helpers/FormatVivaData";

import {
  CloseModalButton,
  ModalContent,
  SummaryHeading,
  ModalFooter,
  CalculationTable,
  CalculationRow,
  CalculationRowHeader,
  CalculationRowCell,
  DetailsTitle,
} from "./CaseCalculationsModal.styled";

import type { Props } from "./CaseCalculationsModal.types";

function CaseCalculationsModal({
  calculation,
  decisions,
  isVisible,
  notes,
  toggleModal,
}: Props): JSX.Element | null {
  const [isCalculationDetailsVisible, setCalculationDetailsVisibility] =
    useState(false);

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} hide={toggleModal}>
      <CloseModalButton
        onClose={toggleModal}
        primary={false}
        showBackButton={false}
        colorSchema="red"
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <ModalContent>
          <SummaryHeading type="h5">Beslut</SummaryHeading>
          {decisions.map((caseDecision, index) => (
            <Card key={index} colorSchema="red">
              <Card.Body color="neutral" shadow>
                <Card.Title colorSchema="neutral">
                  {caseDecision.type}
                </Card.Title>
                <Card.Text>{caseDecision.explanation}</Card.Text>
              </Card.Body>
            </Card>
          ))}

          <Card colorSchema="red">
            <Card.Body color="neutral">
              <Card.Title colorSchema="neutral">Beräkning</Card.Title>
              {calculation?.periodstartdate && calculation?.periodenddate && (
                <Card.Text>{`Period: ${calculation.periodstartdate} - ${calculation.periodenddate} `}</Card.Text>
              )}
              <CalculationRow>
                <Card.Text strong>Inkomster</Card.Text>
                <Card.Text>{formatAmount(calculation.incomesum)}</Card.Text>
              </CalculationRow>
              <CalculationRow>
                <Card.Text strong>Utgifter</Card.Text>
                <Card.Text>{formatAmount(calculation.costsum, true)}</Card.Text>
              </CalculationRow>
              <CalculationRow>
                <Card.Text strong>Belopp enligt norm</Card.Text>
                <Card.Text>
                  {formatAmount(calculation.normsubtotal, true)}
                </Card.Text>
              </CalculationRow>
              <CalculationRow>
                <Card.Text strong>Reducering</Card.Text>
                <Card.Text>
                  <Card.Text>
                    {formatAmount(calculation.reductionsum)}
                  </Card.Text>
                </Card.Text>
              </CalculationRow>
              <CalculationRow>
                <Card.Text strong>Summa</Card.Text>
                <Card.Text strong>
                  {formatAmount(calculation.calculationsum)}
                </Card.Text>
              </CalculationRow>

              <Card.Button
                colorSchema="neutral"
                onClick={() =>
                  setCalculationDetailsVisibility(!isCalculationDetailsVisible)
                }
              >
                <Text>Detaljer</Text>
                <Icon
                  name={
                    isCalculationDetailsVisible
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                />
              </Card.Button>
              {isCalculationDetailsVisible && (
                <>
                  <DetailsTitle type="h6">
                    Personer som påverkar normen
                  </DetailsTitle>
                  {calculation?.calculationpersons?.calculationperson &&
                    convertDataToArray(
                      calculation?.calculationpersons?.calculationperson
                    ).map((person, index) => (
                      <Card
                        key={`${index}-${person?.name}`}
                        colorSchema="neutral"
                      >
                        <Card.Title colorSchema="neutral" strong>
                          {person?.name}
                        </Card.Title>
                        <Card.SubTitle colorSchema="neutral" strong>
                          {person?.pnumber}
                        </Card.SubTitle>
                        <Card.Text>
                          Norm beräknad på {person?.days} dagar
                        </Card.Text>
                      </Card>
                    ))}

                  <Text strong type="h6">
                    Detaljerad beräkning
                  </Text>

                  <DetailsTitle type="h5">Inkomster</DetailsTitle>
                  {calculation?.incomes?.income ? (
                    <>
                      <CalculationTable>
                        <CalculationRowHeader>
                          <CalculationRowCell>
                            <Text strong>Inkomst</Text>
                          </CalculationRowCell>
                          <CalculationRowCell>
                            <Text strong>Summa</Text>
                          </CalculationRowCell>
                          <CalculationRowCell />
                        </CalculationRowHeader>

                        {convertDataToArray(calculation?.incomes?.income).map(
                          (income, index) => (
                            <CalculationRow key={`${index}-${income?.type}`}>
                              <CalculationRowCell>
                                <Text>{income?.type}</Text>
                              </CalculationRowCell>
                              <CalculationRowCell>
                                <Text>{income?.amount} kr</Text>
                              </CalculationRowCell>
                              <CalculationRowCell>
                                {income.note ? (
                                  <HelpButton
                                    text={income.note}
                                    heading={income.type}
                                    tagline=""
                                    icon="info"
                                  />
                                ) : null}
                              </CalculationRowCell>
                            </CalculationRow>
                          )
                        )}
                      </CalculationTable>
                    </>
                  ) : (
                    <Card.Text italic>
                      Det finns inga registrerade inkomster.
                    </Card.Text>
                  )}

                  <DetailsTitle type="h5">Utgifter</DetailsTitle>
                  {calculation?.costs?.cost ? (
                    <>
                      <CalculationTable>
                        <CalculationRowHeader>
                          <CalculationRowCell />
                          <CalculationRowCell>
                            <Text strong>Ansökt</Text>
                          </CalculationRowCell>
                          <CalculationRowCell>
                            <Text strong>Godkänt</Text>
                          </CalculationRowCell>
                          <CalculationRowCell />
                        </CalculationRowHeader>
                        {convertDataToArray(calculation?.costs?.cost).map(
                          (cost, index) => (
                            <CalculationRow key={`${index}-${cost.type}`}>
                              <CalculationRowCell>
                                <Text>{cost?.type}</Text>
                              </CalculationRowCell>
                              <CalculationRowCell>
                                <Text>{formatAmount(cost.actual)}</Text>
                              </CalculationRowCell>
                              <CalculationRowCell>
                                <Text>{formatAmount(cost.approved)}</Text>
                              </CalculationRowCell>
                              <CalculationRowCell>
                                {cost.note ? (
                                  <HelpButton
                                    text={cost.note}
                                    heading={cost.type}
                                    tagline=""
                                    icon="info"
                                  />
                                ) : null}
                              </CalculationRowCell>
                            </CalculationRow>
                          )
                        )}
                      </CalculationTable>
                    </>
                  ) : (
                    <Card.Text italic>
                      Det finns inga registrerade utgifter.
                    </Card.Text>
                  )}

                  <DetailsTitle type="h5">Belopp enligt norm</DetailsTitle>

                  {calculation?.norm?.normpart ? (
                    <>
                      {calculation.norm.normpart?.map((part, index) => {
                        const bottomPadding =
                          calculation.norm.normpart.length === index + 1
                            ? 0
                            : 16;

                        return (
                          <CalculationRow
                            key={`${index}-${part.type}`}
                            paddingBottom={bottomPadding}
                          >
                            <CalculationRowCell flex={2}>
                              <Text align="left">{part?.type}</Text>
                            </CalculationRowCell>
                            <CalculationRowCell justify="center">
                              <Text align="right">
                                {formatAmount(part.amount)}
                              </Text>
                            </CalculationRowCell>
                          </CalculationRow>
                        );
                      })}
                    </>
                  ) : (
                    <Card.Text italic>
                      Det finns inga registrerade normer.
                    </Card.Text>
                  )}

                  <DetailsTitle type="h5">Reducering</DetailsTitle>
                  {calculation?.reductions?.reduction ? (
                    <>
                      {convertDataToArray(
                        calculation?.reductions?.reduction
                      ).map((reduction, index) => (
                        <CalculationRow key={`${index}-${reduction.type}`}>
                          <CalculationRowCell>
                            <Text>{reduction?.type}</Text>
                          </CalculationRowCell>
                          <CalculationRowCell>
                            <Text>
                              {reduction?.days}{" "}
                              {reduction?.days > 1 ? "dagar" : "dag"}
                            </Text>
                          </CalculationRowCell>
                          <CalculationRowCell>
                            <Text>{reduction?.note}</Text>
                          </CalculationRowCell>
                          <CalculationRowCell>
                            <Text>{formatAmount(reduction.amount)}</Text>
                          </CalculationRowCell>
                        </CalculationRow>
                      ))}
                    </>
                  ) : (
                    <Card.Text italic>
                      Det finns inga registrerade reduceringar.
                    </Card.Text>
                  )}

                  <CalculationRow>
                    <Card.Text strong>Summa</Card.Text>
                    <Card.Text strong>
                      {formatAmount(calculation.calculationsum)}
                    </Card.Text>
                  </CalculationRow>
                </>
              )}
            </Card.Body>
          </Card>

          {notes?.length > 0 && (
            <Card>
              <Card.Body color="neutral">
                <Card.Title colorSchema="neutral">Anteckningar</Card.Title>
                {notes.map(({ label, text }) => (
                  <View key={`journal-${label}`}>
                    <Text type="h3">{label}</Text>
                    <Card.Text>{text}</Card.Text>
                  </View>
                ))}
              </Card.Body>
            </Card>
          )}
        </ModalContent>
        <ModalFooter>
          <Button z={0} block onClick={toggleModal} colorSchema="neutral">
            <Text>Stäng</Text>
          </Button>
        </ModalFooter>
      </ScrollView>
    </Modal>
  );
}

export default CaseCalculationsModal;
