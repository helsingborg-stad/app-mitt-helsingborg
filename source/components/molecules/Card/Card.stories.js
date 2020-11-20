import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text, Icon } from 'app/components/atoms';
import styled from 'styled-components/native';
import StoryWrapper from '../StoryWrapper';
import Card from './Card';

const ILLU_INCOME = require('source/assets/images/icons/icn_inkomster_1x.png');

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  padding: 16px;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 6px;
`;

const Prop = styled(Text)`
  font-size: 14px;
  margin-bottom: 6px;
`;

storiesOf('Card', module)
  .add('Child components', props => (
    <StoryWrapper {...props}>
      <ChildComponents />
    </StoryWrapper>
  ))
  .add('Color schemas', props => (
    <StoryWrapper {...props}>
      <ColorSchemas />
    </StoryWrapper>
  ))
  .add('Example combinations', props => (
    <StoryWrapper {...props}>
      <CardExamples />
    </StoryWrapper>
  ));

const ChildComponents = () => (
  <FlexContainer>
    <Title>Body</Title>
    <Prop>(Defaults to no borders or shadow)</Prop>
    <Card>
      <Card.Body></Card.Body>
    </Card>

    <Title>Body</Title>
    <Prop>Prop: color</Prop>
    <Prop>Values: neutral, green, blue, purple, red</Prop>
    <Card>
      <Card.Body color="green"></Card.Body>
    </Card>

    <Title>Body</Title>
    <Prop>Prop: shadow</Prop>
    <Card>
      <Card.Body shadow></Card.Body>
    </Card>

    <Title>Body</Title>
    <Prop>Prop: outlined</Prop>
    <Card colorSchema="red">
      <Card.Body outlined></Card.Body>
    </Card>

    <Title>Title</Title>
    <Card>
      <Card.Body shadow>
        <Card.Title>Title</Card.Title>
      </Card.Body>
    </Card>

    <Title>Sub title</Title>
    <Card>
      <Card.Body shadow>
        <Card.SubTitle>Sub title</Card.SubTitle>
      </Card.Body>
    </Card>

    <Title>Text</Title>
    <Card>
      <Card.Body shadow>
        <Card.Text>Lorem ipsum dolor sit amet</Card.Text>
      </Card.Body>
    </Card>

    <Title>Text</Title>
    <Prop>Prop: italic</Prop>
    <Card>
      <Card.Body shadow>
        <Card.Text italic>Lorem ipsum dolor sit amet</Card.Text>
      </Card.Body>
    </Card>

    <Title>Image</Title>
    <Card>
      <Card.Body shadow>
        <Card.Image source={ILLU_INCOME} />
      </Card.Body>
    </Card>

    <Title>Image</Title>
    <Prop>Prop: circle</Prop>
    <Card>
      <Card.Body shadow>
        <Card.Image circle source={ILLU_INCOME} />
      </Card.Body>
    </Card>

    <Title>Button</Title>
    <Card>
      <Card.Body shadow>
        <Card.Button>
          <Text>Button text</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Title>Progressbar</Title>
    <Card colorSchema="neutral">
      <Card.Body shadow color="neutral">
        <Card.Progressbar currentStep={2} totalStepNumber={5} />
      </Card.Body>
    </Card>
  </FlexContainer>
);

const ColorSchemas = () => (
  <FlexContainer>
    <Card colorSchema="neutral">
      <Card.Body>
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Neutral</Card.Title>
        <Card.SubTitle>Card sub title</Card.SubTitle>
        <Card.Text>Text here lorem ipsum dolor sit amet</Card.Text>
        <Card.Button>
          <Text>Button text</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Card colorSchema="red">
      <Card.Body>
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Red</Card.Title>
        <Card.SubTitle>Card sub title</Card.SubTitle>
        <Card.Text>Text here lorem ipsum dolor sit amet</Card.Text>
        <Card.Button>
          <Text>Button text</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Card colorSchema="blue">
      <Card.Body>
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Blue</Card.Title>
        <Card.SubTitle>Card sub title</Card.SubTitle>
        <Card.Text>Text here lorem ipsum dolor sit amet</Card.Text>
        <Card.Button>
          <Text>Button text</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Card colorSchema="green">
      <Card.Body>
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Green</Card.Title>
        <Card.SubTitle>Card sub title</Card.SubTitle>
        <Card.Text>Text here lorem ipsum dolor sit amet</Card.Text>
        <Card.Button>
          <Text>Button text</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Card colorSchema="purple">
      <Card.Body>
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Purple</Card.Title>
        <Card.SubTitle>Card sub title</Card.SubTitle>
        <Card.Text>Text here lorem ipsum dolor sit amet</Card.Text>
        <Card.Button>
          <Text>Button text</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>
  </FlexContainer>
);

const CardExamples = () => (
  <FlexContainer>
    <Title>Aktiva</Title>
    <Card colorSchema="red">
      <Card.Body shadow color="neutral">
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Ekonomiskt bistånd</Card.Title>
        <Card.SubTitle>Steg 3 / 7</Card.SubTitle>
        <Card.Progressbar currentStep={3} totalStepNumber={7} />
        <Card.Button>
          <Text>Ange hyra</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Title>Sally message</Title>
    <Card colorSchema="green">
      <Card.Body outlined>
        <Card.Title>Hej!</Card.Title>
        <Card.Text>
          Helsingborgs Stad testar att göra självservice lite mer personlig och i första steget så
          är det just Ekonomiskt Bistånd som står i fokus.
        </Card.Text>
      </Card.Body>
    </Card>

    <Card colorSchema="green">
      <Card.Body outlined>
        <Card.Title>Stickprovskontroll</Card.Title>
        <Card.Text>Du har blivit utvald för en stickprovskontroll.</Card.Text>
        <Card.Button>
          <Text>Lämna kontrolluppgifter</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Title>Aktuell period</Title>
    <Card colorSchema="red">
      <Card.Body shadow color="neutral">
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

    <Title>Mina kontaktpersoner</Title>
    <Card colorSchema="red">
      <Card.Body shadow color="neutral">
        <Card.Image circle source={ILLU_INCOME} />
        <Card.Title>Anna Andersson</Card.Title>
        <Card.SubTitle>Socialsekreterare</Card.SubTitle>
        <Card.Text>042 - 52 52 52</Card.Text>
      </Card.Body>
    </Card>
    <Card colorSchema="blue">
      <Card.Body shadow color="neutral">
        <Card.Image circle source={ILLU_INCOME} />
        <Card.Title>Foo Bar</Card.Title>
        <Card.SubTitle>Foobar</Card.SubTitle>
        <Card.Text>042 - 52 52 52</Card.Text>
      </Card.Body>
    </Card>

    <Title>Tidigare ansökningar</Title>
    <Card colorSchema="red">
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

    <Title>Tack för din ansökan!</Title>
    <Card colorSchema="purple">
      <Card.Body>
        <Card.Text>
          Om du är i akut behov av pengar, eller har några frågor, kan du ringa din handläggare.
        </Card.Text>
        <Card.Text>
          Kontaktuppgifter till din handläggare hittar du på ärendesidan i appen.
        </Card.Text>
      </Card.Body>
    </Card>

    <Card colorSchema="purple">
      <Card.Body>
        <Card.Image source={ILLU_INCOME} />
        <Card.Title>Ekonomiskt bistånd</Card.Title>
        <Card.SubTitle>Inskickad</Card.SubTitle>
        <Card.Button>
          <Text>Öppna</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Card colorSchema="purple">
      <Card.Body>
        <Card.Text italic>Eller ring stadens kontaktcenter på nummer 042 - 10 50 60</Card.Text>
        <Card.Button>
          <Text>Ring kontaktcenter</Text>
          <Icon name="help-outline" />
        </Card.Button>
      </Card.Body>
    </Card>
  </FlexContainer>
);
