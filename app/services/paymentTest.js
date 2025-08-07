import { StripeProvider } from '@stripe/stripe-react-native';

export const testStripeIntegration = async () => {
  try {
    await StripeProvider.init({
      publishableKey: 'your-publishable-key',
    });
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Error initializing Stripe:', error);
  }
};
