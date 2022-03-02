import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import GroupedList from "../../molecules/GroupedList/GroupedList";
import Text from "../../atoms/Text/Text";
import Heading from "../../atoms/Heading";
import SummaryListItemComponent from "./SummaryListItem";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import { Help } from "../../../types/FormTypes";
import { useNotification } from "../../../store/NotificationContext";
import { InputType } from "../../atoms/Input/Input";

const SumLabel = styled(Heading)<{ colorSchema: string }>`
  margin-top: 5px;
  margin-left: 3px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  color: ${(props) => props.theme.colors.primary[props.colorSchema][1]};
`;
const SumText = styled(Text)`
  margin-left: 4px;
  margin-top: 10px;
`;
// TODO: the sum component should be sent as a footer to the grouped list, at which point this container should be removed.
// Currently it's using a negative margin, which is a hack and only meant as a temporary fix.
const SumContainer = styled.View<{ colorSchema: string }>`
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 24px;
  margin-top: -64px;
  padding-bottom: 20px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) =>
    props.theme.colors.complementary[props.colorSchema][3]};
`;
export interface SummaryListItem {
  title: string;
  id: string;
  type:
    | "number"
    | "text"
    | "date"
    | "checkbox"
    | "arrayNumber"
    | "arrayText"
    | "arrayDate"
    | "editableListText"
    | "editableListNumber"
    | "editableListDate";
  category?: string;
  inputId?: string;
  inputSelectValue?: InputType;
}

interface SummaryListCategory {
  category: string;
  description: string;
}

interface Props {
  heading: string;
  items: SummaryListItem[];
  categories?: SummaryListCategory[];
  onChange: (
    answers: Record<string, any> | string | number | boolean,
    fieldId: string
  ) => void;
  onBlur: (
    answers: Record<string, any> | string | number | boolean,
    fieldId: string
  ) => void;
  colorSchema: PrimaryColor;
  answers: Record<string, any>;
  validationErrors?: Record<
    string,
    | { isValid: boolean; message: string }
    | Record<string, { isValid: boolean; message: string }>[]
  >;
  showSum: boolean;
  startEditable?: boolean;
  help?: Help;
  editable?: boolean;
}
/**
 * Summary list, that is linked and summarizes values from other input components.
 * The things to summarize is specified in the items prop.
 * The things are grouped into categories, as specified by the categories props.
 */
const SummaryList: React.FC<Props> = ({
  heading,
  items,
  categories,
  onChange,
  onBlur,
  colorSchema,
  answers,
  validationErrors,
  showSum,
  startEditable,
  help,
  editable,
}) => {
  // For development: show an error popup when something is configured wrong.
  const showNotification = useNotification();

  /**
   * Given an item, and possibly an index in the case of repeater fields, this generates a function that
   * updates the form data from the input.
   * @param item The list item
   * @param index The index, when summarizing a repeater field with multiple answers
   */
  const changeFromInput =
    (item: SummaryListItem, index?: number) =>
    (value: string | number | boolean) => {
      if (
        ["arrayNumber", "arrayText", "arrayDate"].includes(item.type) &&
        typeof index !== "undefined" &&
        item.inputId
      ) {
        const oldAnswer: Record<string, string | number | boolean>[] =
          answers[item.id];
        oldAnswer[index][item.inputId] = value;
        onChange(oldAnswer, item.id);
      } else if (
        ["editableListText", "editableListNumber", "editableListDate"].includes(
          item.type
        ) &&
        item.inputId
      ) {
        const oldAnswer: Record<string, string | number | boolean> =
          answers[item.id];
        oldAnswer[item.inputId] = value;
        onChange(oldAnswer, item.id);
      } else {
        onChange(value, item.id);
      }
    };

  const onItemBlur =
    (item: SummaryListItem, index?: number) =>
    (value: string | number | boolean) => {
      if (
        [
          "arrayNumber",
          "arrayText",
          "arrayDate",
          "editableListText",
          "editableListNumber",
          "editableListDate",
        ].includes(item.type) &&
        typeof index !== "undefined" &&
        item.inputId
      ) {
        if (onBlur) onBlur(answers[item.id], item.id);
      } else if (onBlur) onBlur(value, item.id);
    };
  /**
   * Given an item, and index in the case of repeater fields, this generates the function for clearing the associated data
   * in the form state.
   * @param item The list item
   * @param index The index, when summarizing a repeater field with multiple answers
   */
  const removeListItem = (item: SummaryListItem, index?: number) => () => {
    if (typeof index !== "undefined") {
      const oldAnswer: Record<string, string | number>[] = answers[item.id];
      oldAnswer.splice(index, 1);
      onChange(oldAnswer, item.id);
    } else if (
      ["editableListText", "editableListNumber", "editableListDate"].includes(
        item.type
      ) &&
      item.inputId
    ) {
      const oldAnswer: Record<string, string | number> = answers[item.id];
      oldAnswer[item.inputId] = undefined;
      onChange(oldAnswer, item.id);
    } else {
      onChange(undefined, item.id);
    }
  };

  // Code for computing sum of all numeric values shown in the list
  let sum = 0;
  const addToSum = (value: string | number) => {
    if (typeof value === "string") {
      const summand = parseInt(value);
      // eslint-disable-next-line no-restricted-globals
      sum += isNaN(summand) ? 0 : summand;
    } else {
      sum += value;
    }
  };

  const listItems: React.ReactElement<{ category: string }>[] = [];

  const itemsWithAnswers = items.filter((item) => {
    const answer = answers[item.id];

    if (typeof answer !== "undefined") {
      if (item.type === "checkbox") return answer;
      return true;
    }
  });

  /*
  Divide answers into their respective group
  Items belonging to the same group shares the same id.
  [
    {
        "inputId": "childrenFirstname",
        "id": "childrenInfo",
        "category": "categoryId",
        "type": "arrayText",
        "inputSelectValue": "arrayText",
        ...
    },
    {
        "inputId": "childrenPersonalID",
        "id": "childrenInfo",
        "category": "categoryId",
        "type": "arrayNumber",
        "inputSelectValue": "arrayNumber",
        ...
  ]
*/
  const map = new Map();
  itemsWithAnswers.forEach((item: SummaryListItem) => {
    if (!map.has(item.id)) {
      map.set(item.id, {
        items: [item],
        answers: answers[item.id],
      });
    } else {
      map.get(item.id).items.push(item);
    }
  });

  /**
   * Work backwards, given the answers, Map the answer
   * towards its component
   */
  type Item = {
    item: SummaryListItem;
    value?: string | number | boolean;
    index: number;
    otherassetDescription?: string;
    text?: string;
    description?: string;
  } & Record<string, unknown>;

  const reorganizedList: Item[] = [];

  map.forEach((value) => {
    if (Array.isArray(value.answers)) {
      value.answers.forEach((answer, index) => {
        value.items.forEach((item) => {
          reorganizedList.push({
            item,
            value: answer[item.inputId],
            index,
            text: answer.text,
            description: answer.description,
            otherassetDescription: answer.otherassetDescription,
          });
        });
      });
    } else {
      reorganizedList.push({
        item: value.items[0],
        value: value.answers,
        index: 0,
      });
    }
  });

  reorganizedList.forEach((x) => {
    if (["arrayNumber", "arrayText", "arrayDate"].includes(x.item.type)) {
      // in this case we have some answers from a repeater field, and need to loop over and show each one
      const validationError = validationErrors?.[x.item.id]?.[x.index]
        ? validationErrors[x.item.id][x.index][x.item?.inputId]
        : undefined;

      listItems.push(
        <SummaryListItemComponent
          item={x.item}
          index={x.index !== undefined ? x.index + 1 : undefined}
          userDescriptionLabel={
            x.text || x.description || x.otherassetDescription || ""
          }
          key={`${x.item.inputId}-${x.index}`}
          value={x.value ?? ""}
          changeFromInput={changeFromInput(x.item, x.index)}
          onBlur={onItemBlur(x.item, x.index)}
          removeItem={removeListItem(x.item, x.index)}
          colorSchema={colorSchema}
          validationError={validationError}
          category={x.item.category}
        />
      );
      if (x.item.type === "arrayNumber") {
        const numericValue: string | number = Number(x.value);
        addToSum(numericValue);
      }
    }

    if (
      ["editableListText", "editableListNumber", "editableListDate"].includes(
        x.item.type
      ) &&
      x.item.inputId &&
      answers?.[x.item.id]?.[x.item.inputId]
    ) {
      listItems.push(
        <SummaryListItemComponent
          item={x.item}
          key={`${x.item.id}`}
          value={answers[x.item.id][x.item.inputId]}
          changeFromInput={changeFromInput(x.item)}
          onBlur={onItemBlur(x.item)}
          removeItem={removeListItem(x.item)}
          colorSchema={colorSchema}
          validationError={
            validationErrors?.[x.item.id]?.[x.item.inputId]
              ? validationErrors?.[x.item.id]?.[x.item.inputId]
              : undefined
          }
          category={x.item.category}
        />
      );
      if (x.item.type === "editableListNumber") {
        const numericValue: number = answers[x.item.id][x.item.inputId];
        addToSum(numericValue);
      }
    }
    if (["text", "number", "date", "checkbox"].includes(x.item.type)) {
      listItems.push(
        <SummaryListItemComponent
          item={x.item}
          key={`${x.item.id}`}
          value={answers[x.item.id]}
          changeFromInput={changeFromInput(x.item)}
          onBlur={onItemBlur(x.item)}
          removeItem={removeListItem(x.item)}
          colorSchema={colorSchema}
          validationError={
            validationErrors
              ? (
                  validationErrors as Record<
                    string,
                    { isValid: boolean; message: string }
                  >
                )[x.item.id]
              : undefined
          }
          category={x.item.category}
        />
      );
      if (x.item.type === "number") {
        const numericValue: number = answers[x.item.id];
        addToSum(numericValue);
      }
    }
  });

  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    listItems.length > 0 && (
      <>
        <GroupedList
          heading={heading}
          categories={categories}
          colorSchema={validColorSchema}
          showEditButton={editable}
          startEditable={startEditable && editable}
          help={help}
        >
          {listItems}
        </GroupedList>
        {showSum && (
          <SumContainer colorSchema={validColorSchema}>
            <SumLabel colorSchema={validColorSchema}>Summa</SumLabel>
            <SumText type="h1">{sum} kr</SumText>
          </SumContainer>
        )}
      </>
    )
  );
};

SummaryList.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * List of all items, corresponding to all subforms
   */
  items: PropTypes.array,
  /**
   * The categories of the grouping
   */
  categories: PropTypes.array,
  /**
   * What should happen to update the values
   */
  onChange: PropTypes.func,
  /**
   * What should happen when a field loses focus.
   */
  onBlur: PropTypes.func,
  /**
   * Sets the color scheme of the list. default is red.
   */
  color: PropTypes.string,
  /**
   * The form state answers
   */
  answers: PropTypes.object,
  /**
   * Object containing all validation errors for the entire form
   */
  validationErrors: PropTypes.object,
  /**
   * Whether or not to show a sum of all numeric values at the bottom. Defaults to true.
   */
  showSum: PropTypes.bool,
  /**
   * Whether to start in editable mode or not.
   */
  startEditable: PropTypes.bool,
  /**
   * Show a help button
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
};
SummaryList.defaultProps = {
  items: [],
  color: "blue",
  showSum: true,
  onChange: () => {},
};

export default SummaryList;
