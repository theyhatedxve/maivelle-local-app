import { Redirect } from 'expo-router';
import HomeScreen from '@/frontend/features/dashboard/screens/home-screen';
import { usePhaseOnePreview } from '@/frontend/features/onboarding/stores/phase-one-preview';

export default function HomeEntry() {
  const { enteredPreview } = usePhaseOnePreview();
  return enteredPreview ? <HomeScreen /> : <Redirect href="/welcome" />;
}
