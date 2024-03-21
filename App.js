import { Text, View, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ListItem, Button, Icon } from 'react-native-elements';
import { collection, addDoc, doc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import { useState, useEffect } from "react";


const HomeScreen = ({ navigation }) => {
  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{flex: 15, justifyContent: 'center'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold'}}>Calculadora de IMC</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>

        <View style={{ flex: 1 }}>
          <Button onPress={() => navigation.navigate('Criar')} title="Criar" />
        </View>

        <View style={{ flex: 1 }}>
          <Button onPress={() => navigation.navigate('Lista')} title="Lista" />
        </View>

      </View>
    </View>

  );
};

const Criar = ({ route, navigation }) => {
  let editando = route.params ? true : false;
  const [pessoa, setPessoa] = useState(route.params ? route.params : {});

  useEffect(() => {
    const calculaImc = () => {
      if (pessoa.peso && pessoa.altura) {
        const imc = parseFloat(parseFloat(pessoa.peso) / (parseFloat(pessoa.altura) * parseFloat(pessoa.altura))).toFixed(2);
        setPessoa((prevPessoa) => ({ ...prevPessoa, imc }));
      } else {
        setPessoa((prevPessoa) => ({ ...prevPessoa, imc: null }));
      }
    };

    calculaImc();
  }, [pessoa.peso, pessoa.altura]);


  const gerencia = async () => {
    try {


      if (editando) {

        await updateDoc(doc(db, "IMC", pessoa.id), {
          nome: pessoa.nome,
          peso: pessoa.peso,
          idade: pessoa.idade,
          altura: pessoa.altura,
          cidade: pessoa.cidade,
          imc: pessoa.imc,

        });
        alert("Usuário atualizado");
      } else {
        await addDoc(collection(db, "IMC"), {
          nome: pessoa.nome,
          peso: pessoa.peso,
          idade: pessoa.idade,
          altura: pessoa.altura,
          cidade: pessoa.cidade,
          imc: pessoa.imc,

        });
        alert("Usuário criado");
      }

      navigation.navigate("Home", pessoa);
    } catch (e) {
      alert("Erro ao salvar o usuário!", "Verifique se preencheu todos os dados.");
      console.error("Deu erro: ", e);
    }
  };



  const situacao = () => {
    const result = parseFloat(pessoa.imc);

    if (isNaN(result)) {
      return (
        <View>
          <Text>IMC</Text>
        </View>
      )
    }


    if (result <= 18.5) {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>IMC: {result}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'yellow'}}>Abaixo do peso</Text>
        </View>)
    }
    else if (result <= 24.9) {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>IMC: {result}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'green'}}>Normal</Text>
        </View>)
    }
    else if (result <= 29.9) {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>IMC: {result}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'yellow'}}>Sobrepeso</Text>
        </View>)
    }
    else if (result <= 34.9) {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>IMC: {result}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'orange'}}>Obesidade grau I</Text>
        </View>)
    }
    else if (result <= 39.9) {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>IMC: {result}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'red'}}>Obesidade grau II</Text>
        </View>)
    }
    else {
      return (
        <View style={{alignItems:'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>IMC: {result}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'red'}}>Obesidade grau III</Text>
        </View>)
    }
  };


  return (
    <View style={style.form}>
      <Text>Nome</Text>
      <TextInput style={style.input}
        onChangeText={(nome) => setPessoa({ ...pessoa, nome })}
        placeholder="Informe o nome"
        value={pessoa.nome} />

      <Text>Idade</Text>
      <TextInput style={style.input}
        onChangeText={(idade) => setPessoa({ ...pessoa, idade })}
        placeholder="Informe a idade"
        value={pessoa.idade}
        keyboardType="numeric" />

      <Text>Cidade</Text>
      <TextInput style={style.input}
        onChangeText={(cidade) => setPessoa({ ...pessoa, cidade })}
        value={pessoa.cidade}
        placeholder="Informe a cidade" />

      <Text>Peso</Text>
      <TextInput style={style.input}
        onChangeText={(peso) => setPessoa({ ...pessoa, peso })}
        placeholder="Informe o peso"
        value={pessoa.peso}
        keyboardType="numeric" />

      <Text>Altura</Text>
      <TextInput style={style.input}
        onChangeText={(altura) => setPessoa({ ...pessoa, altura })}
        placeholder="Informe a altura"
        value={pessoa.altura}
        keyboardType="numeric" />

      <View>{situacao()}</View>



      <Button title="Salvar" onPress={() => gerencia()} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};


const UserList = ({ route, navigation }) => {

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const usersCollection = collection(db, "IMC");
    const querySnapshot = await getDocs(usersCollection);

    const userList = [];
    querySnapshot.forEach((doc) => {
      userList.push({

        id: doc.id,
        nome: doc.data().nome,
        idade: doc.data().idade,
        cidade: doc.data().cidade,
        altura: doc.data().altura,
        peso: doc.data().peso,

      });
    });

    setUsers(userList);
  };

  useEffect(() => {
    getUsers();
    console.log("Executou a atualização da lista");
    console.log(users)
  }, [route.params]);

  const renderPessoaItem = ({ item: pessoa }) => (
    <ListItem
      key={pessoa.id}
      bottomDivider
      onPress={() => navigation.navigate("Detalhes", pessoa)}
    >
      <ListItem.Content>
        <ListItem.Title>Nome: {pessoa.nome}</ListItem.Title>
        <ListItem.Subtitle>Idade: {pessoa.idade}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(pessoa) => pessoa.id}
        renderItem={renderPessoaItem}
      />
    </View>
  );
};

const UserDetails = (props) => {
  const [pessoa, setPessoa] = useState(
    props.route.params ? props.route.params : {}
  );

  const calculaImc = (pessoa) => {
    return parseFloat(parseFloat(pessoa.peso) / (parseFloat(pessoa.altura) * parseFloat(pessoa.altura))).toFixed(2);
  };

  const situacao = (pessoa) => {
    const result = calculaImc(pessoa);

    if (result <= 18.5) {
      return "Abaixo do peso";
    }
    else if (result <= 24.9) {
      return "Normal";
    }
    else if (result <= 29.9) {
      return "Sobrepeso";
    }
    else if (result <= 34.9) {
      return "Obesidade grau I";
    }
    else if (result <= 39.9) {
      return "Obesidade grau II";
    }
    else {
      return "Obesidade grau III";
    }
  };

  const handleExcluirPessoa = async () => {
    try {

      await deleteDoc(doc(db, "IMC", pessoa.id));
      alert("Pessoa excluída com sucesso");
      props.navigation.navigate("Lista", pessoa);
    } catch (error) {
      console.error("Erro ao excluir pessoa: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textoPadrao}>Nome: {pessoa.nome}</Text>
      <Text style={styles.textoPadrao}>Idade: {pessoa.idade}</Text>
      <Text style={styles.textoPadrao}>Cidade: {pessoa.cidade}</Text>
      <Text style={styles.textoPadrao}>Peso: {pessoa.peso}</Text>
      <Text style={styles.textoPadrao}>Altura: {pessoa.altura}</Text>
      <Text style={styles.textoPadrao}>IMC: {calculaImc(pessoa)}</Text>
      <Text style={[styles.textoPadrao, styles.textoDestaque]}>
        Resultado: {situacao(pessoa)}
      </Text>
      <View style={styles.fixToText}>
        <Button
          title="Editar"
          onPress={() => props.navigation.navigate("Criar", pessoa)}
          type="clear"
          icon={<Icon name="edit" size={25} color="#3366cc" />}
        />
        <Text> </Text>
        <Button
          title="Excluir"
          onPress={() =>
            Alert.alert("Confirmação", "Deseja realmente excluir esta pessoa?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Excluir", onPress: () => handleExcluirPessoa() },
            ])
          }
          type="clear"
          icon={<Icon name="delete" size={25} color="#e62e00" />}
        />
      </View>
    </View>
  );

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  textoPadrao: {
    fontSize: 20,
    padding: 10,
  },
  textoDestaque: {
    fontWeight: "bold",
  },
  botao: {
    margin: 10,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 10,
  },
});


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Criar" component={Criar} />
        <Stack.Screen name="Lista" component={UserList} />
        <Stack.Screen name="Detalhes" component={UserDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const style = StyleSheet.create({
  form: {
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 5,
    padding: 10,
  },
});

export default App;
