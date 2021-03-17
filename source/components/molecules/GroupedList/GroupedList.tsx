import React, { useState } from 'react';
import { View, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Help } from '../../../types/FormTypes';
import Text from '../../atoms/Text';
import Fieldset, { FieldsetButton } from '../../atoms/Fieldset/Fieldset';
import theme from '../../../styles/theme';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';
import { Heading } from '../../atoms';

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
  children: React.ReactElement<{ category: string; editable?: boolean }>[];
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
  startEditable,
  help,
  children,
}) => {
  const [editable, setEditable] = useState(startEditable);

  const groupedItems: Record<
    string,
    React.ReactElement<{ category: string; editable?: boolean }>[]
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

  categories.forEach((cat) => {
    const catItems = children.filter((item) => item.props.category === cat.category);
    if (catItems.length > 0) {
      groupedItems[cat.category] = catItems;
    }
  });
  const validColorSchema = getValidColorSchema(colorSchema);

  return (
    <Fieldset
      colorSchema={validColorSchema}
      legend={heading || ''}
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
              <Text>{editable ? 'Stäng' : 'Ändra'}</Text>
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
            {groupedItems[key].map((item) => React.cloneElement(item, { editable }))}
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
  colorSchema: 'blue',
};
export default GroupedList;
