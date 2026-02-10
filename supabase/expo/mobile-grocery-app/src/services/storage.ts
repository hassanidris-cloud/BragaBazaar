import { supabase } from './supabaseClient';

export async function uploadFile(bucket: string, filePath: string, file: File) {
  return await supabase.storage.from(bucket).upload(filePath, file);
}

export async function downloadFile(bucket: string, filePath: string) {
  return await supabase.storage.from(bucket).download(filePath);
}
