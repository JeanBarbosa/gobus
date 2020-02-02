import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, AsyncStorage } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import pioneira from '../assets/pioneira.png';


export default function Map() {

    const [currentLine, setCurrentLine] = useState('');
    const [currentRigion, setCurrentRigion] = useState(null);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {

        async function loadHistoryLines(){
            const value = await AsyncStorage.getItem('historySearchBus');
            currentLine = value;
            console.log(`value: ${currentLine}`);
        }

        async function loadInitialPosition() {
            let  {status} = await  Permissions.askAsync(Permissions.LOCATION);

            if(status === 'granted'){
                const {coords} = await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                });

                const { latitude, longitude } = coords;

                setCurrentRigion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                  });
            }
        }

        loadInitialPosition();
        loadGpsOperations();
        loadHistoryLines();

    }, []);

    async function loadGpsOperations(){
        const response = await api.get('/service/gps/operacoes');
        setCompanies(response.data);
        //console.log(response);
    }

    async function searchBus() {

        companies.map(company => {
            company.veiculos.map(veiculo => {
                if(veiculo.linha == currentLine){
                        console.log(veiculo);
                }
            })
        });

        await AsyncStorage.setItem('historySearchBus', currentLine);
    }

    if(!currentRigion){
        return null;
    }

    // if(companies.length > 0){
    //     return null;
    // }

    return (
        <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding"style={styles.container}>
        <MapView 
          showsPointsOfInterest={true}
          initialRegion={currentRigion}
          style={styles.mapStyle} >

                {                     
                    companies.map(company => (
                        company.veiculos.map( veiculo =>{ if( currentLine && veiculo.linha == currentLine) return (
                                    <Marker 
                                    key={veiculo.horario}
                                    coordinate={{latitude: veiculo.localizacao.latitude, longitude: veiculo.localizacao.longitude}}>
                                    <Image style={styles.avatar} source={pioneira} />

                                    <Callout onPress={() => {
                                
                                    }}>
                                        <View style={styles.callout}>
                                            <Text style={styles.propertyTitle}>{veiculo.linha}</Text>
                                            <Text style={styles.propertyDescription}>
                                                info aqui
                                            </Text>
                                        </View>
                                    </Callout>
                                </Marker>
                            )
                        }
                        )
                    ))
                }

          
        </MapView>

        <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding" style={styles.searchForm}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="buscar linha"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={currentLine}
            onChangeText={setCurrentLine}
          />

          <TouchableOpacity style={styles.loadButton} onPress={searchBus} > 
            <MaterialIcons name="my-location" size={20} color="#FFF"/>
          </TouchableOpacity>

        </KeyboardAvoidingView>

    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    
    avatar: {
      width: 54,
      height: 54,
      borderRadius: 4,
      borderWidth: 4,
      borderColor: '#fff'
    },
  
    callout: {
      width: 260
    },
  
    propertyTitle: {
      fontWeight: 'bold',
      fontSize: 16
    },
  
    propertyDescription: {
      color: '#666',
      marginTop: 5,
    },
  
    propertyPrice: {
      marginTop: 5,
    },
  
    searchForm: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      zIndex: 5,
      flexDirection: 'row',
    },
  
    searchInput: {
      flex: 1,
      height: 50,
      backgroundColor: '#fff',
      color: '#333',
      borderRadius: 25,
      paddingHorizontal: 20,
      fontSize: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: {
        width: 4,
        height: 4
      },
      elevation: 2,
    },
  
    loadButton: {
       width:50,
       height: 50,
       backgroundColor: '#8e4dff',
       borderRadius: 25,
       justifyContent:'center',
       alignItems: 'center',
       marginLeft: 15,
    }
    
  });
