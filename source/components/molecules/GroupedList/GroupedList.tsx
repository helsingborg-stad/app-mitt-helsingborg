import React, { useState } from "react";
import { View, LayoutAnimation } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components/native";

import { Heading, Fieldset, Text, Button } from "../../atoms";

import theme from "../../../theme/theme";
import { getValidColorSchema } from "../../../theme/themeHelpers";

import type { SummaryListItem } from "../../organisms/SummaryList/SummaryList.types";
import type { PrimaryColor } from "../../../theme/themeHelpers";
import type { Help } from "../../../types/FormTypes";

const FieldsetButton = styled(Button)`
  margin-left: 26px;
`;

const ListBody = styled.View`
  padding-top: 12px;
  padding-bottom: 20px;
  height: auto;
`;

const ListBodyFieldLabel = styled(Heading)<{ colorSchema: string }>`
  margin-top: 5px;
  margin-left: 3px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  color: ${(props) => props.theme.colors.primary[props.colorSchema][1]};
`;

interface Props {
  heading?: string;
  categories: { category: string; description: string }[];
  colorSchema?: PrimaryColor;
  showEditButton?: boolean;
  startEditable?: boolean;
  help?: Help;
  children: React.ReactElement<{
    category: string;
    editable?: boolean;
  }>[];
}

/**
 * A grouped list, grouping items according to categories.
 * Can show an edit-button, which toggles an editable prop in the children, and an help button that opens a help modal.
 */
const GroupedList: React.FC<Props> = ({
  heading,
  categories,
  colorSchema,
  showEditButton,
  startEditable = false,
  help,
  children,
}) => {
  const [editable, setEditable] = useState(startEditable);

  const groupedItems: Record<
    string,
    React.ReactElement<{
      category: string;
      editable?: boolean;
      item: SummaryListItem;
    }>[]
  > = {};
  const changeEditable = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setEditable(!editable);
  };

  categories.forEach((category) => {
    const catagoryItems = children.filter(
      (item) => item.props.category === category.category
    );
    if (catagoryItems.length > 0) {
      groupedItems[category.category] = catagoryItems;
    }
  });
  const validColorSchema = getValidColorSchema(colorSchema);

  return (
    <Fieldset
      colorSchema={validColorSchema}
      legend={heading || ""}
      help={help}
      renderHeaderActions={() => (
        <>
          {showEditButton && (
            <FieldsetButton
              colorSchema={validColorSchema}
              z={0}
              size="small"
              onClick={changeEditable}
            >
              <Text>{editable ? "Stäng" : "Ändra"}</Text>
            </FieldsetButton>
          )}
        </>
      )}
    >
      <ListBody>
        {Object.keys(groupedItems).map((key, index) => (
          <View key={`${index}-${key}`}>
            <ListBodyFieldLabel colorSchema={validColorSchema}>
              {categories.find((c) => c.category === key).description}
            </ListBodyFieldLabel>
            {groupedItems[key].map((item) =>
              React.cloneElement(item, { editable })
            )}
          </View>
        ))}
      </ListBody>
    </Fieldset>
  );
};

GroupedList.propTypes = {
  /**
   * The header text of the list.
   */
  heading: PropTypes.string,
  /**
   * The allowed categories for the groupings
   */
  categories: PropTypes.array,
  /**
   *  Controls the color scheme of the list
   */
  colorSchema: PropTypes.oneOf(Object.keys(theme.colors.primary)),
  /**
   * Whether or not to show the edit button
   */
  showEditButton: PropTypes.bool,
  /**
   * Whether to start in editable mode or not
   */
  startEditable: PropTypes.bool,
  children: PropTypes.array,
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

GroupedList.defaultProps = {
  items: [],
  categories: [],
  colorSchema: "blue",
};
export default GroupedList;
