import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import logoImage from '../../assets/logo-nlw-esports.png';

import { Background } from '../../components/Background';

import { styles } from './styles';
import { THEME } from '../../theme';

import { GameParams } from '../../@types/navigation';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { useEffect, useState } from 'react';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState<string>('');

  const route = useRoute();
  const game = route.params as GameParams;

  const navitation = useNavigation();

  const handleGoBack = () => {
    navitation.goBack();
  }

  const getAdsByGame = () => {
    fetch(`http://192.168.1.14:3000/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => {
        setDuos(data);
      });
  }

  const getDiscordUser = async (adId: string) => {
    fetch(`http://192.168.1.14:3000/ads/${adId}/discord`)
      .then(response => response.json())
      .then(data => {
        setDiscordDuoSelected(data.discord);
      });
  }

  useEffect(() => {
    getAdsByGame();
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
              onPress={handleGoBack}
            />
          </TouchableOpacity>

          <Image
            source={logoImage}
            style={styles.logo}
          />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.bannerUrl}
          resizeMode="cover"
        />
        
        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => getDiscordUser(item.id)}
            />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[duos.length ? styles.contentList : styles.emptyListContent]}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          onClose={() => setDiscordDuoSelected('')}
          discord={discordDuoSelected}
        />
      </SafeAreaView>
    </Background>
  );
}