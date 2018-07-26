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
  Platform,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import StaticComponent from './StaticComponent';

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
      this.state ={ 
        isLoading: true,
        isOnScreen: true,
        mensajes: [],
        mensaje: "",
        groupSelected: false,
        isConnected: true,
        user: [],
        me: [],
      }
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
    me = JSON.parse(me);
    // console.log(this.state.user.id + "?me=" + me.id)
    var urlConversation;
    if(this.state.groupSelected)
      urlConversation = url + "/grupos/conversacion/" + this.state.user.id;
    else
      urlConversation = url + '/conversacion/' + this.state.user.id + "?me=" + me.id;

    return fetch(urlConversation,{
      method: 'GET', 
      headers: {
        Authorization: 'Bearer '+ token
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        this.setState({
          isLoading: false,
          mensajes: responseJson.reverse(),
          me: me
        });

      }).catch((error) =>{
        console.error(error);
      });
  }

  componentWillUnmount(){
    console.log("this.state.isOnScreen", this.state.isOnScreen);
    this.setState({
      isOnScreen: false
    });
  }

  componentDidMount(){
    StaticComponent.chatGlobal.on('receive-message', (data) => {
      console.log(this.state.isOnScreen);
      if(this.state.isOnScreen){
        if(data.from == this.state.user.id){
          this.newMessage(data);
        }
      }
    });
    const { navigation } = this.props;
    var user = navigation.getParam('user');

    var nombreU =  user.nombre.charAt(0).toUpperCase() +  user.nombre.slice(1);
    this.setState({
      user: user,
      groupSelected: user.groupSelected
    });
    // console.log(user);
    // const otherParam = navigation.getParam('otherParam', 'some default value');
    
    this.getConversation();
    // setTimeout(function(){
        this.props.navigation.setParams({Title: "       " + nombreU});
    // }.bind(this), 1);

  }

  newMessage(data){
    var mensajes = this.state.mensajes;
    mensajes.unshift(data);
    
    this.setState({mensajes:[]}, function(){
      this.setState({
        mensajes: mensajes,
        mensaje: ''
      });
    });
    
  }

  sendMessage = async () =>{
    var data;
    if(this.state.mensaje != ""){
      if(this.state.groupSelected){
        data = {
          mensaje: this.state.mensaje,
          from: this.state.me.id,
          grupo: this.state.user.id
        };
        console.log("envio grupo", this.state.isConnected);
        if(this.state.isConnected){
          console.log("****** LANZADO A GRUPO "+this.state.user.id+" ************");
          StaticComponent.ws.getSubscription('chat:grupo' + this.state.user.id).emit('newMessageToGroup', data);
        }
      }else{
        console.log("envio user", this.state.isConnected);
        data = {
          mensaje:this.state.mensaje,
          from:this.state.me.id,
          to:this.state.user.id
        };
        if(this.state.isConnected){
          console.log("****** LANZADO A USUARIO " + this.state.user.id + "************");
          StaticComponent.ws.getSubscription('chat:global').emit('newMessage', data);
        }
      }
      var mensajes = this.state.mensajes;
      mensajes.unshift(data);
      
      this.setState({mensajes:[]}, function(){
        this.setState({
          mensajes: mensajes,
          mensaje: ''
        });
      });
    }    
  }

  render() {
    
    return (
      <KeyboardAvoidingView
      behavior={'padding'}
      keyboardVerticalOffset={Platform.select({ios: 0, android: 55})}
      style={{flex: 1}}>
        <ScrollView
          style={styles.inverted}
          contentContainerStyle={styles.content}
        >
          {this.state.mensajes.map((item, i) => {
            const odd = item.from == this.state.me.id;
            return (
              <View
                key={i}
                style={[odd ? styles.odd : styles.even, styles.inverted]}>
                <Image
                  style={styles.avatar}
                  source={
                    odd
                      ? require('../assets/avatar-2.png')
                      : require('../assets/avatar-1.png')
                  }/>
                <View
                  style={[styles.bubble, odd ? styles.received : styles.sent]}>
                  <Text style={odd ? styles.receivedText : styles.sentText}>
                    {item.mensaje}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje"
            underlineColorAndroid="transparent"
            value={this.state.mensaje}
            onChangeText={(mensaje) => this.setState({mensaje})}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={styles.send}>Enviar</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eee'
  },
});