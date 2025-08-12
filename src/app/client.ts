import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
const clientId =
  process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID ||
  "7be0c197ff4f2aa245848e6aad4ba2a8";

// Only warn in the browser
if (typeof window !== "undefined") {
  if (!clientId || clientId === "7be0c197ff4f2aa245848e6aad4ba2a8") {
    console.warn(
      "⚠️ Warning: Using placeholder Thirdweb client ID. Please set NEXT_PUBLIC_TEMPLATE_CLIENT_ID in your environment variables."
    );
  }
}

export const client = createThirdwebClient({
  clientId,
});
