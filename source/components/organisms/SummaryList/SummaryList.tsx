import React, { useMemo } from "react";

import { GroupedList } from "../../molecules";

import SummaryListItemComponent from "./SummaryListItem";

import { isObject, deepCopy } from "../../../helpers/Objects";

import { getValidColorSchema } from "../../../theme/themeHelpers";

import {
  SumLabel,
  SumText,
  SumContainer,
  SummarySpacer,
} from "./SummaryList.styled";

import type {
  SummaryListItem,
  Props,
  Answer,
  List,
  Item,
} from "./SummaryList.types";

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
const SummaryList = ({
  heading,
  items = [],
  categories = [],
  onBlur,
  colorSchema,
  answers,
  validationErrors,
  showSum = true,
  startEditable,
  help,
  editable,
  onChange = () => undefined,
}: Props): JSX.Element | null => {
  const validColorSchema = getValidColorSchema(colorSchema);

  const sortedAnswers = useMemo(() => {
    const answersCopy = deepCopy(answers);
    items.forEach((item) => {
      if (ArrayType.includes(item.type)) {
        const category = categories?.find(
          (categoryItem) => item.category === categoryItem.category
        );
        const sortField = category?.sortField;
        if (sortField && Array.isArray(answersCopy[item.id])) {
          answersCopy[item.id] = doSort(answersCopy[item.id], sortField);
        }
      }
    });
    return answersCopy;
  }, [answers, categories, items]);

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
          sortedAnswers[item.id];
        oldAnswer[index][item.inputId] = value;
        onChange(oldAnswer, item.id);
      } else if (
        ["editableListText", "editableListNumber", "editableListDate"].includes(
          item.type
        ) &&
        item.inputId
      ) {
        const oldAnswer: Record<string, string | number | boolean> =
          sortedAnswers[item.id];
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
        if (onBlur) onBlur(sortedAnswers[item.id], item.id);
      } else if (onBlur) onBlur(value, item.id);
    };

  // Code for computing sum of all numeric values shown in the list
  let sum = 0;
  const addToSum = (value: string | number) => {
    if (typeof value === "string") {
      const summand = parseInt(value, 10);
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
    const answer = sortedAnswers[item.id];

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
        answers: sortedAnswers[item.id] ?? "",
      });
    } else {
      itemIdmap.get(item.id)?.items.push(item);
    }
  });

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

          lastCategory = item.category as string;
        });

        reorganizedList.push({
          index,
          value: "SPACER_VALUE",
          item: {
            id: `spacer-${index}-${value.items[0].id}-${value.items[0].inputId}`,
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
      sortedAnswers?.[listEntry.item.id]?.[listEntry.item.inputId]
    ) {
      listItems.push(
        <SummaryListItemComponent
          item={listEntry.item}
          key={summaryListItemKey}
          value={sortedAnswers[listEntry.item.id][listEntry.item.inputId]}
          changeFromInput={changeFromInput(listEntry.item)}
          onBlur={onItemBlur(listEntry.item)}
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
          sortedAnswers[listEntry.item.id][listEntry.item.inputId];
        addToSum(numericValue);
      }
    }
    if (["text", "number", "date", "checkbox"].includes(listEntry.item.type)) {
      listItems.push(
        <SummaryListItemComponent
          item={listEntry.item}
          key={`${listEntry.item.id}`}
          value={sortedAnswers[listEntry.item.id]}
          changeFromInput={changeFromInput(listEntry.item)}
          onBlur={onItemBlur(listEntry.item)}
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
        const numericValue: number = sortedAnswers[listEntry.item.id];
        addToSum(numericValue);
      }
    }

    const isSpacer = listEntry.item.type === "spacer";

    if (isSpacer) {
      listItems.push(
        <SummarySpacer
          key={`${listEntry.item.id}`}
          colorSchema={validColorSchema}
        />
      );
    }
  });

  const spacerCount = listItems.filter((item) =>
    item?.key?.toString().startsWith("spacer-")
  ).length;

  if (spacerCount > 1) {
    const lastSpacerIndex = findLastIndex(
      listItems,
      (item) => !!item?.key?.toString().startsWith("spacer-")
    );

    listItems.splice(lastSpacerIndex, 1);
  }

  return listItems.length > 0 ? (
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
  ) : null;
};

export default SummaryList;
