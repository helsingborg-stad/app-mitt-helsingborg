import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Text, Icon } from 'app/components/atoms';
import StoryWrapper from '../StoryWrapper';
import Card from './Card';

storiesOf('Card', module).add('default', () => (
  <StoryWrapper>
    <View style={{ backgroundColor: '#efefef', flex: 1, padding: 16 }}>
      <Text strong>Aktuell period</Text>

      <Card>
        <Card.Body>
          {/* <Card.Image src={movie.image} alt={movie.title} /> */}
          <Card.Title>Oktober</Card.Title>
          <Card.SubTitle>Ansökan inlämnad</Card.SubTitle>
          <Card.Text>Vi har mottagit din ansökan för perioden 1-31 oktober.</Card.Text>
          <Card.Text italic>Vi skickar ut en notis när status för din ansökan ändras.</Card.Text>
          <Card.Button>
            <Text>Link</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card.Body>
      </Card>

      <Text strong>Mina kontaktpersoner</Text>

      <Card>
        <Card.Body>
          <Card.Title>Title</Card.Title>
          <Card.Text>Text here</Card.Text>
        </Card.Body>
      </Card>

      <Text strong>Tidigare ansökningar</Text>

      <Card>
        <Card.Title>Title</Card.Title>
        <Card.Text>Text here</Card.Text>
        <Card.Button>
          <Text>Link</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
        <Card.Button>
          <Text>Link</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card>
    </View>
  </StoryWrapper>
));
