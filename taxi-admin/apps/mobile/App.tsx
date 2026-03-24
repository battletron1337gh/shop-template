import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from './src/store/auth.store';
import { LoginScreen } from './src/screens/auth/login.screen';
import { RegisterScreen } from './src/screens/auth/register.screen';
import { DashboardScreen } from './src/screens/dashboard/dashboard.screen';
import { RidesScreen } from './src/screens/rides/rides.screen';
import { AddRideScreen } from './src/screens/rides/add-ride.screen';
import { ExpensesScreen } from './src/screens/expenses/expenses.screen';
import { AddExpenseScreen } from './src/screens/expenses/add-expense.screen';
import { TaxScreen } from './src/screens/tax/tax.screen';
import { SettingsScreen } from './src/screens/settings/settings.screen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ritten') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Kosten') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Belasting') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Instellingen') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Ritten" component={RidesScreen} />
      <Tab.Screen name="Kosten" component={ExpensesScreen} />
      <Tab.Screen name="Belasting" component={TaxScreen} />
      <Tab.Screen name="Instellingen" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="AddRide" 
              component={AddRideScreen}
              options={{ headerShown: true, title: 'Rit toevoegen' }}
            />
            <Stack.Screen 
              name="AddExpense" 
              component={AddExpenseScreen}
              options={{ headerShown: true, title: 'Kost toevoegen' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
