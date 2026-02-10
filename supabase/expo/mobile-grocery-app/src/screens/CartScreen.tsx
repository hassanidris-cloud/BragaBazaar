import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CartScreen() {
  // For demo: use local state. Replace with context or global state for real app.
  const [cart, setCart] = useState<CartItem[]>([]);

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>€{item.price.toFixed(2)} x {item.quantity}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <Text style={{ color: '#fff' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Total: €{total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.checkoutBtn}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f8f8f8', borderRadius: 8, padding: 10 },
  name: { flex: 1, fontSize: 16 },
  price: { fontSize: 16, marginRight: 12 },
  removeBtn: { backgroundColor: '#e31e24', borderRadius: 8, padding: 8 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  checkoutBtn: { backgroundColor: '#4a6d1a', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
});
