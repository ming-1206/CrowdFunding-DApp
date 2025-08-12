import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId =
  process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "your_client_id_here";

if (!clientId || clientId === "your_client_id_here") {
  throw new Error(
    "Please replace 'your_client_id_here' with your actual thirdweb client ID"
  );
}

export const client = createThirdwebClient({
  clientId: clientId,
});
