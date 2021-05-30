import React, {useState, useEffect} from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {Card, FAB} from 'react-native-paper'
import './Global.js'


function APITest() {

  const [data, setData] = useState([{id:1, name:"temp"}])

  useEffect(() => {
    fetch(ASL_API, {
      method:"GET"
    })
    .then(resp => resp.json())
    .then(data => {
      setData(data)
    })
    .catch(error => Alert.alert("error", error.message))
  }, [])

  const renderData = (item) => {
    return (
      <Card style = {styles.cardstyle}>
      <Text>{item.name}</Text>
      </Card>
    )
  }

  return(
    <View style = {{flex:1}}>
      <FlatList
        data = {data}
        renderItem = {(item) => {
          return renderData(item.item);
        }}
        keyExtractor = {item => '${item.id}'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    cardstyle: {
      padding:10,
      marginTop:50,
      margin:10,
      backgroundColor:'#eee',
    }
  });

  export default APITest