import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId =
  process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID ||
  "7be0c197ff4f2aa245848e6aad4ba2a8";

// Only check and throw error in the browser (client-side)
if (typeof window !== "undefined") {
  if (!clientId || clientId === "7be0c197ff4f2aa245848e6aad4ba2a8") {
    throw new Error(
      "Please replace 'your_client_id_here' with your actual thirdweb client ID"
    );
  }
}

export const client = createThirdwebClient({
  clientId,
});
