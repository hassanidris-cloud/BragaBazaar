import { supabase } from './supabaseClient';

export async function getProducts() {
  return await supabase.from('products').select('*');
}

export async function addOrder(order: any) {
  return await supabase.from('orders').insert([order]);
}
