import { supabase } from '../../supabaseConfig';

export async function getProducts() {
  return await supabase.from('products').select('*');
}

export async function addOrder(order) {
  return await supabase.from('orders').insert([order]);
}
