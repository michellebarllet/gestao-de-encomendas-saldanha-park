import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState('');
  const [residentName, setResidentName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [collectorName, setCollectorName] = useState('');
  const [selectedTab, setSelectedTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Carrega os dados armazenados no AsyncStorage ao iniciar o app
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@packages');
        if (jsonValue != null) {
          setPackages(JSON.parse(jsonValue));
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };
    loadPackages();
  }, []);

  // Função para salvar os pacotes no AsyncStorage
  const savePackages = async (packages) => {
    try {
      const jsonValue = JSON.stringify(packages);
      await AsyncStorage.setItem('@packages', jsonValue);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const addPackage = () => {
    if (newPackage && residentName && apartmentNumber) {
      const newEntry = {
        id: Date.now(),
        package: newPackage,
        resident: residentName,
        apartment: apartmentNumber,
        isCollected: false,
        collectionInfo: null,
      };
      const updatedPackages = [...packages, newEntry];
      setPackages(updatedPackages);
      savePackages(updatedPackages); // Salva os dados no AsyncStorage
      setNewPackage('');
      setResidentName('');
      setApartmentNumber('');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos!');
    }
  };

  const confirmCollection = (id) => {
    if (documentNumber.length === 11 && collectorName.length > 0) {
      const updatedPackages = packages.map((item) =>
        item.id === id
          ? {
              ...item,
              isCollected: true,
              collectionInfo: {
                documentNumber: documentNumber,
                collectorName: collectorName,
                timestamp: new Date().toLocaleString(),
              },
            }
          : item
      );
      setPackages(updatedPackages);
      savePackages(updatedPackages); // Atualiza os dados no AsyncStorage
      setDocumentNumber('');
      setCollectorName('');
      Alert.alert('Confirmado', 'A encomenda foi retirada.');
    } else {
      Alert.alert('Erro', 'Preencha o CPF e o nome de quem está retirando.');
    }
  };

  const uncollectedPackages = packages.filter((item) => !item.isCollected);
  const collectedPackages = packages.filter((item) => item.isCollected);

  const renderContent = () => {
    if (selectedTab === 'home') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registrar Nova Encomenda</Text>
          <TextInput
            style={styles.input}
            value={newPackage}
            onChangeText={setNewPackage}
            placeholder="Descrição da encomenda"
          />
          <TextInput
            style={styles.input}
            value={residentName}
            onChangeText={setResidentName}
            placeholder="Nome do morador"
          />
          <TextInput
            style={styles.input}
            value={apartmentNumber}
            onChangeText={setApartmentNumber}
            placeholder="Número do apartamento"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={addPackage}>
            <Text style={styles.buttonText}>Registrar Encomenda</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (selectedTab === 'uncollected') {
      return (
        <View style={styles.section}>
          <Text style={styles.largeTitle}>Encomendas Pendentes</Text>
          {uncollectedPackages.length === 0 ? (
            <Text>Nenhuma encomenda pendente</Text>
          ) : (
            <FlatList
              data={uncollectedPackages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text>
                    Morador: {item.resident}, Apto: {item.apartment} - Encomenda: {item.package}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={documentNumber}
                    onChangeText={setDocumentNumber}
                    placeholder="Número do Documento (CPF)"
                    keyboardType="numeric"
                    maxLength={11}
                  />
                  <TextInput
                    style={styles.input}
                    value={collectorName}
                    onChangeText={setCollectorName}
                    placeholder="Nome de quem está retirando"
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => confirmCollection(item.id)}
                  >
                    <Text style={styles.buttonText}>Confirmar Retirada</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      );
    } else if (selectedTab === 'collected') {
      return (
        <View style={styles.section}>
          <Text style={styles.largeTitle}>Encomendas Retiradas</Text>
          {collectedPackages.length === 0 ? (
            <Text>Nenhuma encomenda foi retirada</Text>
          ) : (
            <FlatList
              data={collectedPackages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text>
                    Morador: {item.resident}, Apto: {item.apartment} - Encomenda: {item.package}
                  </Text>
                  <Text>Nome de quem retirou: {item.collectionInfo?.collectorName}</Text>
                  <Text>Documento: {item.collectionInfo?.documentNumber}</Text>
                  <Text>Retirada em: {item.collectionInfo?.timestamp}</Text>
                </View>
              )}
            />
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={30}
          color="black"
          onPress={() => setMenuOpen(!menuOpen)}
          style={styles.menuIconLeft}
        />
        {selectedTab === 'home' && <Text style={styles.title}>Gestão de Encomendas</Text>}
      </View>

      {renderContent()}

      {menuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => { setSelectedTab('home'); setMenuOpen(false); }}>
            <Text style={styles.menuText}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSelectedTab('uncollected'); setMenuOpen(false); }}>
            <Text style={styles.menuText}>Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSelectedTab('collected'); setMenuOpen(false); }}>
            <Text style={styles.menuText}>Retiradas</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e88e5',
    marginLeft: 10,
  },
  menuIconLeft: {
    paddingLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#0d47a1',
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0d47a1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    borderColor: '#0d47a1',
      borderWidth: 1,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    borderColor: '#0d47a1',
    borderWidth: 1,
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  menuText: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default App;

