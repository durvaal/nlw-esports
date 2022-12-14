import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import logoImage from '../../assets/logo-nlw-esports.png';

import { Background } from '../../components/Background';

import { GameCard, GameCardProps } from '../../components/GameCard';
import { Heading } from '../../components/Heading';

import { styles } from './styles';

export function Home() {
  const [games, setGames] = useState<GameCardProps[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navitation = useNavigation();

  const getGames = () => {
    fetch('http://192.168.1.14:3000/games')
      .then(response => response.json())
      .then(data => {
        setGames(data);
      });
  }

  const handleOpenGame = ({ id, title, bannerUrl }: GameCardProps) => {
    navitation.navigate('game', { id, title, bannerUrl });
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getGames();
    setRefreshing(false);
  }

  useEffect(() => {
    getGames();
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <Image
          source={logoImage}
          style={styles.logo}
        />

        <Heading
          title="Encontre seu duo!"
          subtitle="Selecione o game que deseja jogar..."
        />


        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <FlatList
            data={games}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <GameCard
                data={item}
                onPress={() => handleOpenGame(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.contentList}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}