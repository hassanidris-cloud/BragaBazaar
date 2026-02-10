import { supabase } from '../../supabaseConfig';

export async function uploadFile(bucket, filePath, file) {
  return await supabase.storage.from(bucket).upload(filePath, file);
}

export async function downloadFile(bucket, filePath) {
  return await supabase.storage.from(bucket).download(filePath);
}
