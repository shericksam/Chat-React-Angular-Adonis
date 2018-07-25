import * as React from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  YellowBox,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StackNavigator } from 'react-navigation';

const MESSAGES = [
  'okay',
  'sudo make me a sandwich',
  'what? make it yourself',
  'make me a sandwich',
];

// import App from './../../App';

export default class Albums extends React.Component {
    constructor(props) {
        super(props);
         YellowBox.ignoreWarnings(
          ['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'
        ]);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('Title', '       Chat'),
            headerStyle: {
                    backgroundColor: navigation.getParam('BackgroundColor', '#E040FB'),
                },
            headerTintColor: navigation.getParam('HeaderTintColor', '#fff')
        };
    };
  
  
    async getConversation(){
      var url = "http://192.168.1.113:3333";
      var token = await AsyncStorage.getItem('userToken');
      var me = await AsyncStorage.getItem('user');
      // console.log(token)
      return fetch(url+'/conversacion/' + this.state.user.id + "?me=" + me.id,{
        method: 'GET', 
        headers: {
          Authorization: 'Bearer '+ token
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            isLoading: false,
            mensajes: responseJson,
          }, function(){
  
          });
  
        })
        .catch((error) =>{
          console.error(error);
        });
    }
    
  render() {
    const { navigation } = this.props;
    var user = navigation.getParam('user');
    var nombreU =  user.nombre.charAt(0).toUpperCase() +  user.nombre.slice(1);
    // this.setState({
    //   user: user,
    // });
    // console.log(App);
    // const otherParam = navigation.getParam('otherParam', 'some default value');
    setTimeout(function(){
        this.props.navigation.setParams({Title: "       " + nombreU})
        getConversation()
    }.bind(this), 0);

    return (
      <KeyboardAvoidingView
      behavior={'padding'}
      keyboardVerticalOffset={Platform.select({ios: 0, android: 55})}
      style={{flex: 1}}>
        <ScrollView
          style={styles.inverted}
          contentContainerStyle={styles.content}
        >
          {MESSAGES.map((text, i) => {
            const odd = i % 2;

            return (
              <View
                key={i}
                style={[odd ? styles.odd : styles.even, styles.inverted]}
              >
                <Image
                  style={styles.avatar}
                  source={
                    odd
                      ? require('../assets/avatar-2.png')
                      : require('../assets/avatar-1.png')
                  }
                />
                <View
                  style={[styles.bubble, odd ? styles.received : styles.sent]}
                >
                  <Text style={odd ? styles.receivedText : styles.sentText}>
                    {text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje"
          underlineColorAndroid="transparent"
        />
        </KeyboardAvoidingView>
    );
  }
}

// export default ActivityProject = StackNavigator({
//     First: { screen: Albums }
// });

// const RootStack = createStackNavigator(
//     {
//       Chat: Albums,
//     },
//     {
//       initialRouteName: 'Chat',
//       /* The header config from HomeScreen is now here */
//       navigationOptions: {
//         headerStyle: {
//           backgroundColor: '#f4511e',
//         },
//         headerTintColor: '#fff',
//         headerTitleStyle: {
//           fontWeight: 'bold',
//         },
//       },
//     }
//   );
  
//   export default class App extends React.Component {
//     render() {
//       return <RootStack />;
//     }
//   }
// const user;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eceff1',
  },
  inverted: {
    transform: [{ scaleY: -1 }],
  },
  content: {
    padding: 16,
  },
  even: {
    flexDirection: 'row',
  },
  odd: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    marginVertical: 8,
    marginHorizontal: 6,
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, .16)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  bubble: {
    marginVertical: 8,
    marginHorizontal: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sent: {
    backgroundColor: '#cfd8dc',
  },
  received: {
    backgroundColor: '#2196F3',
  },
  sentText: {
    color: 'black',
  },
  receivedText: {
    color: 'white',
  },
  input: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});