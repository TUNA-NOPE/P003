
import msal
import pandas as pd
import random


file_id = '2DA205B15AD2661!165'
client_id = "23b513d2-0ffb-49c9-b6d9-ab901d537099"
client_secret = "4MW8Q~yyZrF8sIiz9VHzyySOHheRuBFZ2UdNmapf"
SCOPES = ['https://graph.microsoft.com/.default']





# Set up the ConfidentialClientApplication
app = msal.ConfidentialClientApplication(
    client_id,
    client_credential=client_secret,
)

# Get a token
token_response = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])

# Check if the token was successfully obtained
if "access_token" in token_response:
    access_token = token_response["access_token"]

    # Now you can use the access token to make requests to Microsoft Graph API
    url = "https://graph.microsoft.com/v1.0/me/drive/root/children"
    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers)

    print(response.json())
else:
    print("Authentication failed.")
    print(token_response.get("error_description", "No error description provided."))
