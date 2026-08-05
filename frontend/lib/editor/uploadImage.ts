import { supabase } from "@/lib/supabase";

export async function uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Image upload failed:", error);
        throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

    return data.publicUrl;
}