import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";

import { GroupedList } from "../../molecules";

import { Text, Heading } from "../../atoms";

import SummaryListItemComponent from "./SummaryListItem";

import { isObject } from "../../../helpers/Objects";

import { getValidColorSchema } from "../../../styles/themeHelpers";

import type { PrimaryColor, ThemeType } from "../../../styles/themeHelpers";
import type { InputType } from "../../atoms/Input/Input";
import type { Help } from "../../../types/FormTypes";

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

interface SummarySpacerProps {
  colorSchema: PrimaryColor;
  theme: ThemeType;
}

const SummarySpacer = styled.View<SummarySpacerProps>`
  margin-bottom: 16px;
  height: 4px;
  width: 32px;

  background: ${(props) =>
    props.theme.label.colors[props.colorSchema].underline};
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
    | "editableListDate"
    | "spacer";
  category?: string;
  inputId?: string;
  inputSelectValue?: InputType;
  fieldStyle?: string;
}

interface SummaryListCategory {
  category: string;
  description: string;
  sortField?: string;
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

type Answer = {
  otherassetDescription?: string;
  text?: string;
  description?: string;
} & Record<string, string | boolean | number>;

interface List {
  items: SummaryListItem[];
  answers: Answer[] | string | number | boolean;
}

type Item = {
  item: SummaryListItem;
  value?: string | boolean | number;
  index: number;
  otherassetDescription?: string;
  text?: string;
  description?: string;
} & Record<string, unknown>;

const ArrayType = ["arrayNumber", "arrayText", "arrayDate"];

const doSort = (answers: Answer[], sortField: string): Answer[] =>
  [...answers].sort(
    (a: Answer, b: Answer) => Number(a[sortField]) - Number(b[sortField])
  );

/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
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
  const validColorSchema = getValidColorSchema(colorSchema);

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
        ArrayType.includes(item.type) &&
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

  const listItems: React.ReactElement<{
    category: string;
    item: SummaryListItem;
  }>[] = [];

  const itemsWithAnswers = items.filter((item) => {
    const answer = answers[item.id];

    if (typeof answer !== "undefined") {
      if (item.type === "checkbox") return answer;
      return true;
    }
  });

  const itemIdmap: Map<string, List> = new Map();
  itemsWithAnswers.forEach((item: SummaryListItem) => {
    // Group answers by item
    if (!itemIdmap.has(item.id)) {
      itemIdmap.set(item.id, {
        items: [item],
        answers: answers[item.id] ?? "",
      });
    } else {
      itemIdmap.get(item.id)?.items.push(item);
    }
  });

  useEffect(() => {
    items.forEach((item) => {
      if (ArrayType.includes(item.type)) {
        const category = categories?.find(
          (categoryItem) => item.category === categoryItem.category
        );
        const sortField = category?.sortField;
        if (sortField && Array.isArray(answers[item.id])) {
          // eslint-disable-next-line no-param-reassign
          answers[item.id] = doSort(answers[item.id], sortField);
        }
      }
    });
  }, [items, answers, categories]);

  /**
   * Join answer with its component
   */
  const reorganizedList: Item[] = [];

  itemIdmap.forEach((value) => {
    if (Array.isArray(value.answers)) {
      let lastCategory = "";
      value.answers.forEach((answer, index) => {
        value.items.forEach((item) => {
          reorganizedList.push({
            item,
            value: answer[item.inputId ?? ""],
            index,
            text: answer.text,
            description: answer.description,
            otherassetDescription: answer.otherassetDescription,
          });

          lastCategory = item.category;
        });

        reorganizedList.push({
          index,
          value: "SPACER_VALUE",
          item: {
            id: `spacer-${index}`,
            title: "SPACER",
            type: "spacer",
            category: lastCategory,
          },
          description: undefined,
          text: undefined,
        });
      });
    } else if (isObject(value.answers)) {
      Object.entries(value.answers).forEach(([key, answer], index) => {
        const item = value.items.find((valueItem) => valueItem.inputId === key);

        if (item) {
          reorganizedList.push({
            item,
            value: answer,
            index,
          });
        }
      });
    } else {
      reorganizedList.push({
        item: value.items[0],
        value: value.answers,
        index: 0,
      });
    }
  });

  reorganizedList.forEach((listEntry) => {
    const summaryListItemKey = `${listEntry.item.id}-${listEntry.item.inputId}-${listEntry.index}`;

    if (ArrayType.includes(listEntry.item.type)) {
      // in this case we have some answers from a repeater field, and need to loop over and show each one
      const validationError = validationErrors?.[listEntry.item.id]?.[
        listEntry.index ?? 0
      ]
        ? validationErrors[listEntry.item.id][listEntry.index][
            listEntry.item?.inputId
          ]
        : undefined;

      listItems.push(
        <SummaryListItemComponent
          item={listEntry.item}
          index={
            listEntry.index !== undefined ? listEntry.index + 1 : undefined
          }
          userDescriptionLabel={
            listEntry.text ||
            listEntry.description ||
            listEntry.otherassetDescription
          }
          key={summaryListItemKey}
          value={listEntry.value ?? ""}
          changeFromInput={changeFromInput(listEntry.item, listEntry.index)}
          onBlur={onItemBlur(listEntry.item, listEntry.index)}
          removeItem={removeListItem(listEntry.item, listEntry.index)}
          colorSchema={colorSchema}
          validationError={validationError}
          category={listEntry.item.category}
          fieldStyle={listEntry.item.fieldStyle}
        />
      );
      if (listEntry.item.type === "arrayNumber") {
        const numericValue: string | number = Number(listEntry.value);
        addToSum(numericValue);
      }
    }

    if (
      ["editableListText", "editableListNumber", "editableListDate"].includes(
        listEntry.item.type
      ) &&
      listEntry.item.inputId &&
      answers?.[listEntry.item.id]?.[listEntry.item.inputId]
    ) {
      listItems.push(
        <SummaryListItemComponent
          item={listEntry.item}
          key={summaryListItemKey}
          value={answers[listEntry.item.id][listEntry.item.inputId]}
          changeFromInput={changeFromInput(listEntry.item)}
          onBlur={onItemBlur(listEntry.item)}
          removeItem={removeListItem(listEntry.item)}
          colorSchema={colorSchema}
          validationError={
            validationErrors?.[listEntry.item.id]?.[listEntry.item.inputId]
              ? validationErrors?.[listEntry.item.id]?.[listEntry.item.inputId]
              : undefined
          }
          category={listEntry.item.category}
          fieldStyle={listEntry.item.fieldStyle}
        />
      );
      if (listEntry.item.type === "editableListNumber") {
        const numericValue: number =
          answers[listEntry.item.id][listEntry.item.inputId];
        addToSum(numericValue);
      }
    }
    if (["text", "number", "date", "checkbox"].includes(listEntry.item.type)) {
      listItems.push(
        <SummaryListItemComponent
          item={listEntry.item}
          key={`${listEntry.item.id}`}
          value={answers[listEntry.item.id]}
          changeFromInput={changeFromInput(listEntry.item)}
          onBlur={onItemBlur(listEntry.item)}
          removeItem={removeListItem(listEntry.item)}
          colorSchema={colorSchema}
          validationError={
            validationErrors
              ? (
                  validationErrors as Record<
                    string,
                    { isValid: boolean; message: string }
                  >
                )[listEntry.item.id]
              : undefined
          }
          category={listEntry.item.category}
          fieldStyle={listEntry.item.fieldStyle}
        />
      );
      if (listEntry.item.type === "number") {
        const numericValue: number = answers[listEntry.item.id];
        addToSum(numericValue);
      }
    }

    const isSpacer = listEntry.item.type === "spacer";

    if (isSpacer) {
      listItems.push(
        <SummarySpacer
          key={`${listEntry.item.id}`}
          category={listEntry.item.category}
          colorSchema={validColorSchema}
        />
      );
    }
  });

  const spacerCount = listItems.filter((item) =>
    item?.key?.toString().startsWith("spacer-")
  ).length;

  if (spacerCount > 1) {
    const lastSpacerIndex = findLastIndex(listItems, (item) =>
      item?.key?.toString().startsWith("spacer-")
    );

    listItems.splice(lastSpacerIndex, 1);
  }

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
