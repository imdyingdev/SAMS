import {
  useFonts as useKronaOne,
  KronaOne_400Regular,
} from '@expo-google-fonts/krona-one';

import {
  useFonts as useKrub,
  Krub_200ExtraLight,
  Krub_300Light,
  Krub_400Regular,
  Krub_500Medium,
  Krub_600SemiBold,
  Krub_700Bold,
} from '@expo-google-fonts/krub';

import {
  useFonts as useDarkerGrotesque,
  DarkerGrotesque_300Light,
  DarkerGrotesque_400Regular,
  DarkerGrotesque_500Medium,
  DarkerGrotesque_600SemiBold,
  DarkerGrotesque_700Bold,
  DarkerGrotesque_800ExtraBold,
  DarkerGrotesque_900Black,
} from '@expo-google-fonts/darker-grotesque';

export const useFonts = () => {
  const [kronaOneLoaded] = useKronaOne({
    KronaOne_400Regular,
  });

  const [krubLoaded] = useKrub({
    Krub_200ExtraLight,
    Krub_300Light,
    Krub_400Regular,
    Krub_500Medium,
    Krub_600SemiBold,
    Krub_700Bold,
  });

  const [darkerGrotesqueLoaded] = useDarkerGrotesque({
    DarkerGrotesque_300Light,
    DarkerGrotesque_400Regular,
    DarkerGrotesque_500Medium,
    DarkerGrotesque_600SemiBold,
    DarkerGrotesque_700Bold,
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_900Black,
  });

  return kronaOneLoaded && krubLoaded && darkerGrotesqueLoaded;
};
