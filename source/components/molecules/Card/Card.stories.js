import React from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Text, Icon } from 'app/components/atoms';
import StoryWrapper from '../StoryWrapper';
import Card from './Card';

const ILLU_INCOME = require('source/assets/images/icons/icn_inkomster_1x.png');

storiesOf('Card', module).add('default', () => (
  <StoryWrapper>
    <ScrollView style={{ backgroundColor: '#efefef', flex: 1, padding: 16 }}>
      <Text style={{ paddingBottom: 8 }} strong>
        Aktiva
      </Text>

      <Card>
        <Card.Body>
          <Card.Image source={ILLU_INCOME} />

          <Card.Title>Ekonomiskt bistånd</Card.Title>
          <Card.SubTitle>Ofullständig</Card.SubTitle>
          <Card.Button>
            <Text>Ange hyra</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card.Body>
      </Card>

      <Text style={{ paddingBottom: 8 }} strong>
        Aktuell period
      </Text>

      <Card colorSchema="red">
        <Card.Body>
          <Card.Title>Oktober</Card.Title>
          <Card.SubTitle>Ansökan inlämnad</Card.SubTitle>
          <Card.Text>Vi har mottagit din ansökan för perioden 1-31 oktober.</Card.Text>
          <Card.Text italic>Vi skickar ut en notis när status för din ansökan ändras.</Card.Text>
          <Card.Button>
            <Text>Visa ansökan</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card.Body>
      </Card>

      <Text style={{ paddingBottom: 8 }} strong>
        Mina kontaktpersoner
      </Text>

      <Card colorSchema="blue">
        <Card.Body>
          <Card.Title>Anna Andersson</Card.Title>
          <Card.SubTitle>Socialsekreterare</Card.SubTitle>
          <Card.Text>042 - 52 52 52</Card.Text>
        </Card.Body>
      </Card>

      <Text style={{ paddingBottom: 8 }} strong>
        Tidigare ansökningar
      </Text>

      <Card colorSchema="green">
        <Card.Text italic>Här kan du titta på dina tidigare ansökningar.</Card.Text>
        <Card.Button>
          <Text>1-30 september</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
        <Card.Button>
          <Text>1-31 augusti</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card>
    </ScrollView>
  </StoryWrapper>
));
