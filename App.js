import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {

  const [rates, setRates] = useState([]);
  const [currencyKeys, setCurrencyKeys] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState();
  const [converted, setConverted] = useState();

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const myHeaders = new Headers();
  myHeaders.append('apikey', 'ykPYvA32e3ADbrxdUIfEYJR0A3T7vztr');

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  const convertToEur = () => {
    console.log("converted:")
    setConverted((amount / rates[selectedCurrency]).toFixed(2))
  }

  useEffect(() => {
    fetch(`https://api.apilayer.com/exchangerates_data/latest?&base=EUR`, requestOptions)
    .then(response => response.json())
    .then(data => setRates(data.rates))
    .catch(error => console.log('error', error));
  }, [])

  useEffect(() => {
    setCurrencyKeys(Object.keys(rates));
  }, [rates])

  useEffect(() => {
    console.log(selectedCurrency);
    console.log(rates[selectedCurrency])
  }, [selectedCurrency])

  return (
    <View style={styles.container}>
      <Text style={{margin: 50, fontSize: 25, fontWeight: 'bold'}}>{converted} €</Text>
      <TextInput 
        style={{fontSize: 15, width: 50, borderWidth: 1}}
        onChangeText={text => setAmount(text)}
      />
      <Picker
        ref={pickerRef}
        style={{height: 50, width: 200}}
        selectedValue={selectedCurrency}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCurrency(itemValue)
        }>
        {currencyKeys.map(item =>
        <Picker.Item label={item} value={item}/>)
        }
      </Picker>
      <Button title="convert" onPress={convertToEur}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
