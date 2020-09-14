import React, { useReducer, useContext, useCallback, Component } from 'react';
import Notification from '../components/molecules/ToastNotification/ToastNotification';
import styled, { ThemeProvider } from 'styled-components/native';
import theme from '../styles/theme';
import Text from '../components/atoms/Text/Text';
import ScreenWrapper from '../components/molecules/ScreenWrapper';
import { View, StyleSheet } from 'react-native';
type Severity = "success" | "info" | "warning" | "error" | undefined;

export interface Notification {
    id: number;
    autoHideDuration: number;
    severity: Severity;
    message: string;
}
const initialState: Notification[] = [] 
type ReducerAction = 
    { type: 'ADD', payload: Omit<Notification,"id"> } 
    | { type: 'REMOVE', payload: {id: number}} 
    | { type: 'REMOVE_ALL' }

export const notificationReducer = (state: Notification[], action: ReducerAction): Notification[] => {
    switch(action.type) {
        case 'ADD':
            const n: Notification = {
                id: (new Date()).valueOf(),
                ...action.payload
            } ;
            return [...state, n ];
        case 'REMOVE':
            return state.filter(t => t.id !== action.payload.id); 
        case 'REMOVE_ALL':
            return initialState;
        default:
            return state;
    }
}

interface Props {
  children: React.ReactNode;
}

interface NotificationContextType {
    showNotification: (message: string, severity: Severity) => void;
    removeNotification: (id: number) => void;
    clearAll: () => void;
}
const defaultVal = {
    showNotification: (m: string, severity: Severity) => {},
    removeNotification: (id: number) => {},
    clearAll: () => {},
}

/** Custom hook that just gives you access to the showNotification method, for ease of use.  */
export const useNotification = () => {
    const { showNotification } = useContext(NotificationContext);
    return useCallback(showNotification, []);
  };

  class Position extends Component {
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.box1}>
            <Text style={styles.text}>1</Text>
          </View>
          <View style={styles.box2}>
            <Text style={styles.text}>2</Text>
          </View>
          <View style={styles.box3}>
            <Text style={styles.text}>3</Text>
          </View>
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    box1: {
      position: 'absolute',
      top: 40,
      left: 40,
      width: 100,
      height: 100,
      backgroundColor: 'red'
    },
    box2: {
      position: 'absolute',
      top: 80,
      left: 80,
      width: 100,
      height: 100,
      backgroundColor: 'blue'
    },
    box3: {
      position: 'absolute',
      top: 120,
      left: 120,
      width: 100,
      height: 100,
      backgroundColor: 'green'
    },
    text: {
      color: '#ffffff',
      fontSize: 80
    }
  });





const NotificationContext = React.createContext<NotificationContextType>(defaultVal);

export const NotificationProvider: React.FC<Props> = ({ children }: Props) => {
  const [notifications, dispatch] = useReducer(notificationReducer, initialState);

  const showNotification = (message: string, severity: Severity ) => {
      dispatch({type:'ADD', payload:{autoHideDuration: 6000, message, severity}});
  }

  const removeNotification = (id: number) => {
      dispatch({type:'REMOVE', payload:{id}});
  }
  const clearAll = () => { 
    dispatch({type:'REMOVE_ALL'});
  }
  return (
    <NotificationContext.Provider value={ {showNotification, removeNotification, clearAll} }>
            {/* <Position/> */}
            {/* <View style={{position: 'absolute', top:50, left:100, backgroundColor:'blue', minWidth:'80%', height:60, zIndex:100}}/> */}
            <Notification notifications={notifications} removeNotification={removeNotification} />
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationContext;
