import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CheckoutScreen() {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    // TODO: Integrate payment and order creation logic
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.success}>Order placed successfully!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <TextInput
        style={styles.input}
        placeholder="Delivery Address"
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.label}>Payment Method</Text>
      <TouchableOpacity
        style={[styles.paymentBtn, paymentMethod === 'card' && styles.selected]}
        onPress={() => setPaymentMethod('card')}
      >
        <Text>Credit/Debit Card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.paymentBtn, paymentMethod === 'mbway' && styles.selected]}
        onPress={() => setPaymentMethod('mbway')}
      >
        <Text>MB Way</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={handleCheckout}
        disabled={processing}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{processing ? 'Processing...' : 'Place Order'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  paymentBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  selected: { borderColor: '#4a6d1a', backgroundColor: '#eafbe7' },
  checkoutBtn: { backgroundColor: '#4a6d1a', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
  success: { fontSize: 22, color: 'green', textAlign: 'center', marginTop: 40 },
});
