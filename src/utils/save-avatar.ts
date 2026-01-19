import { supabase } from "@/db/supabase";

export const saveAvatar = async (svg: string) => {
    const { data, error } = await supabase.functions.invoke('save-avatar', {
        body: { svg },
    });

    if (error) {
        let errorMessage = "Failed to save avatar";

        // Attempt to parse the error response from the Edge Function
        if (error && typeof error === 'object' && 'context' in error) {
            const response = (error as any).context as Response;
            try {
                // Clone the response because reading the body might consume it
                const errorData = await response.clone().json();
                if (errorData && errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Could not parse JSON or body already consumed
                console.warn("Could not parse error response JSON", e);
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        console.error("Save avatar error:", errorMessage, error);
        throw new Error(errorMessage);
    }

    return data;
};
