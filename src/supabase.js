import { createClient } from "@supabase/supabase-js";
import { customAlphabet } from "nanoid";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 4);
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const createRecord = async (records, sharers, transfer) => {
  const secret = nanoid();
  console.log(nanoid());
  const { data, error } = await supabase
    .from("expenses")
    .insert({ records, sharers, secret, transfer })
    .select("secret");
  if (error) {
    console.log("Something went wrong");
  }
  return { data: data[0], error, secret };
};

export const updateRecord = async (secret, records, sharers, transfer) => {
  const { error } = await supabase
    .from("expenses")
    .update({ records, sharers, transfer })
    .eq("secret", secret);
  if (error) {
    console.log("Something went wrong");
  }
};

export const fetchRecord = async secret => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("secret", secret);
  if (!error) {
    return { data: data[0], error };
  } else {
    return { data: null, error: error };
  }
};

export const deleteRecord = async secret => {
  await supabase.from("expenses").delete().eq("secret", secret);
};
