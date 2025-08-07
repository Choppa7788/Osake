import { StripeProvider } from '@stripe/stripe-react-native';

export const initializePayment = async (publishableKey) => {
  try {
    // Initialize Stripe with the publishable key
    await StripeProvider.init({
      publishableKey,
    });
    console.log('Stripe initialized successfully');
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    throw error;
  }
};

export const processPayment = async (paymentDetails) => {
  try {
    // ...existing code for processing payment...
    console.log('Payment processed successfully');
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Remove the top-level await calls below.
// Do NOT call async functions at the top-level in a module file.
// Instead, call these from your UI or business logic code in response to user actions.

// ...existing code...
