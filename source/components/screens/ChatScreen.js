import React, { Component } from 'react'
import ScreenWrapper from '../molecules/ScreenWrapper'

const LoginAgentComponent = () => (<View></View>)
const SomeInputComponent = () => (<View></View>)

export class ChatScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            ChatAgent: LoginAgentComponent,
            ChatUserInput: SomeInputComponent
        }
    }

    addMessage = () => {}

    switchAgent = () => {}

    switchUserInput = () => {}

    render() {
        const {ChatAgent, ChatUserInput, messages} = this.state

        return (
            <ScreenWrapper>
                <Chat>
                    <ChatAgent 
                        messages={messages}
                        addMessage={this.addMessage}
                        switchAgent={this.switchAgent}
                        switchUserInput={this.switchUserInput}
                    />
                    <ChatBody>
                        <ChatMessages/>
                    </ChatBody>
                    <ChatFooter>
                        <ChatUserInput />
                    </ChatFooter>
                </Chat>
            </ScreenWrapper>
        )
    }
}

export const withChatUserInput = (WrappedComponent) => {
    const hocComponent = ({ ...props }) => <WrappedComponent {...props} />

    hocComponent.propTypes = {
    }

    return hocComponent
}

class Watson extends Component {
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
            </View>
        )
    }
}
const WatsonAgent = withChatUserInput(Watson) 

export default AgentWatson


// example Agent HOC's
// withChatUserInput()
// withWatson()
// withAuthentication()
// withFormService()