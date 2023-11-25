import requests
import msal
import pandas as pd
import random

# service_name = "OneDriveAPI"
# username = "dtamir121@gmail.com"


# file_id = '2DA205B15AD2661!165'




# # Replace these with your own values
# client_id = "your_client_id"
# client_secret = "your_client_secret"
# authority = "https://login.microsoftonline.com/your_tenant_id"

# # Set up the ConfidentialClientApplication
# app = msal.ConfidentialClientApplication(
#     client_id,
#     authority=authority,
#     client_credential=client_secret,
# )

# # Get a token
# token_response = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])

# # Check if the token was successfully obtained
# if "access_token" in token_response:
#     access_token = token_response["access_token"]

#     # Now you can use the access token to make requests to Microsoft Graph API
#     url = "https://graph.microsoft.com/v1.0/me/drive/root/children"
#     headers = {
#         "Authorization": "Bearer " + access_token,
#         "Content-Type": "application/json",
#     }

#     response = requests.get(url, headers=headers)

#     print(response.json())
# else:
#     print("Authentication failed.")
#     print(token_response.get("error_description", "No error description provided."))

















# Create data for each grade
data = []
for grade in range(1, 50):
    grade_class = f'Grade {grade}'
    student_names = names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
                         'Katherine', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Samuel', 'Taylor']
    for name in student_names:
        data.append({'Class': grade_class, 'Student Name': name, 'Attendance': ''})

# Create a DataFrame
df = pd.DataFrame(data)

# Save to Excel file
file_name = 'attendance.xlsx'
df.to_excel(file_name, index=False)














